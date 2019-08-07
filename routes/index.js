// this file handles routing
module.exports = (app, server) => {
    // <--- Constructors --->
    let io = require('socket.io')(server); // constructs socket listener from server parameter
    
    // <--- Variable --->
    let log = [];

    // <--- Routing --->
    // ** GET routes **
    // root
    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    // <--- Sockets --->
    io.on('connection', socket => {
        // Request name information from client
        socket.emit('get_name');

        // retrieve name and assign session id:
        socket.on('new_user', data => {
            const sessionId = data.name + Math.floor(Math.random() * 10000)
            log.push({sessionId: sessionId, message: `${data.name} has joined the conversation`})
            io.emit('new_user_joined', {sessionId: sessionId, log: log});
        })

        // new message
        socket.on('new_message', data => {
            log.push({sessionId: data.sessionId, message: `${data.name} said: ` + data.message})
            io.emit('update_chat', {sessionId: data.sessionId, log: log});
        })

        // user disconnect
        socket.on('user_disconnect', data => {
            log.push({sessionId: data.sessionId, message: `${data.name} has left the conversation`})
            socket.broadcast.emit('update_chat', {sessionId: data.sessionId, log: log});
        })
    })
}