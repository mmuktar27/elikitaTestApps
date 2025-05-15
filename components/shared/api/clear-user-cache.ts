// pages/api/clear-user-cache.ts

import { userCache } from "@/lib/cache";
import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token || !token.microsoftId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const cacheKey = `user_${token.microsoftId}`;
  userCache.delete(cacheKey);

  return res.status(200).json({ message: "User cache cleared" });
}
