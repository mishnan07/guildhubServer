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


const questionSchema = new mongoose.Schema({

    image:{
        type:Array,
        
    },
    message:{
        type:String,
        
    },
    category:{
        type:String
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
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
   
  },
  {
    timestamps:true
  }
  
  );
  
  const QuestionModel = mongoose.model('question', questionSchema);
  export default QuestionModel

