const mongoose=require('mongoose')
const moment=require('moment')
const timesTamps=moment().format();
const ChatModal=mongoose.Schema(
    {
    chatName:{type:String ,trim:true},
    // isGroupChat: băng false là chat chỉ vói 2 người .
    isGroupChat:{type:Boolean,default:false},
    //mot mang chứa các thành viên đại diện trong cuộc trò chuyện 
    //thằng user này lúc lưu trữa trên mongodb có cấu trúc
    // users:[{
    //     0:5f9b1b3b9b0b3c2f0c8b3b1a,
     //   1:5f9b1b3dfdsfsfb9b0b3c2f0c8b3b1a,
    // }]
    //trong mảng này mình muông biết nó phục thuộc vào modal nào thì mình phải ref đên
    //modal đó 
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
   //tin nhắn gần nhât 
    latesMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
    },
    //dại diẹn cho người quản lý group 
    groupAdmin:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    timesTamps:{type: String, default: timesTamps }
},


)
const Chat = mongoose.model("Chat", ChatModal);
module.exports=Chat
