import mongoose from "mongoose";


const proSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        profilePic:{
         type:String,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: [6],
        },
        location: {
            type: String,
        },
       
        isBanned: { 
            type: Boolean,
            default: false 
        },
        category:{
            type:String,
        require:true,
        trim:true,
        uppercase:true
        }, 
        experiance:{
            type:Number,
            required:true
        },
        follow:[{
        userType: {
            type: String,
            enum: ['users', 'professional'],
            required: true
          },
        followersId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userType', 
        },
        followed:{
            default:true,
            type:Boolean
        }
    }],
    following:[{
        userType: {
            type: String,
            enum: ['users', 'professional'],
            required: true
          },
        followersId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userType', 
        },
        followed:{
            default:true,
            type:Boolean
        }
    }],
    savedPost:[{
        postId:{
           type: mongoose.Schema.Types.ObjectId,
           ref:'Post'
        }
    }],

     
    },
    {
        timestamps: true,
    }
);

const proModel = mongoose.model("professional", proSchema);
export default proModel;
