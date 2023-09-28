import express from 'express';
import { Register,EditProfile,Login,Home,GoogleLogin,GetPost,userDetails,Like,Comments,
         ClientDetails,Following,GetQuestion,likeQuestion,questionComment,
         DeletePost,SavePost,Report,otpLogin,sendOtp,verifyOtp,resetPassword, deleteQuestion, detailsUserPro} from '../controllers/userController.js';
import { getRequirements,hiredPros,Hiring } from '../controllers/requirementController.js';
import { authMiddleware as auth } from '../middleware/auth.js';
import { createChat, findChat, getUser, userChats } from '../controllers/chatController.js';
import { addMessage, getMessage } from '../controllers/messageController.js';
import { FetchChats } from '../controllers/chatsController.js';
import { FetchNotification } from '../controllers/notificationController.js';

const userRoute = express.Router()

userRoute.post('/register',Register);
userRoute.post('/login',Login)
userRoute.get('/',auth,Home)
userRoute.post('/googleLogin',GoogleLogin)
userRoute.post('/otpLogin',otpLogin)
userRoute.post('/sendOtp',sendOtp)
userRoute.post('/verifyOtp',verifyOtp)
userRoute.post('/resetPassword',resetPassword)

userRoute.get('/getPost',auth,GetPost)
userRoute.get('/userDetails',auth,userDetails)
userRoute.get('/clientDetails',auth,ClientDetails)
userRoute.get('/detailsUserPro/:userId',detailsUserPro)

userRoute.post('/like',auth,Like)
userRoute.post('/comment',auth,Comments)
userRoute.post('/deletePost',auth,DeletePost)
userRoute.post('/savePost',auth,SavePost)
userRoute.post('/report',auth,Report)


userRoute.get('/getQuestion',auth,GetQuestion)
userRoute.post('/likeQuestion',auth,likeQuestion)
userRoute.post('/following',auth,Following)
userRoute.post('/questionComment',auth,questionComment)
userRoute.post('/deleteQuestion',deleteQuestion)

userRoute.get('/requirement',getRequirements)
userRoute.get('/hiredPros/:id',hiredPros)
userRoute.post('/hiring',Hiring)
userRoute.post('/editProfile',EditProfile)

userRoute.post('/createChat',createChat)
userRoute.get('/chat/:userId',userChats)
userRoute.get('/find/:firstId/:secondId',findChat)
userRoute.get('/user/:id',getUser)

userRoute.post('/addMessage',addMessage)
userRoute.get('message/:chatId',getMessage)


userRoute.get('/FetchChats/:id/:receiverId',FetchChats)

userRoute.get('/FetchNotification/:id',FetchNotification)







export default userRoute;