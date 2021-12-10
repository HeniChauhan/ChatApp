const Chat = require('./models/chatModel')
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const Project = require('./models/projectModel');
const User = require('./models/userModel');
const { Console } = require('console');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",function(req,res){
  Project.find(function(error,result){
    User.find(function(error,result1){
    if(error)
     throw error;
     res.render('index',{'projectList':result,'userList':result1});
    })
})
})


app.get("/chat",function(req,res){
      var username= req.query.username;
      var password= req.query.psw;
      console.log(req.query);
      User.find({name:username,password:password},function(error,result){
          if(result.length==0)
          {
            res.redirect("/")
          }
          else{
          res.render('chat');
          }
      })
})

const botName = 'Chat Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {

    console.log(socket.id)
    const user = userJoin(socket.id, username, room);
    //  if(user=='user already exist')
    //  {
    //   res.redirect("/")
    //  }
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    // console.log(msg);
    // console.log(user.username);
    // console.log(user.room);
    // console.log(formatMessage(user.username, msg));
    var result=formatMessage(user.username, msg)

  var newChat = new Chat()
  newChat.username = user.username
  newChat.msg=msg
  newChat.time=result.time;
  newChat.projectName=user.room

  newChat.save(function(err){
     if(err){throw err}
     console.log(newChat);
  })

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
