const express = require('express');
const socket = require('socket.io');

const app = express();

const colors = [
    '#cd13a0',
    '#891a45',
    '#638dd5',
    '#fcc424',
    '#c1c848',
    '#f73768',
    '#2275d1',
]
const users = []
const messages = []

server = app.listen(8080, function () {
    console.log('server is running on port 8080')
});

io = socket(server);

io.on('connection', (socket) => {
    
    socket.on('ADD_USER', function (data) {
        const newUser = {
            ...data,
            id: socket.id,
            color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)
        }

        users.push(newUser)
        socket.broadcast.emit('NEW_USER', newUser);
        socket.emit('WELCOME_USER', newUser);
        users.forEach(user => {
            socket.emit('NEW_USER', user)
        })
    })
    
    socket.on('SEND_MESSAGE', function (data) {
        messages.push(data)
        io.emit('RECEIVE_MESSAGE', data);
    })
});