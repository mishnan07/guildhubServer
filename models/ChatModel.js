import mongoose  from "mongoose";

const ChatSchema =new mongoose.Schema(
    {
        members:{
            type:Array,
        },
    },
    {
        timestamps:true
    }
)

const chatModel = mongoose.model('chat',ChatSchema)
export default chatModel


