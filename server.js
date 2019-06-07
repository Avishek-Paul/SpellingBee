const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.disable('view cache');
app.set('view engine', 'ejs');
app.use(express.static('public'));

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

app.get('/game/', function(req, res){
    res.send('Enter url as: "/game/[GameID]" without the brackets([])')
})

app.get('/game/:tagId', function(req, res){ 
    res.render('game', {id: req.params.tagId})
})

io.on('connection', function(socket){
    var room = socket.handshake['query']['room']
    socket.join(room)
    console.log(socket.id, 'connected to room', room);

    if(!(room in roomDict)){
        roomDict[room] = lines[Math.floor(Math.random()*lines.length)];
    }
    io.to(socket.id).emit('synchWord', roomDict[room]);

    socket.on('requestWord', function(roomID){
        roomDict[roomID] = lines[Math.floor(Math.random()*lines.length)];
        io.to(roomID).emit('synchWord', roomDict[roomID]);
    })
});   

http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})