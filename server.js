const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');

var users={}

const io=socketIo(server);
const PORT=process.env.PORT || 2323 ;

io.on('connection',(socket)=>{

    console.log("User id : "+ socket.id);

    socket.on('login',(data)=>{
            users[socket.id]=data.username;
            socket.emit('logged_in');
            socket.broadcast.emit('someJoined',{
                joinedUser:users[socket.id]
            });

    })

    socket.on('msg',(data)=>{

        io.emit('msg',{
            sender:users[socket.id],
            message:data.message
        })
    })



})

app.use('/',express.static(path.join(__dirname,'public_static')));

server.listen(PORT,()=>{
console.log(`Server on at http://localhost:${PORT}/`);
});