const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
        headers: ['Content-Type'],
        //optionsSuccessStatus: 200,

    },
})

io.on("connection" , socket => {
    socket.on("send-changes", delta => {
        socket.broadcast.emit("receive-changes",delta)
    })
})