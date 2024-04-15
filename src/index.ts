import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import useRoutes from './routes/userRoutes'
import conversationRoutes from './routes/conversationRoutes'
import messageRoutes from './routes/messageRoutes'
import dotenv from 'dotenv'
dotenv.config();


const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");


app.use(express.json());

app.use('/user', useRoutes)
app.use('/message', messageRoutes)
app.use('/conversation', conversationRoutes)

app.get('/',(req,res)=>{
  res.send("HEllo Gemini")
})

app.listen(3003, ()=>{
  console.log("Server running in port 3003");
})
