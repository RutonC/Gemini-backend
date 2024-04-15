import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'



const router = Router();
const prisma = new PrismaClient();

router.post('/', async(req, res)=>{
  const {name, password, email} = req.body;

  try {
    const saltRound = 12;
    const encryptedPassword = bcrypt.hashSync(password, saltRound);

    const result = await prisma.user.create({
      data: {
        name,
        password:encryptedPassword,
        username:email,
        email
      }
    })
    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({error:"email should be unique"})
  }
})

router.get('/',async(req,res)=>{
 const allUser = await prisma.user.findMany();
 res.status(200).json(allUser);

})

router.get('/:id',async(req,res)=>{
  const {id} = req.params;
  const user = await prisma.user.findUnique({
    where:{id:Number(id)},
    include:{conversations:true}
  });

  res.status(200).json(user)
})

router.put('/:id', async(req, res)=>{
  const {id} = req.params;
  const {name, avatar, password} = req.body;
  try{
    const saltRount = 12;
    const encryptedPassword = bcrypt.hashSync(password,saltRount)
    const result = await prisma.user.update({
      where:{id:Number(id)},
      data:{
        name,
        avatar,
        password:encryptedPassword
      }
    });

    res.status(200).json(result);

  }catch(error){
    res.status(400).json({error:"Failed to update the user"})
  }
})

router.delete('/:id',async(req,res)=>{
  const {id} = req.params;

  try{
    await prisma.user.delete({
      where:{id:Number(id)},
    });
    res.status(200).json({sucess:"Delete user sucessifully!"})
  }catch(e){
    res.status(400).send({error:"Failed to delete the user!"})
  }
})

export default router;