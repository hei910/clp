const express = require('express')
const app = express()

const server = require('http').Server(app)
    .listen(1080,()=>{console.log('open server!')})

const io = require('socket.io')(server)

io.on('connection', socket => {
    console.log('success connect!')
    socket.on('getCounts', message => {
        io.sockets.emit('getCounts', message)
    })
    socket.on('disconnect', () => {
        console.log('disconnection')
    })
})