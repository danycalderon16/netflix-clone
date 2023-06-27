import type { NextApiRequest, NextApiResponse } from 'next'
import primsa from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET'){
    return res.status(405).json({message:'Method not supported'});
  }

  try {
    await serverAuth(req,res);

    const { movieId } = req.query;

    if(typeof movieId !== 'string'){
      throw new Error('Invalid ID');
    }

    if(!movieId){
      throw new Error('Invalid ID');
    }

    const movie = await primsa.movie.findUnique({
      where: { id: movieId }
    });

    if(!movie){
      throw new Error('Invalid ID movie');
    }

    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error});    
  }

  res.status(200).json({ name: 'Example' })
}