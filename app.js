var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('./lib/util.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/chat.db');

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
			// Send user join event
			io.emit('user_join', socket.username);
			console.log(util.timestamp() + '[INFO] ' + socket.username +
				' has joined the channel.');
		}
	});

    socket.on('chat_message', function(data) {
        console.log(util.timestamp() + '[CHAT] ' + socket.username + ': ' + data);

		db.run('INSERT INTO messages (username, message) VALUES (?, ?)',
			[socket.username, data], function(err) {
				console.error(err);
			});

        io.emit('chat_message', {user: socket.username, msg: data});
    });
	
    socket.on('disconnect', function() {
        console.log(util.timestamp() + '[INFO] A user has disconnected.');
		if (!socket.username) return false;
		// Remove username from user list
		userList.splice(userList.indexOf(socket.username), 1);
		// Send updated user list to connected clients
		io.emit('users_list', userList);
		// Send user leave event
		io.emit('user_leave', socket.username);
		console.log(util.timestamp() + '[INFO] ' + socket.username +
			' has left the channel.');
    });
});

// Serve static content to clients: /public folder
app.use(express.static(__dirname + '/public'));

http.listen(3000, function() {
    console.log('Listening on port 3000\n');
});

