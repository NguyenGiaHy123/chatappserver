const User=require('../modal/UserModal')
const bcrypt=require('bcrypt')
const {signAccessTokenForRegisterEmail,signAccesstokenId}=require('../helpers/helpers')
const sendMail=require('./sendMail')
const jwt=require('jsonwebtoken')
const { default: mongoose } = require('mongoose');
class UserController{
    async UserRegister(rq,rs){
        try{
            
            const {name,email,sdt,password,picture}=rq.body
            console.log(rq.body)
            const userExist=await User.findOne({email:email})
            console.log(userExist)
            if(userExist){
                rs.status(400).json({
                    message:"tài khoản đã tồn tại"
                })
            }
            
            const passwordHash=await bcrypt.hash(password,12)
            const user={
                name:name,
                email:email,
                sdt:sdt,
                password:passwordHash,
                pic:picture
            }

        
                const newUser=await User.create(user)
                if(newUser){
                    rs.status(200).json({
                        _id:newUser._id,
                        name:newUser.name
                        ,email:newUser.email
                        ,sdt:newUser.sdt
                        ,password:newUser.password,
                        pic:newUser.pic,
                        role:newUser.role,
                        tokenUser:signAccesstokenId(newUser._id)

                    })
                }

          
            // const tokenAcessRegisterEmails=await  signAccessTokenForRegisterEmail(user);
            // const url=`${process.env.url_user_client}/userRegister/active-email/${tokenAcessRegisterEmails}`
            // sendMail(email,url,'Click xác nhận địa chỉ email của bạn')
       
            // rs.status(200).json({
            //     message:"xác minh địa chi mail của bạn"
            // })
        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
    }
    async getUser(){
        console.log(123)
    }

    async userActiveEmail(rq,rs){
        try{
            console.log(rq.body)
            const {tokenMail}=rq.body
            const user=jwt.verify(tokenMail,process.env.tokenAcessRegisterEmail)
            console.log(user)
            if(user){
                const newUser=await User.create({
                     name:user.name
                    ,email:user.email
                    ,sdt:user.sdt
                    ,password:user.password
                })
                if(newUser){
                    rs.status(200).json({
                        _id:newUser._id,
                        name:newUser.name
                        ,email:newUser.email
                        ,sdt:newUser.sdt
                        ,password:newUser.password,
                        pic:newUser.pic,
                        role:newUser.role,
                        tokenUser:signAccesstokenId(newUser._id)

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

    async searchUser(rq,rs){
        try{
            const {_id}=rq.userData
            const {keyword}=rq.query
            if(keyword){
                const keywordCurrent=keyword.trim()
    
                const user = await User.aggregate([
                    {
                      $match: {
                        $or: [
                          { name: { $regex: new RegExp(keywordCurrent, 'i') } },
                          { email: { $regex: new RegExp(keywordCurrent, 'i') } },
                          { sdt: { $regex: new RegExp(keywordCurrent, 'i') } }
                        ],
                        _id: { $ne:new mongoose.Types.ObjectId(_id)}
                      }
                    }
                  ]);
                if(!user){
                    rs.status(400).json({
                        message:"user not found"
                    })
                }
    
                console.log(user)
                rs.status(200).json({
                    user:user
                })

            }
            else{
                rs.status(200).json({
                    user:[]
                }) 
            }
           
        }
        catch(err){
            console.log(err)
            rs.status(400).json({
                message:err
            })
        }
        

    }

    async userLogin(rq,rs){
        try{
            const {email,password}=rq.body
            const user=await User.findOne({email:email})
            if(!user){
                rs.status(400).json({
                    message:"user not found"
                })
            }
            const isMatch=await bcrypt.compare(password,user.password)
            if(isMatch){
                rs.status(200).json({
                    _id:user._id,
                    name:user.name
                    ,email:user.email
                    ,sdt:user.sdt
                    ,password:user.password,
                    pic:user.pic,
                    role:user.role,
                    tokenUser:signAccesstokenId(user._id)
                })
            }
            else{
                rs.status(400).json({
                    message:"password not match"
                })
            }

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

// name: { type: String, required: true },
// email: { type: String, unique: true, required: true },
// sdt:{type:String,unique: true, required: true },
// password: { type: String, required: true },
// pic:{type:String,default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',   required: true}
// ,role:{type:Boolean,required:true,default:false}