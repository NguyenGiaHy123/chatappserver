const express=require('express')
const app=express()
require("dotenv").config();
const PORT=process.env.PORT||8000;
const Connectdb=require('./connectdb');
const bodyparser=require('body-parser');
const cors=require('cors')

const Router=require('./src/router')
//cors
app.use(cors());
//bodypaser

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(express.json())

//----thiết lập cors cho server ---
const server =require('http').createServer(app);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });
  const io=require('socket.io')(server,{
    cors: {
      //cho phep port 3000 truy cap vao server
      origin: "https://chapappnguyengiahy.vercel.app",
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Access-Control-Header",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        "Access-Control-Allow-Methods",
      ],
      credentials: true,
    },
  })
  //Các kết nối trong phòng 64817496aa3fc312ecd52c2d: [ 'xITUv627pGLks8n5AAAF', '2Tm0m09R5vWJt7mOAAAb' ]
  //khi no join la no xem cai phong giống nhau thì nó join cai socket chứ không phải join cai id 64817496aa3fc312ecd52c2d
  const userChat=[]
  io.on('connection',(socket)=>{
    console.log('co nguoi ket noi')

    socket.on('disconnect',()=>{
      console.log('co nguoi ngat ket noi')
    })
    

    //cai truong hop tin nhan chi hien thi mot tin duo thang user
    //guiwr thong tin nguoi dung len va chuan bi join vao room 
    socket.on('setup',(userData)=>{
      socket.join(userData._id)
     
      // socket.emit('connected')
      io.in(userData._id).allSockets().then((sockets) => {
        const clients = Array.from(sockets);
        console.log('Các kết nối trong phòng setup user send ' +userData._id + ':', clients);
      }).catch((error) => {
        console.error(error)
      })
    })


    // socket.on('joinRoom',(room)=>{
    //   const user={
    //     userId:socket.id,
    //     roomChat:room
    //   }
    //   console.log(user.roomChat)
    //   const check=userChat.every(users=>users.userId!=user.userId)
    //   console.log(check)
    //   if(check){
    //     userChat.push(user)
  
    //     socket.join(user.roomChat)
    //     console.log(socket.id)
    //     console.log(userChat)
    //     console.log('da join user vao room '+user.roomChat)

    //   }else{
    //        userChat.map((userv)=>{
    //         if(userv.userId===user.userId){
    //           if(userv.roomChat!==user.roomChat){
    //             console.log(' user roi  room '+user.roomChat)
    //             socket.leave(userv.roomChat)
    //             socket.join(user.roomChat)
    //             console.log(' user join vao mot   room  chat khac '+user.roomChat)
    //             userv.roomChat=user.roomChat
    //           }
    //         }
    //        })
    //   }
    // })
    socket.on("join chat", (room) => {
      socket.join(room);
      // io.in(room).allSockets().then((sockets) => {
      //   const clients = Array.from(sockets);
      //   console.log('Các kết nối trong phòng ' +room + ':', clients);
      // }).catch((error) => {
      //   console.error(error);
      // });
    });

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      console.log(chat)
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.on('typing',(room)=>{
      socket.in(room).emit("typing",true)

    }
    )
    socket.on('Stoptyping',(room)=>{
    
      socket.in(room).emit("stopping",false)})
   
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });

  })
  
  Connectdb();
  Router(app)

  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
