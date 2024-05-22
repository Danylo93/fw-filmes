import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { MediaType, UserStateCollection } from "@/types/general";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const mediaId = Number(req.query.mediaId ?? 0);
  const mediaType = req.query.mediaType as `${MediaType}` | undefined;

  if (
    isNaN(mediaId) ||
    mediaId === 0 ||
    !mediaType ||
    !(mediaType === MediaType.Movie || mediaType === MediaType.TV)
  ) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const userEmail = session.user.email;

  if (!userEmail) {
    res.status(400).json({ message: "User email not found in session." });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  if (req.method === "GET") {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        mediaId,
        mediaType,
      },
    });

    const watchlist = await prisma.watchlist.findFirst({
      where: {
        userId: user.id,
        mediaId,
        mediaType,
      },
    });

    res.status(200).json({
      mediaId,
      mediaType,
      isInFavorites: !!favorite,
      isInWatchlist: !!watchlist,
    });
  } else {
    console.error(
      `Unsupported method type ${req.method} made to endpoint ${req.url}`
    );
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
