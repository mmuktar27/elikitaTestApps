import axios from "axios";
import { createAuditLogEntry, createSession } from "@/components/shared/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
import { userCache } from "@/lib/cache";

// Simple in-memory cache implementation
const startUserSession = async (userId: string) => {
  const sessionData = {
    userId,
    lastHeartbeat: new Date(),
    isActive: true,
  };

  try {
    const response = await createSession(sessionData);
    console.log("Session created successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};

const apiClient = (token: string) =>
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/admin`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-App-Secret": 'hello',
    },
  });

const fetchUserDetails = async (userId: string, token: string, forceRefresh = false) => {
  const cacheKey = `user_${userId}`;
  if (!forceRefresh) {
    const cachedData = userCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  try {
    const response = await apiClient(token).get(`/user/${userId}`);
    const userData = response.data[0];

    if (userData) {
      userCache.set(cacheKey, userData);
    }

    return userData;
  } catch (error) {
    console.error(`Failed to fetch user details for ID ${userId}:`, error);
    return null;
  }
};

const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile email offline_access  User.Read User.ReadBasic.All Calendars.Read",
          response_type: "code",
          response_mode: "query",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ account, profile }) {
      const userId = (profile as any)?.oid;
      if (!userId) return false;

      try {
        const userDetails = await fetchUserDetails(userId, account?.id_token || '', true);

        if (userDetails) {
          await createAuditLogEntry({
            userId: userDetails?.id || userId,
            activityType: "Login",
            entityId: userDetails?.id || userId,
            entityModel: "Staff",
            details: "User logged in successfully",
          });
          startUserSession(userDetails?.id || userId);
        }
      } catch (error) {
        console.error("Failed to create login audit log:", error);
      }

      return true;
    },

    async jwt({ token, account, profile }) {
      if (profile) {
        token.microsoftId = (profile as any)?.oid;

        if (account?.access_token) {
          token.accessToken = account.access_token;
          try {
            const userDetails = await fetchUserDetails(token.microsoftId as string, account.id_token as string, true);
            if (userDetails) {
              // Only update roles if they are missing or outdated
              if (!token.roles || token.roles !== userDetails.roles) {
                token.roles = userDetails.roles;
              }
            }
          } catch (err) {
            console.error("Error fetching user details:", err);
          }
        }
      }

      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token as string;
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : 0;
      }

      // If token is expired, refresh it
      if (!token.expiresAt || typeof token.expiresAt !== 'number' || Date.now() < token.expiresAt - FIVE_MINUTES_IN_MS) {
        return token;
      }

      try {
        if (!token.refreshToken || typeof token.refreshToken !== 'string') {
          console.warn('No refresh token available');
          return token;
        }

        const response = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_B2C_TENANT_NAME}/oauth2/v2.0/token`, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          body: new URLSearchParams({
            client_id: process.env.AZURE_AD_B2C_CLIENT_ID as string,
            client_secret: process.env.AZURE_AD_B2C_CLIENT_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
          }),
        });

        const tokens = await response.json();

        if (!response.ok) throw tokens;

        token.accessToken = tokens.access_token;
        token.refreshToken = (tokens.refresh_token ?? token.refreshToken) as string;
        token.expiresAt = Date.now() + tokens.expires_in * 1000;

        if (token.microsoftId) {
          try {
            const userDetails = await fetchUserDetails(token.microsoftId as string, tokens.idToken);
            if (userDetails) {
              // Only update roles if they are missing or outdated
              if (!token.roles || token.roles !== userDetails.roles) {
                token.roles = userDetails.roles;
              }
            }
          } catch (err) {
            console.error("Error fetching user details during refresh:", err);
          }
        }
      } catch (error) {
        console.error('Error refreshing access token', error);
        token.error = 'RefreshAccessTokenError';
      }

      return token;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },

    async session({ session, token }) {
      if (!token.microsoftId || !token.idToken) {
        return session;
      }

      try {
        const userDetails = await fetchUserDetails(token.microsoftId as string, token.idToken as string);

        if (userDetails) {
          session.user = {
            ...session.user,
            id: userDetails.id,
            roles: userDetails.roles,
            workEmail: userDetails.workEmail as string,
            microsoftId: token.microsoftId as string,
          };

          session.tokenSub = token.sub as string;
          session.accessToken = token.accessToken as string;
          session.idToken = token.idToken as string;
        }
      } catch (error) {
        console.error("Error enriching session with user details:", error);
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
