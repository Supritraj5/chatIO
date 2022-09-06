//CLIENT SIDE
// const hostname='127.0.0.1'||process.env.HOST||'0.0.0.0';
// const port=8000||process.env.PORT;
// const process=require('process');
// const port=8000||process.env.PORT||process.env.YOUR_PORT;
// const myhost=process.env.YOUR_HOST||process.env.HOST||'0.0.0.0';
// const link=`${myhost}:${port}`;
// console.log(link);
const socket=io('http://localhost:8000',{transports:['websocket']});

const form=document.getElementById('sendcontainer');
const messageinp=document.getElementById('msginp');
const msgcontainer=document.querySelector(".container");
const msgname=document.createElement('div')
msgname.classList.add('username')
let time=document.querySelector('.time');
var audio=new Audio('iphine.mp3');
var audio2=new Audio('weeee.mp3');

form.addEventListener('submit',(e)=>{
    e.preventDefault();//prevent reloading the page
    const message=messageinp.value;
    append(`You`,`${message}`,'right')
    socket.emit('send',message);//trigger send event wiht a messsage
    messageinp.value='';//reset text box to blank
})
function updatetime(){
    let now=new Date();
    let hours=now.getHours();
    let mins=now.getMinutes();
    let ampm=' am'
    if(hours>12 && hours<24){
        hours%=12;
        ampm=' pm';
    }
    else if(hours==12){
        ampm=' pm';
    }
    else if(hours==24){
        ampm=' am';
        hours=12;
    }

    if(hours<10){
        hours='0'+hours;
    }
    if(mins<10){
        mins='0'+mins;
    }

    return (hours+':'+mins+ampm);
}

const append=(user,message,position)=>{
    const element=document.createElement('div');//ek div element bnao jisko mesgelement se naem krlo
    const timeelement=document.createElement('span');
    const contentdiv=document.createElement('div');
    const content=document.createElement('p');
    contentdiv.classList.add('mesg',position);//class 1 
    if(position!='middle'){
        let now,mesgval;
        timeelement.setAttribute('id','time');
        element.classList.add('username');
        element.innerHTML=user;//jo bhi div ke andar text rhega vo bhej do
        content.textContent=message;
        now=updatetime();
        timeelement.innerHTML=`${now}`;
        document.getElementById('time').innerHTML=now;
    }
    else{
        content.innerHTML=user+' '+message;
    }    
    document.getElementsByClassName("mesg")[0].insertBefore(msgname,time);    
    contentdiv.appendChild(content);                    
    msgcontainer.appendChild(contentdiv);
    contentdiv.appendChild(element);
    contentdiv.appendChild(timeelement);//mesgcontainer me mesgelement ko append kro
    document.querySelector(".mesg");
    document.querySelector(".username");
    if(position=='left'){
        audio.play();
    }
    if(position=='middle'){
        audio2.play();
    }
}

const name=prompt("Enter your name to join the group chat");
socket.emit('new-user-joined',name);

socket.on("user-joined",name=>{
    append(`${name}`,`joined the chat`,'middle');
})
socket.on("receive",data=>{
    append(`${data.name}`,`${data.message}`,'left');
})
socket.on("leaved",name=>{
    append(`${name}`,`left the chat`,'middle');
})