import bycrpt from 'bcrypt'
import proModel from '../models/proModel.js'
import requirementModel from '../models/requirementModel.js'
import Image from '../models/postModel.js'
import QuestionModel from '../models/questionModel.js'
import { generateAuthToken } from '../middleware/auth.js'
import categoryModel from '../models/categoryModel.js'
import userModel from "../models/userModel.js";




export const uploadRequirement = async(req,res)=>{
    try {
        const { message, budget, location, userId } = req.body;
        const image = req.file ? req.file.filename : ''; // Check if an image was uploaded
    console.log(message,'ppppppppppppp');
        const newRequirement = new requirementModel({
          requirement: message,
          image:image,
          budget:budget,
          location:location,
          userId:userId
        });
    
        await newRequirement.save();
        res.status(201).json({ message: 'Requirement uploaded successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

export const getRequirements = async (req, res) => {
    try {
      const response = await requirementModel.find({});
      const users = await userModel.find({})
      const pros = await proModel.find({})
      console.log(response, 'ppppp');
      res.status(200).json({ response ,users,pros});
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const interested = async (req, res) => {
    try {
      const { userId, requirementId } = req.body; // Add proId to the destructuring
      console.log(requirementId, 'pp');
      
      const document = await requirementModel.findOne(
        {_id:requirementId},)

       const exist =  document.interesteds.includes(userId)
        console.log(exist,'pppppppppp');

        if(exist){
          return res.json({message:'already applied'})
        }
      const update = await requirementModel.updateOne(
        { _id: requirementId },
        { $push: { interesteds: userId  } }
      );
      
      res.status(200).json({ message: 'Successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


  export const Hiring = async (req, res) => {
    try {
      const { userId, requirementId } = req.body; // Add proId to the destructuring
      
      const document = await requirementModel.findOne(
        {_id:requirementId},)

       const exist =  document.hired.includes(userId)

        if(exist){
          return res.json({message:'already applied'})
        }
      const update = await requirementModel.updateOne(
        { _id: requirementId },
        { $push: { hired: userId  } }
      );
      
      res.status(200).json({ message: 'Successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };