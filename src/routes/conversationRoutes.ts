import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from 'bcrypt'



const router = Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

router.post('/', async(req, res)=>{
  const {subject, userId} = req.body;

  try {
    const result = await prisma.conversation.create({
      data: {
        subject,
        userId
      }
    })
    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({error:"email should be unique"})
  }
})

router.get('/',async(req,res)=>{
 const conversation = await prisma.conversation.findMany({include:{user:true}});
 res.status(200).json(conversation);

})

router.get('/:id',async(req,res)=>{
  const {id} = req.params;
  const user = await prisma.conversation.findUnique({
    where:{id:Number(id)},
    include:{user:true}
  });
  res.status(200).json(user)
})

router.put('/:id', async(req, res)=>{
  const {id} = req.params;
  const { subject,
    userId} = req.body;
  try{
    const result = await prisma.conversation.update({
      where:{id:Number(id)},
      data:{
        subject,
        userId
      }
    });

    res.status(200).json(result);

  }catch(error){
    res.status(400).json({error:"Failed to update the conversation"})
  }
})

router.delete('/:id',async(req,res)=>{
  const {id} = req.params;
  try{
    await prisma.conversation.delete({
      where:{id:Number(id)},
    });
    res.status(200).json({sucess:"Delete conversation sucessifully!"})
  }catch(e){
    res.status(400).send({error:"Failed to delete the conversation!"})
  }
})

export default router;