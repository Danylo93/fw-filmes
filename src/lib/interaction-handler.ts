import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { MediaType } from "@/types/general";
import { parseMediaDetailsData } from "@/lib/media-parser";
import * as TMDB from "@/lib/tmdb";
import { pick } from "@/utils/util";
import { Session } from "next-auth";

const prisma = new PrismaClient();

type UserStateCollection = "favorites" | "watchlist";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null,
  userStateCollection: UserStateCollection
) => {
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const userId = session.user.id;

  switch (req.method) {
    case "GET": {
      try {
        const userState = await prisma[userStateCollection].findMany({
          where: {
            userId,
          },
        });
        res.status(200).json({ results: userState });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    }

    case "DELETE":
    case "PUT": {
      const mediaId = Number(req?.body?.mediaId ?? 0);
      const mediaType: `${MediaType}` | null | undefined = req?.body?.mediaType;

      if (
        isNaN(mediaId) ||
        mediaId === 0 ||
        !mediaType ||
        !(mediaType === MediaType.Movie || mediaType === MediaType.TV)
      ) {
        res.status(400).json({ message: "Bad request" });
        return;
      }

      try {
        if (req.method === "DELETE") {
          await prisma[userStateCollection].deleteMany({
            where: {
              userId,
              mediaId,
              mediaType,
            },
          });
          res.status(204).end();
        } else {
          // PUT
          const rawMediaData = await (mediaType === MediaType.Movie
            ? TMDB.getMovieDetailsById(mediaId)
            : TMDB.getTvShowDetailsById(mediaId));

          const mediaData = parseMediaDetailsData(rawMediaData);

          await prisma[userStateCollection].upsert({
            where: {
              userId_mediaId_mediaType: {
                userId,
                mediaId,
                mediaType,
              },
            },
            create: {
              userId,
              mediaId,
              mediaType,
              title: mediaData.title,
              posterImageUrl: mediaData.posterImageUrl,
              year: mediaData.year,
              path: getPath(mediaData.id, mediaData.title, mediaData.mediaType),
            },
            update: {},
          });

          res.status(201).end();
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: `There was an error ${
            req.method === "DELETE" ? "deleting" : "adding"
          } the media to ${userStateCollection}`,
        });
      }

      break;
    }

    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
};

export async function favoritesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) {
  return handler(req, res, session, "favorites");
}

export async function watchlistHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) {
  return handler(req, res, session, "watchlist");
}
