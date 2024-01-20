import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
   
    receiverId: String,    
    notifications: [
      {
        text: {
          type: String,
          required: true,
        },
        itemId:{
          type:String,
          required:true  
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
      timestamp: {
          type: Date,
          default: Date.now
      }

      },
    ],
  },
);

const notificationModel = mongoose.model("notification", notificationSchema);

export default notificationModel;