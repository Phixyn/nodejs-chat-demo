var express = require('express');
var	app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('./lib/util.js');

var userList = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(util.timestamp() + '[INFO] A user has connected!');

    socket.on('disconnect', function() {
        console.log(util.timestamp() + '[INFO] A user has disconnected.');
    });

	socket.on('user_login', function(data, callback) {
		if (userList.indexOf(data) != -1) {
			callback(false);
		}
		else {
			callback(true);
			// Store nickname in client's socket
			socket.nickname = data;
			userList.push(data);
			// Send an event to connected clients with list of connected users
			io.emit('users_list', userList);
		}
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

