const mongoose=require('mongoose')
const moment=require('moment')
const timesTamps=moment().format();
const UserModal=mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    sdt:{type:String,unique: true, required: true },
    password: { type: String, required: true },
    pic:{type:String,default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',   required: true}
    ,role:{type:Boolean,required:true,default:false},
    timesTamps:{type: String, default: timesTamps }
}
)
UserModal.index({ name: 1, email: 1, sdt: 1 });
module.exports=mongoose.model("User",UserModal)