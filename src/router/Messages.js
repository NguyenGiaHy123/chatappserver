const express=require('express')
const Router=express.Router()
const {verifyAccesstokenForClient} =require('../helpers/helpers')
const MessageController=require('../controller/MessageController')
Router.post('/sendMessage',verifyAccesstokenForClient,MessageController.sendMessage)
 Router.get('/getMessageByIdChat',verifyAccesstokenForClient,MessageController.getAllMessage)
module.exports=Router