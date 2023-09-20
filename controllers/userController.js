import { token } from "morgan";
import { generateAuthToken } from "../middleware/auth.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import proModel from "../models/proModel.js";
import postModel from '../models/postModel.js'
import postCommentModel from "../models/postComment.js";
import { json } from "express";

import jwt from "jsonwebtoken";
import QuestionModel from "../models/questionModel.js";
import questionCommentModel from "../models/questionComment.js";
import dotenv from 'dotenv'


import twilio from 'twilio';
dotenv.config()

const secretKey = process.env.SECRET_KEY


const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
  } = process.env;
  
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true,
  });
  







// professional details
export const userDetails = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, secretKey);
    let user
  
        user = await proModel.findById(decodedToken.payload._id);

 
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user });
  } catch (error) {
    console.error(error); 
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

//user  details
export const ClientDetails = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, secretKey);
      let user
          user = await userModel.findById(decodedToken.payload._id);
      
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ user });
    } catch (error) {
      console.error(error); 
      res.status(401).json({ message: "Authentication failed", error: error.message });
    }
  };


export const Register = async(req,res)=>{
    try {
        let userDetails = req.body;
        const user = await userModel.find({email:userDetails.email})
        
       
        if(user.length === 0){
            userDetails.password = await bcrypt.hash(userDetails.password,10)
            await userModel.create({
                name:userDetails.name,
                email:userDetails.email,
                phone:userDetails.phone,
                password:userDetails.password,
                location:userDetails.location
            }).then((data)=>{
                console.log(data);
            }).catch((error)=>{
                console.log(error);
            })
            res.status(200).json({status:true,result:userDetails})
        }else{
            return res.json({mes:'user already exist'})
            // return res.json({error:true})
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const otpLogin = async (req, res) => {
    try {
        const { phone } = req.body
        const user = await userModel.findOne({ phone })
        if (user) {
            const token = generateAuthToken(user)
            const data = {
                token,
                name: user.name,
                userId: user._id,
                role: 'user'
            }
            res.status(200).json({ data })
        } else {
            res.status(404).json({ errMsg: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}





  export const sendOtp = async (req, res) => {
    try {
        // Ensure the phoneNumber includes the country code
        let phoneNumber = req.body.phoneNumber;
        const user = await userModel.findOne({ phone:phoneNumber })
        console.log(user,'====zzz');
          if(!user){
            console.log('keriiii');
            return res.json({
                success: false,
                message: `Not registerd phone:`,
              });
          }
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = `+91${phoneNumber}`; // Assuming it's an Indian number
        }
    console.log(phoneNumber,'ph');
        // Send OTP using the Verify Service
        const otpResponse = await client.verify
          .services(TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({
            to: phoneNumber,
            channel: 'sms',
          });
    console.log(otpResponse,TWILIO_VERIFY_SERVICE_SID);
        res.status(200).json({
          success: true,
          message: 'OTP sent successfully',
          otpResponse,
        });
        console.log();
      } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({
          success: false,
          message: `Failed to send OTP: ${error.message}`,
        });
      }
  };



  export const verifyOtp = async (req, res) => {
    try {
      const { TWILIO_VERIFY_SERVICE_SID } = process.env;
      const { verificationSid, otp, phoneNumber } = req.body;
  
      // Ensure the phoneNumber includes the country code
      let formattedPhoneNumber = phoneNumber;
      if (!formattedPhoneNumber.startsWith('+')) {
        formattedPhoneNumber = `+91${formattedPhoneNumber}`; // Assuming it's an Indian number
      }
  
      // Verify the OTP
      const verificationCheck = await client.verify
        .services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: formattedPhoneNumber,
          code: otp,
        });
  console.log(verificationCheck,'vvvv');
      if (verificationCheck.status === 'approved') {
        res.status(200).json({
          success: true,
          message: 'OTP verified successfully',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid OTP',
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      res.status(500).json({
        success: false,
        message: `Failed to verify OTP: ${error.message}`,
      });
    }
  };

  export const resetPassword = async(req,res)=>{
    console.log(req.body.phone,'aaaqqppppppppppppppppppp');
    try {
      const { phone, newPassword } = req.body;
  
      // Find the user by phone number
      const user = await userModel.findOne({ phone });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found for this phone', success: false });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  
      res.status(200).json({ message: 'Password changed successfully', success: true });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
  
  

export const EditProfile = async (req, res) => {
    try {
      let userDetails = req.body;
  
      let model;
      if (userDetails.Type === 'professional') {
        model = proModel;
      } else if (userDetails.Type === 'users') {
        model = userModel;
      }
  
      const user = await model.findOne({ email: userDetails.email });
  
      if (user) {
        const response = await model.findByIdAndUpdate(
          user._id, // Use _id of the found user
          {
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
            location: userDetails.location,
            category: userDetails.category,
            experience: userDetails.experiance, // Fixed typo in 'experience'
          }
        );
        res.status(200).json({ message: 'update successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  

  
  export const Login = async (req, res) => {
    try {
      const userDetails = req.body;
      const { email, phone, password } = userDetails;
  
      if (!email && !phone) {
        return res.status(400).json({ status: false, message: 'Email or phone is required' });
      }
  
      let findUser;
  
      if (email) {
        findUser = await userModel.findOne({ email });
      } else if (phone) {
        findUser = await userModel.findOne({ phone });
      }
  
      if (!findUser) {
        console.log('lllllllllllllll');
        return res.json({ status: false, message: 'User not found' });
      }
  
      if (findUser.isBanned === true) {
        return res.status(403).json({ status: false, message: 'You are blocked' });
      }

      let isPasswordMatch = false
       if(password){
        isPasswordMatch = await bcrypt.compare(password, findUser.password);
       }
       else if(phone){
        isPasswordMatch = true
       }
  console.log(isPasswordMatch,'pppppppp');
      if (!isPasswordMatch) {
        return res.status(401).json({ status: false, message: 'Password does not match' });
      }
  
      const token = generateAuthToken(findUser);
      const { name } = findUser;
  
      const userResponse = {
        status: true,
        message: 'Successfully logged in',
        token,
        name,
      };
  
      res.cookie('jwt', token, {
        httpOnly: false,
        maxAge: 600 * 1000,
      });
  
      return res.status(200).json({ userResponse });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'failed', message: error.message });
    }
  };
  



export const GoogleLogin=async (req,res,next)=>{
    let userSignUp ={
        status:false,
        token:null,
        message:null
    }
     try {
        console.log(req.body.email);
        const email = req.body.email
        const findUser = await userModel.findOne({email:email})
        if(findUser){
            const token = generateAuthToken(findUser)
            userSignUp.status=true
            userSignUp.token=token
            userSignUp.message='successfully logged'
            return res.status(200).json({userSignUp})

        }else{
            userSignUp.message='no user found'
            return res.json(userSignUp)
        }
     } catch (error) {
        res.status(500).json({status:'failed',message:'no user found'})
     }
}


export const Home = async (req,res,next)=>{
    try {
        const user = 'social media'
        res.status(200).json(user)
        
    } catch (error) {
        res.json({status:'failed',message:error.message})
    }
}


// 70458012518=============== checkMobile =============
export const checkMobile = async (req,res)=>{
    try {
        console.log('lllllllllllllllllllll');
        const {newPhone} = req.body
        const user = await userModel.findOne({phone: newPhone})
        if(user){
            const token = generateAuthToken(user)
            const data={
                token
            }
            res.status(200).json({data})
        }else{
          res.status(200).json({ errMsg: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error"})
   }
}

export const GetPost = async (req,res)=>{
    try {
    const randomImage = await postModel.findOne() 
    const post = await postModel.find({}).sort({_id:-1})
    const pros = await proModel.find({})
    const comments = await postCommentModel.find({}).sort({_id:-1})
    const users = await userModel.find({})

    if (randomImage && randomImage.image) {
      res.json({ imageUrl: randomImage.image[0],message:randomImage.message,
                   randomImage,post,pros,comments,users });
    } else {
      console.log('Image not found');
      res.status(404).json({ message: 'Image not found' });
    }
        
    } catch (error) {
        res.status(500).json({message:'error fetching image url',error:error.message})
    }
}

export const Like = async (req, res) => {
    try {
      const postId = req.body.postId;
      const userId = req.body.userId;
      const post = await postModel.findOne({ _id: postId });
      
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      const existingLikeIndex = post.likes.findIndex(
        (like) => like.userId && like.userId.toString() === userId
      );
      
  
      if (existingLikeIndex !== -1) {
        const existingLike = post.likes[existingLikeIndex];
        if (existingLike.liked) {
          existingLike.liked = false;
          post.likes.pull(existingLike._id);
         
        } else {
          existingLike.liked = true;
        }
      } else {
        post.likes.push({ userId, liked: true });
      }
  
      await postModel.updateOne({ _id: postId }, post);
  
      return res.status(200).json({ message: "Like status updated successfully", post });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  export const likeQuestion = async (req, res) => {
    try {
      const postId = req.body.postId;
      const userId = req.body.userId;
      const post = await QuestionModel.findOne({ _id: postId });
      
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      const existingLikeIndex = post.likes.findIndex(
        (like) => like.userId && like.userId.toString() === userId
      );
      
  
      if (existingLikeIndex !== -1) {
        const existingLike = post.likes[existingLikeIndex];
        if (existingLike.liked) {
          existingLike.liked = false;
          post.likes.pull(existingLike._id);
         
        } else {
          existingLike.liked = true;
        }
      } else {
        post.likes.push({ userId, liked: true });
      }
  
      await QuestionModel.updateOne({ _id: postId }, post);
  
      return res.status(200).json({ message: "Like status updated successfully", post });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
 
  
export const Comments = async(req,res)=>{
    try {
        let {comment,postId,userId,userType} = req.body 
       console.log('userId',userType);
      
       const newComment =  await postCommentModel.create({
        userType:userType,
        userId:userId,
        post:postId,
        content:comment
       })
        res.status(200).json({data:'ok'})
    } catch (error) {
        res.status(400).json({ error: error.message });       
         console.log(error.message);
    }
}

export const DeletePost= async(req,res)=>{
    try {
        const {postId} = req.body
        const postUpdate = await postModel.findByIdAndUpdate(postId, { isActive: false });
        res.status(200).json({message:'sucessfully deleted'})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


export const SavePost = async(req,res)=>{
    try {
        let {postId,userId,Type} = req.body;
        if(Type === 'professional'){
            const exist = await proModel.findOne({_id:userId,savedPost:{$elemMatch:{postId}}})
            if(exist){
                return res.json({message: 'Post already saved',isTrue:false  })
            }
         const response = await proModel.findByIdAndUpdate(userId,{$push:{savedPost:{postId}}})
        }else if('users'){
            const exist = await userModel.findOne({_id:userId,savedPost:{$elemMatch:{postId}}})
            if(exist){
                return res.json({message: 'Post already saved',isTrue:false })
            }
         const response = await userModel.findByIdAndUpdate(userId,{$push:{savedPost:{postId}}})
        }

        return res.status(200).json({ message: 'Post saved successfully',isTrue:true});
    } catch (error) {
        res.status(500).json({error:error.message,message: 'Post not saved '})

    }
}


export const Report = async(req,res)=>{
    try {
        const {postId,userId,userType,selectedReason} = req.body
        const response = await postModel.updateOne({_id:postId},{$push:{report:
                                    {userType:userType,
                                     userId:userId,
                                     reason:selectedReason,                                    
                                     isReported:true
                                    }}})
        return res.status(200).json({message:'reported sucessfully'})                           
        
    } catch (error) {
        res.status(500).json({error:error.message,message: 'report not saved '})

    }
}


export const questionComment = async(req,res)=>{
    try {
        let {comment,postId,userId,userType} = req.body 
      
       const newComment =  await questionCommentModel.create({
        userType:userType,
        userId:userId,
        post:postId,
        content:comment
       })
        res.status(200).json({data:'ok'})
    } catch (error) {
        res.status(400).json({ error: error.message });       
         console.log(error.message);
    }
}


export const Following = async (req, res) => {
    try {
        const { userId, userType, followerId, followerType } = req.body;
        let user;
        let followUser

        if (userType === 'professional') {
            user = await proModel.findOne({ _id: userId });
            

            const existingFollowIndex = user.follow.findIndex(
                (follower) => follower.followersId && follower.followersId.toHexString() === followerId
            );

            if (existingFollowIndex !== -1) {
                const existFollow = user.follow[existingFollowIndex];
                if (existFollow.followed) {
                    user.follow.pull(existFollow._id);
                } else {
                    existFollow.followed = true;
                }
            } else {
                user.follow.push({ userType: followerType, followersId: followerId, followed: true });
            }

            await user.save();
        } else if (userType === 'users') {
            user = await userModel.findOne({ _id: userId });

            const existingFollowIndex = user.follow.findIndex(
                (follower) => follower.followersId && follower.followersId.toHexString() === followerId
            );

            if (existingFollowIndex !== -1) {
                const existFollow = user.follow[existingFollowIndex];
                if (existFollow.followed) {
                    user.follow.pull(existFollow._id);
                } else {
                    existFollow.followed = true;
                }
            } else {
                user.follow.push({ userType: followerType, followersId: followerId, followed: true });
            }

            await user.save(); 
        }


        if (followerType === 'professional') {
            followUser = await proModel.findOne({ _id: followerId });
            const existingFollowIndex = followUser.following.findIndex(
                (follower) => follower.followersId && follower.followersId.toHexString() === userId
            );
            if (existingFollowIndex !== -1) {
                const existFollow = followUser.following[existingFollowIndex];
                if (existFollow.followed) {
                    followUser.following.pull(existFollow._id);
                } else {
                    existFollow.followed = true;
                }
            } else {
                followUser.following.push({ userType: userType, followersId: userId, followed: true });
            }
        
            await followUser.save();
        
        } else if (followerType === 'users') {
            followUser = await userModel.findOne({ _id: followerId });
        
            const existingFollowIndex = followUser.following.findIndex(
                (follower) => follower.followersId && follower.followersId.toHexString() === userId
            );
        
            if (existingFollowIndex !== -1) {
                const existFollow = followUser.following[existingFollowIndex];
                if (existFollow.followed) {
                    followUser.following.pull(existFollow._id);
                } else {
                    existFollow.followed = true;
                }
            } else {
                followUser.following.push({ userType: userType, followersId: userId, followed: true });
            }
        
            await followUser.save();
        }
        

        res.status(200).json({ message: 'Follower added/removed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};




export const GetQuestion = async (req,res)=>{
    try {
    const randomImage = await QuestionModel.findOne() 
    const post = await QuestionModel.find({}).sort({_id:-1})
    const pros = await proModel.find({})
    const comments = await questionCommentModel.find({}).sort({_id:-1})
    const users = await userModel.find({})

    if (randomImage && randomImage.image) {
      res.json({ imageUrl: randomImage.image[0],message:randomImage.message,
                   randomImage,post,pros,comments,users });
    } else {
      console.log('Image not found');
      res.status(404).json({ message: 'Image not found' });
    }
        
    } catch (error) {
        res.status(500).json({message:'error fetching image url',error:error.message})
    }
}
