import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import {Server} from 'socket.io'
import http from 'http'
import adminRouter from './routes/adminRoutes.js'
import userRouter from './routes/userRoutes.js'
import proRouter from './routes/professionalRoutes.js'
import { log } from 'console'
import { updateNotification } from './controllers/notificationController.js'
import { messageUpdate } from './controllers/chatsController.js'



dotenv.config()
// app.use (express.static (path.join (__dirname, '/public')))

const app = express()

const server = http.createServer(app)

const io=new Server(server,{
    cors: {
      origin:"https://guildhub-client.vercel.app/",
      methods:["GET","POST","PATCH"]
    }
  })
  


  io.on("connection", (socket) => {

  
  
 
  
    socket.on('message', (a) => {
    });
  
    socket.on('chatRoom', (newMessage) => {
      io.emit(newMessage.receiverId, newMessage);
      messageUpdate(newMessage)
    });

    socket.on('notification',(receiverId,itemId,senderId,senderType,text)=>{
        io.emit(receiverId,itemId,senderId,senderType,text)
        updateNotification(receiverId,itemId, senderId, senderType,text)
    })
 

    socket.on('online',(userId,onlineType)=>{
      io.emit('ListOnline', userId,onlineType)
      console.log(userId,'userId',onlineType);

    })
  });



  

app.use(express.json({limit:'30mb',extended:true}))
app.use(morgan('dev'))
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())



app.use('/admin',adminRouter)
app.use('/',userRouter)
app.use('/professional',proRouter)

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
console.log(port,'===================================ppp');


mongoose.connect(databaseUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
   
    server.listen(port,()=>{
    console.log(`express app listening on port${port}` );
})
}).catch((error)=>{console.log(`${error} did not connect`);})