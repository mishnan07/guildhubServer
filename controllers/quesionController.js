import QuestionModel from "../models/questionModel.js";






export const editeQuestion = async (req, res) => {
    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    try {

      let questionId = req.body.questionId
      console.log(questionId,'===============================');
      let userID = req.body.userId
      let message =  req.body.message
      let images = [];
      for (let i = 0; i < req.files.length; i++) {
        images[i] = req.files[i].filename;
      }

      for (let i = 0; i < req.files.length; i++) {
        var mediaMIME = req.files[i].mimetype;
  
        if (mediaMIME.startsWith('image/')) {
          var img = images        }
        else if (mediaMIME.startsWith('video/')) {
          var vid = images
        }
      }
      const Question = await QuestionModel.updateOne({_id:questionId},{
        image: img,
        category:req.body.category,
        message:message,
        userId:userID
      })
     
    
      res.status(201).json({ message: 'uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image' });
    }
  };