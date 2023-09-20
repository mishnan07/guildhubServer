import { Timestamp } from "mongodb";
import mongoose from "mongoose";


const likeSchema = new mongoose.Schema(
    {
        userType: {
            type: String,
            enum: ['users', 'professional'],
            required: true
          },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userType',
            required: true
          },
        liked: {
            type: Boolean,
            default: true,
      },
    },
    {
      timestamps: true,
    }
  );


const postSchema = new mongoose.Schema({

    image:{
        type:Array,
    },
    video:{
        type:Array,
    },
    message:{
        type:String,
        
    },
    likes: [likeSchema], // Array of likes
    date: {
      type: String,
    },
   
    date:{
        type:String
    },
    isReported:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
    proId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'professional'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    report:[{
      userType: {
        type: String,
        enum: ['users', 'professional'],
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType',
        required: true
      },
      reason: {
        type: String,
        required: true,
      },
    }]
   
  },
  {
    timestamps:true
  }
  
  );
  
  const Image = mongoose.model('post', postSchema);
  export default Image

