import axios from "axios";
import {createAuditLogEntry} from "@/components/shared/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
//          redirect_uri: "http://localhost:3000", // Custom Redirect URI

const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile user.Read email User.ReadBasic.All",
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
      if ((profile as any)?.oid) {
        try {
          // Get user info from your API if available
          let userDetails;
          try {
            const response = await axios.get(
              `https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/admin/user/${(profile as any).oid}`,
              {
                headers: {
                  Authorization: `Bearer ${account?.access_token}`,
                },
              }
            );
            userDetails = response.data[0];
          } catch (error) {
            console.error("Failed to get user details for audit log:", error);
          }

          // Create audit log entry
          await createAuditLogEntry({
            userId: userDetails?.id || (profile as any).oid,
            activityType: "Login",
            entityId: userDetails?.id || (profile as any).oid,
            entityModel: "Staff",
            details: "User logged in successfully",
          });
        } catch (error) {
          console.error("Failed to create login audit log:", error);
          // Still allow login even if audit logging fails
        }
        return true;
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      if (profile) {
        token.microsoftId = (profile as any)?.oid;
        try {
          const response = await axios.get(
            `https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/admin/user/${token.microsoftId}`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          );

          const userDetails = response.data[0];
          token.roles = userDetails.roles;
        } catch (error: any) {
          return token;
        }
      }

      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      try {
        if (token.microsoftId) {
          const response = await axios.get(
            `https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/admin/user/${token.microsoftId}`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          );

          const userDetails = response.data[0];

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

          token.user = {
            id: userDetails.id,
            roles: userDetails.roles,
            microsoftId: token.microsoftId as string,
          };
         
        }

        return session;
      } catch (error) {
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
