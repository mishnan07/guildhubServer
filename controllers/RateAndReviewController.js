import RateAndReviewModel from "../models/RateAndReviewModel.js";
import requirementModel from "../models/requirementModel.js";

export const RateAndReview = async(req,res)=>{
    try {
        const newReview = req.body.newReview
        const response =await RateAndReviewModel.create({
            rating:newReview.rating,
            review:newReview.review,
            userId:newReview.LogedUserId,
            proId:newReview.proId
        })
        res.status(200).json({message:'successfully upload review'})
    } catch (error) {
        res.status(500).json({error:error.message})

    }
}

export const getReteandReview = async(req,res)=>{
    try {
        let isHired = false
        const proId = req.params.proId
        const LogedUserId= req.params.LogedUserId
        const RateAndReview = await RateAndReviewModel.find({proId:proId})

        const hiredUser = await requirementModel.find({userId:LogedUserId,hired:proId})
        if(hiredUser.length > 0){
            isHired = true
        }
      
        res.status(200).json({RateAndReview,isHired})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}