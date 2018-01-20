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


    var usernamebox=$('#username');
    // var loginBtn=$('#loginbtn');

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


    window.onkeydown= function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            usernamebox.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            // if (username) {
            //     sendMessage();
            //     socket.emit('stop typing');
            //     typing = false;
            // } else {
            //     setUsername();
            // }
            username=usernamebox.val();
            socket.emit('login',{
                username:username
            })

        }
    };


    socket.on('logged_in',(data)=>{
        if(data.loginStatus===0)
        {
            alert('Username not available');
            return;
        }
        $('#UserDetails').hide();
        // msgBox.css('display','block');
        // chatBox.css('display','block');
        // sendBtn.css('display','block');

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

