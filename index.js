// THIS IS A NODE SERVER WHOCH WILL HANDLE SOCKET IO CONNECTIONS
// let port=(process.env.PORT || 8000);
const port=8000||process.env.PORT;
const myhost=process.env.HOST||'127.0.0.1'||'0.0.0.0';
const io=require('socket.io')(port)//port no
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

//express part
var express=require('express');
const app=express();
const http=require('http');
const server=http.Server(app);
app.get('/',function(req,res){
    res.sendFile('index.html');
})
server.listen(port,myhost,()=>{
    console.log(`listening on https://${myhost}:${port}/`);
})
// var server_port = process.env.port || process.env.PORT;
// var server_host = process.env.myhost || '0.0.0.0';
// server.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });