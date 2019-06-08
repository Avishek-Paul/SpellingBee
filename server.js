const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('client-sessions');

app.disable('view cache');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })) 

app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));  

const fs = require('fs');
var lines;
fs.readFile('./public/words/words.txt', 'utf8' ,(err, data) => {
    if (err) throw err;
    lines = data.split('\n');
});

var roomDict = {};

app.get('/', function (req, res) {
    res.render('index')
})

app.get('/game/:tagId', function(req, res){
    
    if (req.session && req.session.user) { // Check if session exists
        res.render('game', {id: req.params.tagId, username: req.session.user})
    } else {
        res.redirect('/');
    }

})

app.post('/login', function(req, res) {
    req.session.user = req.body.username;
    res.redirect('game/' + req.body.room);
});

io.on('connection', function(socket){
    // var room = socket.handshake['query']['room']
    var room = socket.handshake.query.room;
    socket.username = socket.handshake.query.username; //set socket with username based on session username
    socket.currentRoom = room;
    socket.join(room)
    console.log(socket.username, 'connected to', room);

    if(!(room in roomDict)){
        roomDict[room] = lines[Math.floor(Math.random()*lines.length)];
    }
    io.to(socket.id).emit('synchWord', roomDict[room]);
    
    usernames = [];
    for (var user in io.sockets.sockets){
        if(io.sockets.sockets[user]['currentRoom'] != room) continue;
        usernames.push(io.sockets.sockets[user]['username'])
    }
    io.to(room).emit('playerList', usernames);
    
    socket.on('requestWord', function(roomID){
        roomDict[roomID] = lines[Math.floor(Math.random()*lines.length)];
        io.to(roomID).emit('synchWord', roomDict[roomID]);
    })

});   

http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})