const mongoose=require('mongoose')
module.exports=async function connectMongodb(){
    try{
        await mongoose.connect('mongodb+srv://20008341-nguyengiahy:1234@cluster0.hfmwmx6.mongodb.net/')
        console.log("connect success")

    }
    catch(e){
        console.log(e)

    }
}