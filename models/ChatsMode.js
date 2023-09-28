import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
   
     

    members: [String],
    
    messages: [
      {
        text: {
          type: String,
          required: true,
        },
        senderType: {
            type: String,
            enum: ["users", "professional"],
            required: true,
          },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "senderType",
            required: true,
          },
          reciverType: {
            type: String,
            enum: ["users", "professional"],
            required: true,
          },
          reciverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reciverType",
            required: true,
          },
        is_read: {
          type: Boolean,
          default: false
      },
      read_at: {
          type: Date
      },
      timestamp: {
          type: Date,
          default: Date.now
      }

      },
    ],
  },
);

const ChatModels = mongoose.model("Chat", chatSchema);

export default ChatModels;