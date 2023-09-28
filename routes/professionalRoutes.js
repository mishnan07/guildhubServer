

import express from 'express';
const proRoute = express.Router();
import { Register, Upload ,LoginPro,GetCategory,quesionUpload,profilePic} from '../controllers/proController.js';
import { uploadRequirement } from '../controllers/requirementController.js';        
import { interested } from '../controllers/requirementController.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { Home } from '../controllers/userController.js';
import { authMiddleware as auth } from '../middleware/auth.js';
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

proRoute.post('/register', Register);
proRoute.post('/login',LoginPro)
proRoute.post('/upload',auth, upload.array('image'), Upload);
proRoute.post('/quesionUpload', upload.array('image'), quesionUpload);
proRoute.post('/editeQuestion', upload.array('image'),editeQuestion)

proRoute.post('/uploadRequirement',upload.single('image'),uploadRequirement)
proRoute.post('/profilePic',upload.single('image'),profilePic)



proRoute.post('/',auth, Home);

proRoute.get('/getCategory',GetCategory)

proRoute.post('/intersted',interested)

export default proRoute;
