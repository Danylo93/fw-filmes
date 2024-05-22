import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'; // Importa o Prisma Client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { mediaId, mediaType } = req.body;

  if (req.method === 'PUT') {
    await prisma.favorite.create({
      data: {
        user: { connect: { email: session.user.email } },
        mediaId,
        mediaType,
      },
    });
    return res.status(201).json({ message: 'Added to favorites' });
  }

  if (req.method === 'DELETE') {
    await prisma.favorite.deleteMany({
      where: {
        user: { email: session.user.email },
        mediaId,
        mediaType,
      },
    });
    return res.status(200).json({ message: 'Removed from favorites' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
