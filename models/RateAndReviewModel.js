import mongoose from "mongoose";

const RateAndReviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        require:true,
    },
    review:{
        type:String,
        require:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
      },
      proId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'professional', 
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
    }
      ,})

const RateAndReviewModel = mongoose.model('RateAndReview',RateAndReviewSchema)
export default RateAndReviewModel