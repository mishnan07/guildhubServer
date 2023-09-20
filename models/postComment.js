import mongoose from "mongoose";

const postCommentSchema = new mongoose.Schema({

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
        ref: 'Post', 
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

const postCommentModel = mongoose.model('postComment',postCommentSchema)
export default postCommentModel