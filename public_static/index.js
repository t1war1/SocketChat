var socket=io();
var username="anonymous"

$(()=>{
    var msgBox=$('#message')
    var sendBtn=$('#send');
    var chatBox=$('#chat');

    msgBox.css('display','none');
    chatBox.css('display','none');
    sendBtn.css('display','none');

    var usernamebox=$('#username');
    var loginBtn=$('#loginbtn');

    loginBtn.click(()=>{
        username=usernamebox.val();
        socket.emit('login',{
            username:username
        })
        }
    )

    sendBtn.click(()=>{
        socket.emit('msg',{
            message:msgBox.val()
        })
    })

    socket.on('msg',(data)=>{
        chatBox.append(`
        <li>${data.sender} : ${data.message}</li>
        `)
    })

    socket.on('logged_in',(data)=>{
        loginBtn.css('display','none');
        usernamebox.css('display','none');
        msgBox.css('display','block');
        chatBox.css('display','block');
        sendBtn.css('display','block');

    })


    socket.on('someJoined',(data)=>{
        chatBox.append(`<p>${data.joinedUser} joined</p>`)
    })




})

