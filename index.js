var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    // res.send('<h1>Hello world!</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('[INFO] A user connected');

    socket.on('disconnect', function() {
        console.log('[INFO] A user disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log('User: ' + msg);
    });
});

http.listen(3000, function() {
    console.log('Listening on *:3000\n');
});
