import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { GoogleGenerativeAI } from "@google/generative-ai";



const router = Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

async function saveMessage(sender:string,message:string, conversationId:number ){
 const result = await prisma.message.create({
    data:{
      senderName:sender,
      sender:sender,
      message:message,
      conversationId:conversationId
    }
  })

  return result
}

router.post('/', async(req, res)=>{
  const {sender,message,conversationId} = req.body;
  
  try {

    const model= genAI.getGenerativeModel({model: "gemini-pro"});
    const chat = model.startChat({
      history:[],
      generationConfig:{
        maxOutputTokens:500,
      }
    });

    const resutAI = await chat.sendMessage(message);
    const response = await resutAI.response;
    const textAI = await response.text();

    const data = await saveMessage(sender,message,conversationId)

    const dataAPI = await saveMessage("chatAI",textAI, conversationId )
    
    
    res.json({user:data, chatAI:dataAPI, textAI});

    // const result = await prisma.message.create({
    //   data: {
    //     text:textAI,
    //     sender,
    //     conversationId
    //   }
    // })
    // res.status(200).json({user:result});

  } catch (error) {
    res.status(400).json({error:"Failed sending message!"+error},)
  }
})

router.get('/',async(req,res)=>{
 const message = await prisma.message.findMany({include:{conversation:true}});
 res.status(200).json(message);

})

router.get('/:id',async(req,res)=>{
  const {id} = req.params;
  const user = await prisma.message.findUnique({
    where:{id:Number(id)},
    include:{conversation:true}
  });
  res.status(200).json(user)
})

router.put('/:id', async(req, res)=>{
  const {id} = req.params;
  const { message,
    sender,senderName,
    conversationId} = req.body;
  try{
    const result = await prisma.message.update({
      where:{id:Number(id)},
      data:{
        message,
        senderName,
        sender,
        conversationId
      }
    });

    res.status(200).json(result);

  }catch(error){
    res.status(400).json({error:"Failed to update the message"})
  }
})

router.delete('/:id',async(req,res)=>{
  const {id} = req.params;
  try{
    await prisma.message.delete({
      where:{id:Number(id)},
    });
    res.status(200).json({sucess:"Delete message sucessifully!"})
  }catch(e){
    res.status(400).send({error:"Failed to message the conversation!"})
  }
})

export default router;