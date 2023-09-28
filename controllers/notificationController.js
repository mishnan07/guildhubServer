import notificationModel from "../models/notificationModel.js";

export const updateNotification = async (receiverId,itemId, senderId, senderType,text) => {
  try {
    console.log(itemId,'//////////////////////////');
    await notificationModel.findOne({receiverId:receiverId})
    .then((document) => {
        if(!document){
            document = new notificationModel({
                receiverId:receiverId,
                notifications:[],
            });
        }

        const newNotification = {
            text:text,
            itemId:itemId,
            senderType:senderType,
            senderId:senderId,
            timestamp:Date.now()
        }
        document.notifications.push(newNotification)
        return document.save();
    })

    .then((result) => {
        console.log('notification saved successfully:', result);
      })
      .catch((error) => {
        console.error('Error saving notification:', error);
      });
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};



export const FetchNotification = async(req,res)=>{
    try {
        const id = req.params.id;

        const match = await notificationModel.aggregate([
            {
              $match: {
                receiverId:id
              },
            },
          ]);
          console.log(match,'ppppppppppppppp0');
        res.status(200).json({ match });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

