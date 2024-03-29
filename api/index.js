const express = require('express');
const socket = require('socket.io');

const app = express();

const timeOutTyping = {}
let users = []
const messages = []

server = app.listen(8080, function () {
  console.log('server is running on port 8080')
});

io = socket(server, {
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

io.on('connection', (socket) => {
  users.forEach(user => {
    socket.emit('USER_JOINED', user)
  })

  socket.on('ADD_USER', function (data) {
    const newUser = {
      id: socket.id,
      username: data,
      isTyping: false,
      isConnected: true,
      address: socket.request.connection.remoteAddress,
      color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
    }

    messages.forEach(message => {
      socket.emit('RECEIVE_MESSAGE', message)
    })

    users.push(newUser)
    io.emit('USER_JOINED', newUser);
    socket.emit('WELCOME_USER', newUser);
  })

  socket.on('SEND_MESSAGE', function (data) {
    if (messages.length >= 10) {
      messages.splice(0, 1)
    }

    messages.push(data)

    io.emit('RECEIVE_MESSAGE', data);
  })

  socket.on('STARTED_TYPING', () => {
    clearTimeout(timeOutTyping[socket.id])

    socket.broadcast.emit('USER_STARTED_TYPING', socket.id);

    timeOutTyping[socket.id] = setTimeout(() => {
      socket.broadcast.emit('USER_STOPPED_TYPING', socket.id);
    }, 2000)
  })

  socket.on('STOPPED_TYPING', () => {
    socket.broadcast.emit('USER_STOPPED_TYPING', socket.id);
  })

  socket.on('disconnect', () => {
      socket.broadcast.emit('USER_LEFT', socket.id);
      users = users.filter(user => user.id !== socket.id)
  })
});