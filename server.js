const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');

var users={};
var rooms={};
var userlist=[];
var roomList=[];

const io=socketIo(server);
const PORT=process.env.PORT || 2323 ;

io.on('connection',(socket)=>{

    console.log("User id : "+ socket.id);

    //user login
    socket.on('login',(data)=>{
            if(userlist.indexOf(data.username)!==-1) {
                socket.emit('logged_in',{
                    loginStatus:0
                })
            }
            else
            {
                users[socket.id] = data.username;
                userlist.push(data.username);
                socket.emit('logged_in',{
                    loginStatus:1
                });
            }

    })

    //room login
    socket.on('room',(data)=>{
        if(roomList.indexOf(data.roomName)!=-1)
        socket.join(data.roomName,()=>{
            if(rooms[data.roomName]!=undefined){
                rooms[data.roomName].strength+=1;
            }
            else {
                rooms[data.roomName]={
                    strength:1
                }
            }
            socket.emit('roomJoined',{
                strength:rooms[data.roomName].strength,
                you:users[socket.id]
            })
        })
        else{
            socket.emit('roomNotThere');
        }
    })
    socket.on('room_',(data)=>{
        socket.join(data.roomName,()=>{
            if(rooms[data.roomName]!=undefined)
            rooms[data.roomName].strength+=1;
            else {
                rooms[data.roomName] = {
                    strength: 1
                }
            }
            socket.emit('roomJoined',{
                strength:rooms[data.roomName].strength,
                you:users[socket.id]
            })
        });
    })


    //for message
    socket.on('msg',(data)=>{

        io.to(data.room).emit('msg',{
            sender:users[socket.id],
            message:data.message
        })
    })


    //disconnection
    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',{
            userLeft:users[socket.id]
        });
        console.log(`${users[socket.id]} left`)
    })

    //virtual tyyping message
    socket.on('typing',(data)=>{
            userTyping:users[socket.id]
        });

    //noTyping helper
    socket.on('noTyping',(data)=>{
        socket.broadcast.emit('noTyping');
    })


})

app.use('/',express.static(path.join(__dirname,'public_static')));

server.listen(PORT,()=>{
console.log(`Server on at http://localhost:${PORT}/`);
});