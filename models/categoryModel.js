import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        require:true,
        trim:true,
        uppercase:true
    },
    image:{
        type:String,
        require:true
    }
})

const categoryModel = mongoose.model('category',categorySchema)
export default categoryModel