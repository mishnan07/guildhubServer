
import { generateAuthToken } from '../middleware/auth.js';
import categoryModel from '../models/categoryModel.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt'
import postModel from '../models/postModel.js'
import proModel from '../models/proModel.js';




export const Home = async (req,res)=>{
  try {
    const admin = 'aaaa'
    res.status(200)
    
  } catch (error) {
    res.json({status:'failed',message:error.message})
  }
}





export const Login = async (req, res) => {
  try {
    const adminData = req.body;
    const admin = await userModel.findOne({ email: adminData.email, isAdmin: true });

    if (admin) {
      const match = await bcrypt.compare(adminData.password,admin.password);

      if (match) {
        const token = generateAuthToken(admin);
        return res.status(200).json({ token, check: true }); // Return an object containing token and check status
      }
    }

    return res.status(401).json({ message: 'Unauthorized login' }); // Unauthorized status
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' }); // Internal server error status
  }
};





export const AddCategory = async (req, res) => {
  console.log('kkkkkkk9999');
  const { categoryName } = req.body;
  const imageBase64String = req.file ? req.file.filename : null;

  try {
    const category = new categoryModel({
      categoryName,
      image: imageBase64String,
    });

    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error adding category" });
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log(categoryId, 'pppp');
    const category = await categoryModel.findOne({ _id: categoryId });
    const categoryName = category.categoryName;
    
    const isExist = await proModel.findOne({ category: categoryName });

    const exists = !!isExist;

    if(exists){
      return res.json({success:false,message:'professional exist in this category'})
    }

    const update =await categoryModel.deleteOne({_id:categoryId})
    console.log(exists ? 'Documents exist' : 'No documents exist');
    res.status(200).json({success:true,message:'category delete successfully'})
    console.log(category, 'pp');
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: "Error adding category" });
  }
};


export const BlockPost = async(req,res)=>{
  try {
    const {postId} = req.body
    console.log(postId,'pppppppppppppp');
    const response = await postModel.updateOne({_id:postId},{isBanned:true})
    res.status(200).json({message:'sucessfully blocked'})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const BlockUser = async (req, res) => {
  try {
    const {userID,userType} = req.body
    const model = userType ==='users'?userModel:proModel
    let message
    const user = await model.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(user.isBanned === true){
      message= 'Successfully Unblock user'
    }else if(user.isBanned === false){
       message= 'Successfully Block user'
    }
    const updatedIsBanned = !user.isBanned;

    await model.updateOne({ _id: userID }, { isBanned: updatedIsBanned });

    res.status(200).json({ message, isBanned: updatedIsBanned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
