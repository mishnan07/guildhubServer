

import express from 'express';
const proRoute = express.Router();
import { Register, Upload ,LoginPro,GetCategory,quesionUpload,profilePic, editPost} from '../controllers/proController.js';
import { Hiring, getRequirements, hiredPros, uploadRequirement } from '../controllers/requirementController.js';        
import { interested } from '../controllers/requirementController.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { ClientDetails, Comments, DeletePost, EditProfile, Following, GetPost, GetQuestion, Home, Like, Report, SavePost, deleteQuestion, detailsUserPro, getPostPosted, getSavedPost, likeQuestion, questionComment, userDetails, usersAndpros } from '../controllers/userController.js';
import { authMiddleware as auth } from '../middleware/auth.js';
import { editeQuestion } from '../controllers/quesionController.js';
import { FetchChats } from '../controllers/chatsController.js';
import { FetchNotification } from '../controllers/notificationController.js';
import { RateAndReview, getReteandReview } from '../controllers/RateAndReviewController.js';


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

proRoute.post('/register', Register);
proRoute.post('/login',LoginPro)



proRoute.post('/upload',auth, upload.array('image'), Upload);
proRoute.post('/quesionUpload',auth, upload.array('image'), quesionUpload);
proRoute.post('/editeQuestion',auth, upload.array('image'),editeQuestion)

// proRoute.post('/uploadRequirement',auth,upload.single('image'),uploadRequirement)

proRoute.post('/profilePic',auth,upload.single('image'),profilePic)
proRoute.get('/getPost',auth,GetPost)
proRoute.get('/usersAndpros',auth,usersAndpros)
proRoute.get('/userDetails',auth,userDetails)
proRoute.get('/clientDetails',auth,ClientDetails)
proRoute.get('/detailsUserPro/:userId',auth,detailsUserPro)
proRoute.post('/like',auth,Like)
proRoute.post('/comment',auth,Comments)
proRoute.post('/deletePost',auth,DeletePost)
proRoute.post('/savePost',auth,SavePost)

proRoute.patch('/editPost',editPost)
proRoute.get('/getSavedPost/:userId/:type',getSavedPost)
proRoute.post('/report',auth,Report)
proRoute.get('/getPostPosted/:userId',getPostPosted)
proRoute.get('/getQuestion',auth,GetQuestion)
proRoute.post('/likeQuestion',auth,likeQuestion)
proRoute.post('/following',auth,Following)
proRoute.post('/questionComment',auth,questionComment)
proRoute.post('/deleteQuestion',auth,deleteQuestion)
proRoute.get('/requirement',auth,getRequirements)
proRoute.get('/hiredPros/:id',auth,hiredPros)
proRoute.post('/hiring',auth,Hiring)
proRoute.post('/editProfile',auth,EditProfile)
proRoute.get('/FetchChats/:id/:receiverId',auth,FetchChats)
proRoute.get('/FetchNotification/:id',auth,FetchNotification)
proRoute.get('/getReteandReview/:proId/:LogedUserId',auth,getReteandReview)


proRoute.post('/',auth, Home);

proRoute.get('/getCategory',GetCategory)
proRoute.post('/intersted',auth,interested)

export default proRoute;
