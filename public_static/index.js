var socket=io();
var username="anonymous"

$(()=>{
    var msgBox=$('#message')
    var sendBtn=$('#send');
    var chatBox=$('#chat');
    var initialMsg=msgBox.val();
    var currMsg="";
    msgBox.css('display','none');
    chatBox.css('display','none');
    sendBtn.css('display','none');

    var a=0;

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

    socket.on('typing',(data)=>{
        if(a===0) {
            chatBox.append(`<p class="typing">${data.userTyping} is typing...</p>`)
            a=1
        }
    })


    socket.on('left',(data)=>{
        chatBox.append(`<p>${data.userLeft} left</p>`)
    })

    setInterval(()=>{
        currMsg=msgBox.val()
        if(currMsg==="" || currMsg===initialMsg) {
                socket.emit('noTyping');
        }
        else{
            initialMsg=currMsg;
            socket.emit('typing');
        }
    },500)

    socket.on('noTyping',(data)=>{
        $('.typing').remove();
        a=0;
    })
})

