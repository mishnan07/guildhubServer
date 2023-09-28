import chatModel from "../models/ChatModel.js";
import userModel from "../models/userModel.js";

export const createChat = async(req,res)=>{
    console.log('vannuuuuuu');
    const newChat = new chatModel({
        members:[req.body.senderId, req.body.receiverId]
    })

    try {
        const result = await newChat.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const userChats = async(req,res)=>{
 console.log('kkkkkkkkkkkkkk',req.params.userId);
    try {
        const chat = await chatModel.find({
            members:{$in:[req.params.userId]}   
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}


export const findChat = async(req,res)=>{
 
    try {
      const chat = await chatModel.findOne({
        members:{$all:[req.params.firstId,req.params.secondId]}
      })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await userModel.findById(id);
      if (user) {
        const { password, ...otherDetails } = user._doc;
  
        res.status(200).json(otherDetails);
      } else {
        res.status(404).json("No such User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };
