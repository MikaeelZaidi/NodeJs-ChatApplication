const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')
const moment = require('moment')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')

const port = 3000 || process.env.PORT
const publicdirectory = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicdirectory))


io.on('connection', (socket) => {
    console.log('Socket is Up and Running')

    socket.on('join', ({ username, roomname }, callback) => {

        const { error, user } = addUser({
            id: socket.id,
            username,
            roomname
        })

        if (error) {

            return callback(error)
        }

        socket.join(user.roomname)

        socket.emit('message', {
            username: "Admin",
            text: 'Welcome',
            createdAt: moment(new Date().getTime()).format("hh:mm a")
        })

        socket.broadcast.to(user.roomname).emit('message', {
            text: `${user.username} has joined`,
            createdAt: moment(new Date().getTime()).format("hh:mm a")
        })

        callback()
    })

    socket.on('sendMessage', (m1, callback) => {

        const user = getUser(socket.id)

        io.to(user.roomname).emit('message', {
            username: user.username,
            text: m1,
            createdAt: moment(new Date().getTime()).format("hh:mm a")
        })
        callback()
    })

    socket.on('sendLocation', (m1, callback) => {

        const user = getUser(socket.id)

        io.to(user.roomname).emit('location-message', {
            username: user.username,
            url: `https://google.com/maps?q=${m1.latitude},${m1.longitude}`,
            createdAt: moment(new Date().getTime()).format("hh:mm a")
        })
        callback()
    })


    socket.on('disconnect', () => {

        const user = getUser(socket.id)

        if (user) {
            io.to(user.roomname).emit('message', {
                text: `${user.username} has left`,
                createdAt: moment(new Date().getTime()).format("hh:mm a")
            })

        }
    })
})


server.listen(port, () => {
    console.log('The Server is up and running')
})
