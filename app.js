var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Timestamp bla
function timestamp() {
    var now = new Date();
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // If hours, minutes or seconds are less than 10, add a zero in front
    for (var i = 0; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }

    // Return the formatted string
    return '[' + time.join(":") + "]";
}

app.get('/', function(req, res) {
    // res.send('<h1>Hello world!</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(timestamp() + '[INFO] A user has connected!');

    socket.on('disconnect', function() {
        console.log(timestamp() + '[INFO] A user has disconnected.');
    });

    socket.on('chat_message', function(data) {
        console.log(timestamp() + '[CHAT] ' + data.uname + ': ' + data.msg);
        io.emit('chat_message', data);
    });
});

http.listen(3000, function() {
    console.log('Listening on *:3000\n');
});
