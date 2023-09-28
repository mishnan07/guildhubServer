import ChatModels from "../models/ChatsMode.js";


export const messageUpdate = async(msg)=>{
    try {
        console.log(msg,'messageUpdate');

const senderId = msg.senderId;
const reciverId = msg.receiverId;

  await ChatModels.findOne({ members: { $all: [senderId, reciverId] } })
  
  .then((chatDocument) => {
    if (!chatDocument) {
console.log('no dczzzzzzzzzz');
        chatDocument = new ChatModels({
        members: [senderId, reciverId],
        messages: [], 
      });
      console.log(chatDocument,'newww   =========dcss');
    }

    const newChatMessage = {
      text: msg.text,
      senderType: msg.senderType, 
      senderId: senderId,
      reciverType: msg.receiverType,
      reciverId: reciverId, 
      timestamp: Date.now(), 
    };

    chatDocument.messages.push(newChatMessage);

    return  chatDocument.save();
  })
  .then((result) => {
    console.log('Chat saved successfully:', result);
  })
  .catch((error) => {
    console.error('Error saving chat:', error);
  });

     
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}

export const FetchChats = async (req, res) => {
    try {
      console.log(req.params.id,'aaaaaaareq.params.id');
      const id = req.params.id;
      const receiverId = req.params.receiverId;
  
      const match = await ChatModels.aggregate([
        {
          $match: {
            members: {
              $all: [id, receiverId],
            },
          },
        },
      ]);
  console.log(match,'req.params.idreq.params.idreq.params.idreq.params.id');
      res.status(200).json({ match });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
