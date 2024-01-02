const express=require('express')
const Router=express.Router()
const {verifyAccesstokenForClient} =require('../helpers/helpers')
const User=require('../controller/UserController')
Router.post('/getUser',User.getUser)
Router.post('/userRegister',User.UserRegister)
Router.post('/userRegister/active-email',User.userActiveEmail)
Router.post('/Login',User.userLogin)
Router.get('/search',verifyAccesstokenForClient,User.searchUser)
module.exports=Router

