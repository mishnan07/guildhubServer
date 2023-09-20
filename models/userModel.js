import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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

       isAdmin:{
            default:false,
            type:Boolean
       },
       //following
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
    //followeres
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

const userModel = mongoose.model("users", userSchema);
export default userModel;
