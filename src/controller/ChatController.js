const { default: mongoose } = require('mongoose');
const Chat=require('../modal/ChatModal')
const User=require('../modal/UserModal');
const { options } = require('../router/Chat');
class UserController{
    async accessChat(rq,rs){
        try{
            const {_id}=rq.userData
            const {userID}=rq.body;
            // { isGroupChat: false }:
            // Đây là điều kiện tìm kiếm để chỉ lấy
            //  các cuộc trò chuyện không phải là nhóm.
            //tìm kiêm các cuộc trò chuyện mà chứa id người dùng 
            //id ngươif dùng là id mà khi login nó lấy từ token 
            //và id mà và n người muốn chat 
            var ischat=await Chat.find({
                isGroupChat:false,
                $and:[
                    {users:{$elemMatch:{$eq:_id}}},
                    {users:{$elemMatch:{$eq:userID}}}
                ]
            }).populate('users','-password').populate('latesMessage')
          
          /*
          populate là nó sẽ dự trên id trong mảng và trả về nguyên object của user -pasword
          loại bỏ trường password không lấy 
          lassmesst dự vào id láy tin nhắn gần nhất 
          */

          
            ischat=await User.populate(ischat,{
               path:"latesMessage.sender" ,
               select:"name pic email"
            })
            if(ischat.length>0){
              
                rs.send(ischat[0])
            }
            else{
                var chatData={
                    chatName:'sender',
                    isGroupChat:false,
                    users:[_id,userID]
                }
                try{
                    const createChat=await Chat.create(chatData)
                    const Fullchat=await Chat.findOne({_id:createChat._id}).populate(
                        'users',
                        '-password'
                    )
                    rs.status(200).send(Fullchat)
                }
                catch(err){
                    console.log(err)
                    rs.status(400).json({
                        message:err
                    })
                }
            }
        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }

    }

    async getChat(rq,rs){
        try{
         const {_id}=rq.userData
     
         var chat =await Chat.find(
          {users:{$elemMatch:{$eq:_id}}}
         ).populate('users','-password')
         .populate('groupAdmin','-password')
         .populate('latesMessage')
         .sort({timesTamps:-1})
            chat=await User.populate(chat,{
                path:'latesMessage.sender',
                select:'name pic email'
            })
         if(!chat){
            rs.status(400).json({
                message:"không có cuộc trò chuyện nào"
            })
         }
         rs.status(200).json({
            Chat:chat
         })
        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
    }

    async CreateChatGroup(rq,rs){
        try{
          
        const {users,name}=rq.body
        // const usersparse=JSON.parse(users)
        const {userData}=rq
        const datauser=[userData._id,...users]
        if(users.length<2){
            rs.status(400).json({
                message:'nhóm không nhỏ hơn 2 người '
            })
        }
        const charGroup={
            chatName:name,
            isGroupChat:true,
            users:datauser,
            groupAdmin:userData
        }
        const isGroupChatNew=await Chat.create(charGroup)
        const fullGroupChat=await Chat.findById(isGroupChatNew._id)
        .populate('users','-password')
         .populate('groupAdmin','-password')
         rs.status(200).json({
            fullGroupChat:fullGroupChat
         })

        }
        catch(err)
        {
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
    }

    async RenameChat(rq,rs){
        const {chatId,chatName}=rq.body
        try{
            const chatupdate=await Chat.findByIdAndUpdate(chatId,{chatName},{new:true})
            .populate('users','-password')
            .populate('groupAdmin','-password')
            rs.status(200).json({
                chatupdate:chatupdate
            })

        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }

    }

    async RemoveChat(rq,rs){
        const {chatId}=rq.body
        try{
            const chatDelete=await Chat.findByIdAndDelete(chatId)
        
            rs.status(200).json({
                idGroup:chatDelete._id
            })

        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
    }

    

    async addtoGroup(rq,rs){
        const {chatId,userID}=rq.body
        try{
            const chatAdd=await Chat.findByIdAndUpdate(chatId,{
                $push:{users:userID}
            },{new:true})
            .populate('users','-password')
            .populate('groupAdmin','-password')
            rs.status(200).json({
                idGroupAddtoMembers:chatAdd
            })

        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
    }

    async removeMemembersChat(rq,rs){
        const {chatId,userID}=rq.body
        try{
            const chatremove=await Chat.findByIdAndUpdate(chatId,{
                $pull:{users:userID}
            },{new:true}).populate('users','-password')
            .populate('groupAdmin','-password')
            rs.status(200).json({
                chatremove
            })

        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
            

    }

}
module.exports=new UserController