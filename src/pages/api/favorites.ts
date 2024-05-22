import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { mediaType, mediaId } = req.body;

  if (!mediaType || !mediaId) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.method === "PUT") {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          mediaId,
          mediaType,
        },
      });
      return res.status(201).json({ message: "Added to favorites" });
    } else if (req.method === "DELETE") {
      await prisma.favorite.deleteMany({
        where: {
          userId: user.id,
          mediaId,
          mediaType,
        },
      });
      return res.status(200).json({ message: "Removed from favorites" });
    } else {
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
