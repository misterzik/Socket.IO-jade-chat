const express = require('express');
const app = express();
const port = 3700;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  //res.send("It Works");
  res.render('page');
});

// Without Socket.IO
//app.listen(port);

const clients = [];

// Socket.IO
const io = require('socket.io').listen(app.listen(port));

/*
 * Starts IO
 */

io.sockets.on('connection', function(socket) {

  //socket.emit('message', {message: 'Socket.IO Inner Chat'});

  console.info('Client Connected (id=' + socket.id + ').');
  clients.push(socket);

  /**
   * Get Clients ID & Remove Clients
   */


  socket.on('disconnect', function() {
    let index = clients.indexOf(socket);
    if (index != -1) {
      clients.splice(index, 1);
      console.info('Client Left (id=' + socket.id + ').');
    }
  });

socket.on('send', function(data) {
    io.sockets.emit('message', data);
  });

  /*
  socket.currentClient = '';
  socket.on('join', function(data) {
    clients[data.user] = socket.client.id;
    socket.currentClient = data.user;
  });
  socket.on('create', function(id) {
    socket.join(id);
  })
  socket.on('single', function(data) {
    io.to(clients[data.id]).emit('single', data);

  });
  socket.on('multi', function(data) {

  });

  socket.on('room', function(data) {
    if (!data.exclude) {
      io.to(data.id).emit('room', data);
    } else {
      socket.broadcast.to(data.id).emit('room', data);
    }
  });  */


});

console.log("listening on port" + port);
