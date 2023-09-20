import express from "express";
import {AddCategory,Login,Home,BlockPost,BlockUser,deleteCategory} from '../controllers/adminController.js';
import { authMiddleware as auth } from '../middleware/auth.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


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

adminRoute.get('/home',auth,Home)
adminRoute.post('/login',Login)
adminRoute.post("/addCategory", upload.single("image"),AddCategory)
adminRoute.post('/deleteCategory',deleteCategory)

adminRoute.post('/blockPost',BlockPost)
adminRoute.post('/blockUser',BlockUser)


export default adminRoute