import express from "express";
import {AddCategory,Login,Home,BlockPost,BlockUser,deleteCategory} from '../controllers/adminController.js';
import { authMiddleware as auth } from '../middleware/auth.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { GetPost, usersAndpros } from "../controllers/userController.js";
import { GetCategory } from "../controllers/proController.js";


const adminRoute = express.Router()


// Get the current file's directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/category'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

adminRoute.get('/getPost',auth,GetPost)
adminRoute.get('/usersAndpros',auth,usersAndpros)

adminRoute.get('/home',auth,Home)
adminRoute.post('/login',Login)
adminRoute.post("/addCategory",auth,upload.single("image"),AddCategory)
adminRoute.get('/getCategory',auth,GetCategory)
adminRoute.post('/deleteCategory',auth,deleteCategory)

adminRoute.post('/blockPost',auth,BlockPost)
adminRoute.post('/blockUser',auth,BlockUser)

 
export default adminRoute