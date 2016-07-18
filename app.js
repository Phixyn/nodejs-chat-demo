var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var util = require('./lib/util.js');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(util.timestamp() + '[INFO] A user has connected!');

    socket.on('disconnect', function() {
        console.log(util.timestamp() + '[INFO] A user has disconnected.');
    });

    socket.on('chat_message', function(data) {
        console.log(util.timestamp() + '[CHAT] ' + data.uname + ': ' + data.msg);
        io.emit('chat_message', data);
    });
});

// Serve static content to clients: /public folder
app.use(express.static(__dirname + '/public'));

http.listen(3000, function() {
    console.log('Listening on port 3000\n');
});

