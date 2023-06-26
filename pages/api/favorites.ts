import type { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(404).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    const favoritesMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in:currentUser?.favoritesIds
        }
      }
    });
    
    return res.status(200).json(favoritesMovies);
  } catch (error) {
    console.log(error);
    return res.status(404).json({message:'Error'});        
  }
}
