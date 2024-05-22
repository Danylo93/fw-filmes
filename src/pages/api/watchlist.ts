import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { mediaId, mediaType } = req.body;

  if (req.method === 'PUT') {
    await prisma.watchlist.create({
      data: {
        user: { connect: { email: session.user.email } },
        mediaId,
        mediaType,
      },
    });
    return res.status(201).json({ message: 'Added to watchlist' });
  }

  if (req.method === 'DELETE') {
    await prisma.watchlist.deleteMany({
      where: {
        user: { email: session.user.email },
        mediaId,
        mediaType,
      },
    });
    return res.status(200).json({ message: 'Removed from watchlist' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
