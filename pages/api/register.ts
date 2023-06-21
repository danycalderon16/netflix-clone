import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import prismadb from '@/lib/prismadb'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return createUser(req, res);
    default:
      return res.status(405).json({ message: 'Example' })
    }
  }  
const createUser = async(req: NextApiRequest, res: NextApiResponse)=> {
  try {
    const {email, name, password} = req.body;

    const existingUser = await prismadb.user.findUnique({
      where:{email}
    });

    if(existingUser) {
      return res.status(422).json({message:'Email already exists'});
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data:{
        email,
        name,
        hashedPassword,
        image:'',
        emailVerified: new Date(),
      }
    })

    res.status(200).json(user)
  } catch (error) {
    
  }
  
  
}
