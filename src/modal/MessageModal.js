const mongoose=require("mongoose")
const moment=require('moment')
const timesTamps=moment().format();
const MessageModal=mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    content:{type:String,require:true},
    // chat: Đại diện cho cuộc trò chuyện, có kiểu dữ liệu ObjectId tham chiếu đến bảng "Chat".
    chat:{type:mongoose.Schema.Types.ObjectId,ref:'Chat'},
    // readBy: Một mảng chứa các ObjectId tham chiếu đến bảng "User", đại diện cho người dùng đã đọc tin nhắn.
    readBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    timesTamps:{type: String, default: timesTamps }
},

)
module.exports=mongoose.model("Message",MessageModal)