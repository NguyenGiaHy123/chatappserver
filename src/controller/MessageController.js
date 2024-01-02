const Message=require('../modal/MessageModal')
const User=require('../modal/UserModal')
const Chats=require('../modal/ChatModal');
const { default: mongoose } = require('mongoose');
class MessageController{
    async sendMessage(rq, rs) {
        try{
        const { chatId, content } = rq.body;
        const { _id } = rq.userData;
        console.log(chatId)
   
      
        const newMessage = {
          chat: chatId,
          content: content,
          sender: _id,
        };
      
        var message = await Message.create(newMessage);
        var messageAfterSender=await Message.findById(message._id)
        .populate('sender').populate('chat')
        
       //nay de lau ra nam pic va email thoi 
        messageAfterSender = await User.populate(messageAfterSender, {
          path: 'chat.users',
          select: 'name pic email',
        });
      
        await Chats.findByIdAndUpdate(chatId, {
          latesMessage: messageAfterSender,
        });
      
        rs.json(messageAfterSender);
        console.log(123);
    }
    catch(err){
        console.log(err)
        rs.status(400).json({
            message:err
        })
    }
      }

      async getAllMessage(rq, rs) {
        try{
            const {chatId}=rq.query
            const messages=await Message.find({chat:new mongoose.Types.ObjectId(chatId)})
            .populate('sender')
            .populate('chat')
          
            rs.status(200).json(messages)
        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }

      }
      
}

module.exports=new MessageController
