var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('./lib/util.js');

var userList = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(util.timestamp() + '[INFO] A user has connected!');

	socket.on('user_login', function(data, callback) {
		if (userList.indexOf(data) != -1) {
			callback(false);
		}
		else {
			callback(true);
			// Store username in client's socket
			socket.username = data;
			userList.push(data);
			// Send an event to connected clients with list of connected users
			io.emit('users_list', userList);
		}
	});

    socket.on('chat_message', function(data) {
        console.log(util.timestamp() + '[CHAT] ' + socket.username + ': ' + data);
        io.emit('chat_message', {user: socket.username, msg: data});
    });
	
    socket.on('disconnect', function() {
        console.log(util.timestamp() + '[INFO] A user has disconnected.');
		if (!socket.username) return false;
		console.log(util.timestamp() + '[INFO] ' + socket.username +
			' has left the room.');
		// Remove username from user list
		userList.splice(userList.indexOf(socket.username), 1);
		// Send updated user list to connected clients
		io.emit('users_list', userList);
    });
});

// Serve static content to clients: /public folder
app.use(express.static(__dirname + '/public'));

http.listen(3000, function() {
    console.log('Listening on port 3000\n');
});

