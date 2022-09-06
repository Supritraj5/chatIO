// THIS IS A NODE SERVER WHOCH WILL HANDLE SOCKET IO CONNECTIONS
const io=require('socket.io')(8000)//port no
// const cors=require('cors');
// io.use(cors());

const users={};
io.on('connection',socket=>{
    console.log("server on");
    socket.on('new-user-joined',name=>{//jaise hi socket.on ko userjoined event milega vo user ka name ko initailsise krdega socketid ke index se
        console.log("new user",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name)//braod.emit ka kaam hai mesg brdcst krna jo join kiya usko chor kr
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('leaved',users[socket.id])
        delete users[socket.id]
    });
});
