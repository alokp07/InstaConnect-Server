const chats  = require('../modals/chatModel')

exports.newChat = async(body)=>{
    const {clientOne , clientTwo , message} = body;

    try{
        
        const chatRoom = await chats.findOne({
            $or: [
              { clientOne, clientTwo },
              { clientOne: clientTwo, clientTwo: clientOne }
            ]
          });

        if(chatRoom){
            const currentMessage = chatRoom.messages;
            currentMessage.push(message)

            const update = {
                clientOne,
                clientTwo,
                messages:currentMessage
            }

            await chats.updateOne({
                $or: [
                  { clientOne, clientTwo },
                  { clientOne: clientTwo, clientTwo: clientOne }
                ]
              },update)
            
        }
        else{

            const newMessage = new chats({
                clientOne,
                clientTwo,
                messages:message
            })

            await newMessage.save()
        }

    }catch(err){
        console.log(err);
    }
}

exports.getChat = async(req,res)=>{
    const {clientOne , clientTwo } = req.body;
    
    try{

        const chatRoom = await chats.findOne({
            $or: [
              { clientOne, clientTwo },
              { clientOne: clientTwo, clientTwo: clientOne }
            ]
          });
        
          res.status(200).json(chatRoom)

    }catch(err){
        res.status(500).json(err)
    }
}