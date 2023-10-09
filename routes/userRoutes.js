import express from 'express';
import { Register,EditProfile,Login,Home,GoogleLogin,GetPost,userDetails,Like,Comments,
         ClientDetails,Following,GetQuestion,likeQuestion,questionComment,
         DeletePost,SavePost,Report,otpLogin,sendOtp,verifyOtp,resetPassword, deleteQuestion, detailsUserPro, getSavedPost, getPostPosted, usersAndpros} from '../controllers/userController.js';
import { getRequirements,hiredPros,Hiring, uploadRequirement } from '../controllers/requirementController.js';
import { authMiddleware as auth } from '../middleware/auth.js';
import { createChat, findChat, getUser, userChats } from '../controllers/chatController.js';
import { addMessage, getMessage } from '../controllers/messageController.js';
import {  FetchChats } from '../controllers/chatsController.js';
import { FetchNotification } from '../controllers/notificationController.js';
import { RateAndReview, getReteandReview } from '../controllers/RateAndReviewController.js';

import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { GetCategory, profilePic, quesionUpload } from '../controllers/proController.js';
import { editeQuestion } from '../controllers/quesionController.js';


// Get the current file's directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const userRoute = express.Router()

userRoute.post('/register',Register);
userRoute.post('/login',Login)
userRoute.get('/',auth,Home)
userRoute.post('/googleLogin',GoogleLogin)
userRoute.post('/otpLogin',otpLogin)
userRoute.post('/sendOtp',sendOtp)
userRoute.post('/verifyOtp',verifyOtp)
userRoute.post('/resetPassword',resetPassword)

userRoute.post('/profilePic',auth,upload.single('image'),profilePic)
userRoute.get('/getPost',auth,GetPost)
userRoute.get('/usersAndpros',auth,usersAndpros)
userRoute.get('/userDetails',auth,userDetails)
userRoute.get('/clientDetails',auth,ClientDetails)
userRoute.get('/detailsUserPro/:userId',auth,detailsUserPro)
userRoute.post('/like',auth,Like)
userRoute.post('/comment',auth,Comments)
userRoute.post('/deletePost',auth,DeletePost)
userRoute.post('/savePost',auth,SavePost)
userRoute.get('/getSavedPost/:userId/:type',getSavedPost)
userRoute.post('/report',auth,Report)
userRoute.get('/getPostPosted/:userId',getPostPosted)
userRoute.get('/getQuestion',auth,GetQuestion)
userRoute.post('/likeQuestion',auth,likeQuestion)
userRoute.post('/following',auth,Following)
userRoute.post('/questionComment',auth,questionComment)
userRoute.post('/deleteQuestion',auth,deleteQuestion)
userRoute.get('/requirement',auth,getRequirements)
userRoute.get('/hiredPros/:id',auth,hiredPros)
userRoute.post('/hiring',auth,Hiring)
userRoute.post('/editProfile',auth,EditProfile)
userRoute.post('/quesionUpload',auth, upload.array('image'), quesionUpload);
userRoute.post('/editeQuestion',auth, upload.array('image'),editeQuestion);
userRoute.post('/uploadRequirement',auth,upload.single('image'),uploadRequirement)
userRoute.get('/getCategory',auth,GetCategory)



userRoute.post('/createChat',auth,createChat)
userRoute.get('/chat/:userId',auth,userChats)
userRoute.get('/find/:firstId/:secondId',auth,findChat)
userRoute.get('/user/:id',auth,getUser)
userRoute.post('/addMessage',auth,addMessage)
userRoute.get('message/:chatId',auth,getMessage)


userRoute.get('/FetchChats/:id/:receiverId',auth,FetchChats)
userRoute.get('/FetchNotification/:id',auth,FetchNotification)
userRoute.get('/getReteandReview/:proId/:LogedUserId',auth,getReteandReview)
userRoute.post('/RateAndReview',auth,RateAndReview)




export default userRoute;