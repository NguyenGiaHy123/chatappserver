
const Chat=require('./Chat')
const Message=require('./Messages')
const Users=require('./User')
function Router(app){
   
    app.use('/apiNguyenGiaHy/Messages',Message)
    app.use('/apiNguyenGiaHy/Chat',Chat)
    app.use('/apiNguyenGiaHy/user',Users)
}
module.exports=Router