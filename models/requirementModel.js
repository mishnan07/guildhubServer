import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema({
    requirement:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true
    },
    budget:{
        type:String,
    },
    location:{
        type:String,
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    interesteds:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'professional'
    }],
    hired:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'professional'
}],
})

const requirementModel = mongoose.model('requirement',requirementSchema)
export default requirementModel