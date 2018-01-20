const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');

var users={};
var userlist=[];
const io=socketIo(server);
const PORT=process.env.PORT || 2323 ;

io.on('connection',(socket)=>{

    console.log("User id : "+ socket.id);

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
            // socket.broadcast.emit('someJoined',{
            //     joinedUser:users[socket.id]
            // });

    })

    socket.on('msg',(data)=>{

        io.emit('msg',{
            sender:users[socket.id],
            message:data.message
        })
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',{
            userLeft:users[socket.id]
        });
        console.log(`${users[socket.id]} left`)
    })

    socket.on('typing',(data)=>{
            userTyping:users[socket.id]
        });

    socket.on('noTyping',(data)=>{
        socket.broadcast.emit('noTyping');
    })


})

app.use('/',express.static(path.join(__dirname,'public_static')));

server.listen(PORT,()=>{
console.log(`Server on at http://localhost:${PORT}/`);
});