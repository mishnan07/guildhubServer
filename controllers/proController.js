import bycrpt from 'bcrypt'
import proModel from '../models/proModel.js'
import Image from '../models/postModel.js'
import QuestionModel from '../models/questionModel.js'
import { generateAuthToken } from '../middleware/auth.js'
import categoryModel from '../models/categoryModel.js'
import userModel from '../models/userModel.js'


export const Register = async (req,res)=>{
    try {
        let proData = req.body
        const pro = await proModel.findOne({email:proData.email})
        if(!pro){
            proData.password = await bycrpt.hash(proData.password,10)
            proModel.create({
                name:proData.name,
                email:proData.email,
                phone:proData.phone,
                location:proData.location,
                password:proData.password,
                experiance:proData.experience,
                category:proData.category
            }).then((data)=>{
                console.log(data);
            }).catch((error)=>{
                console.log(error);
            })
            res.json({status:true,result:proData})
        }else{
            res.json({error:error.message})
        }
    } catch (error) {
        
    }
}



export const LoginPro = async (req, res) => {
  let userSignUp = {
      status: false,
      message: null,
      token:null,
      name:null
  }
  try {
      const userDetails = req.body;
      console.log(userDetails);
      const findUser = await proModel.findOne({ email: userDetails.email });
      if (findUser ) {
        if(findUser.isBanned === true){
          userSignUp.status = false
          userSignUp.message = "you are blocked";
          return res.json({userSignUp}); 
      }
          const matchUser = await bycrpt.compare(userDetails.password,findUser.password);

          if (matchUser) { 
              const token = generateAuthToken(findUser)
              const name = findUser.name
              userSignUp.status = true;
              userSignUp.token = token;
              userSignUp.name = findUser.name;       
              userSignUp.message = "sucessfully logged";

              const obj = {
                  token,
                  name
              }
              res.cookie('jwt',obj,{
                  httpOnly:false,
                  maxAge:600 * 1000
              })
              return res.status(200).json({ userSignUp }); 
          } else {
              userSignUp.status = false
              userSignUp.message = "Password does not match";
              return res.json({userSignUp}); 
          }

      } else {
          userSignUp.status = false
          userSignUp.message = "User not found";
          return res.json({ userSignUp }); 
      }
  } catch (error) {
      res.status(500).json({ status: 'failed', message: error.message }); 
  }
};



export const Upload = async (req, res) => {
    try {
      let message =  req.body.message
      let images = [];
      for (let i = 0; i < req.files.length; i++) {
        images[i] = req.files[i].filename;
      }

      for (let i = 0; i < req.files.length; i++) {
        var mediaMIME = req.files[i].mimetype;
  
        if (mediaMIME.startsWith('image/')) {
          var img = images        }
        else if (mediaMIME.startsWith('video/')) {
          var vid = images
        }
      }
      const imagePost = new Image({
        image: img,
        video:vid,
        message:message,
        proId:req.body.userId
      });
  
      // Save the image post
      await imagePost.save();
    
      res.status(201).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image' });
    }
  };



  export const quesionUpload = async (req, res) => {
      try {
        let userID = req.body.userId
        let message =  req.body.message
        let images = [];
        for (let i = 0; i < req.files.length; i++) {
          images[i] = req.files[i].filename;
        }
  
        for (let i = 0; i < req.files.length; i++) {
          var mediaMIME = req.files[i].mimetype;
    
          if (mediaMIME.startsWith('image/')) {
            var img = images        }
          else if (mediaMIME.startsWith('video/')) {
            var vid = images
          }
        }
        const Question = new QuestionModel({
          image: img,
          category:req.body.category,
          message:message,
          userId:userID
        });
    
        // Save the image post
        await Question.save();
      
        res.status(201).json({ message: 'Image uploaded successfully' });
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
      }
    };




  export const GetCategory = async (req,res)=>{
    try {
      const category =await categoryModel.find()
      res.status(200).json({category})
    } catch (error) {
      res.status(500).json({message:'error uploding category details'})
    }
  }
  


  export const profilePic = async (req, res) => {
    try {
      const image = req.file ? req.file.filename : ''; // Check if an image was uploaded
      console.log(image, 'Uploaded image filename');
      const {userId,userType}= req.body
      console.log(userId,'----------------');
     let model
      if(userType==='professional'){
         model = proModel
      }else if(userType === 'users'){
        model = userModel
      }

      console.log(userType); // Add this line to check the value of userType
console.log(model);    // Add this line to check the value of model

      const response = await model.findByIdAndUpdate({_id:userId},
                                      {profilePic:image})
      res.status(200).json({ message: 'Image updated successfully', filename: image });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };