
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const router = require('./mvc/router/router')
const http = require('http')

const {Server} = require('socket.io')

//server
const instaServer = express()
const server = http.createServer(instaServer)

const io = new Server(server,{
    cors:{
        origin:"https://insta-connect-kappa.vercel.app/",
        methods:["GET","POST"],
    },
})

//database connection
require('./db_connection/connection')

const chatController = require('./mvc/controllers/chatController')


instaServer.use(express.json())
instaServer.use(cors())
instaServer.use(router)

//socket.io

const waitingQueue = []
const rooms = []

io.on("connection",(socket)=>{

    socket.on('waiting',(data)=>{
        const isPresent = waitingQueue.some(item=>item.userId==data.userId)

        const user = {
            userId:data.userId,
            socket
        }

        if(waitingQueue.length==0){
            waitingQueue.push(user)
        }
        else if(!isPresent){
            waitingQueue.push(user)
        }
        
        if(waitingQueue.length===2){
            processWaiting()
        }
    })

    socket.on("sendMessage",(data)=>{
        socket.to(data.room).emit("reciveMessage",data)
    })

    socket.on("friendReq",(data)=>{
        socket.broadcast.emit("RecivefriendReq",data)
    })

    socket.on("reqAccepted",(data)=>{
        socket.broadcast.emit("reciveRequestAccepted",data)
    })

    socket.on("clientLeave",(data)=>{
        const foundRoom = rooms.find(
            item => item.user1 === socket.id || item.user2 === socket.id
          );

        if(foundRoom){
            const roomIndex = rooms.findIndex(
                item => item.user1 === socket.id || item.user2 === socket.id
              );
            rooms.splice(roomIndex,1)

            socket.broadcast.to(foundRoom.room).emit("userLeft",{})
        }
    })

    socket.on("joinPrivate",(data)=>{
        socket.join(data)
    })

    socket.on("sendPrivate",(data)=>{
        const body = {
            clientOne:data.userId,
            clientTwo:data.room,
            message:{
                message:data.message,
                sent:data.userId
            }
        }
        
        chatController.newChat(body)

        socket.to(data.room).emit("recivePrivate",data)
    })

    socket.on("disconnect",()=>{
        const foundRoom = rooms.find(
            item => item.user1 === socket.id || item.user2 === socket.id
          );

        if(foundRoom){
            const roomIndex = rooms.findIndex(
                item => item.user1 === socket.id || item.user2 === socket.id
              );
            rooms.splice(roomIndex,1)

            io.to(foundRoom.room).emit("userLeft",{})
        }

        const waitingIndex = waitingQueue.findIndex(
            item => item.socket === socket
        )
        waitingQueue.splice(waitingIndex,1)
    })

    const processWaiting = ()=>{
        if(waitingQueue.length>1){
            const user1 = waitingQueue.shift()
            const user2 = waitingQueue.shift()
            const room = user1.userId;

            user1.socket.join(room)
            user2.socket.join(room)

            io.to(room).emit("joinedRoom",{room})

            const newRoom = {
                user1 : user1.socket.id,
                user2 : user2.socket.id,
                room
            }
            rooms.push(newRoom)
            
            processWaiting()
        }
    }
})


const PORT = 4000 || process.env.PORT

server.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
})


