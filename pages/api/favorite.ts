import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return addDeleteFavorites(req, res);
    default:
      return res.status(405).json({message:'Bad Request'});
  }
}

const addDeleteFavorites = async (req:NextApiRequest, res:NextApiResponse) => {
  try {
    const requestBody = req.body;  
    if (requestBody.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      
      const { movieId } = requestBody;
  
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        }
      });
  
      if (!existingMovie) {
        throw new Error('Invalid ID');
      }
  
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoritesIds: {
            push: movieId
          }
        }
      });
  
      return res.status(200).json(user);
    }

    if (requestBody.method === 'DELETE') {
      const { currentUser } = await serverAuth(req, res);
      const { movieId } = requestBody;
      
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        }
      });
      
      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      const updatedFavoriteIds = without(currentUser.favoritesIds, movieId);

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoritesIds: updatedFavoriteIds,
        }
      });

      return res.status(200).json(updatedUser);
    }
    
    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}