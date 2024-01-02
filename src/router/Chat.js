const express=require('express')
const Router=express.Router()
const {verifyAccesstokenForClient} =require('../helpers/helpers')
const ChatController=require('../controller/ChatController')
Router.post('/postChat',verifyAccesstokenForClient,ChatController.accessChat)
Router.get('/getChat',verifyAccesstokenForClient,ChatController.getChat)
Router.post('/createChatGroup',verifyAccesstokenForClient,ChatController.CreateChatGroup)
Router.put('/renameChat',verifyAccesstokenForClient,ChatController.RenameChat)
Router.put('/groupadd',verifyAccesstokenForClient,ChatController.addtoGroup)
Router.delete('/delete',verifyAccesstokenForClient,ChatController.RemoveChat)
Router.delete('/removeMemembersChat',verifyAccesstokenForClient,ChatController.removeMemembersChat)
module.exports=Router
