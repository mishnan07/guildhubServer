import MessageMOdel from "../models/MessageModel.js";

export const addMessage = async(req,res)=>{
    const {chatId, senderId , text} = req.body
    const message = new MessageMOdel({
        chatId,
        senderId,
        text
    })
    try {
        const result = await message.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}



export const getMessage = async(req,res)=>{
    const {chatId} = req.params
 
    try {
        const result = await MessageMOdel.find({chatId})
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

