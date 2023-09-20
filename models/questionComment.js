import mongoose from "mongoose";

const questionCommentSchema = new mongoose.Schema({

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
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question', 
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }

})

const questionCommentModel = mongoose.model('questionComment',questionCommentSchema)
export default questionCommentModel