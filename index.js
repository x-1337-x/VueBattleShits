var app = require('http').createServer(handler)
var server = require('socket.io')(app);
var fs = require('fs');

let games = [];
const isStarted = (game) => game.players.length > 1;
const isPending = (game) => game.players.length < 2;

console.log('app is running')

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/dist/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

server.on('connection', function (client) {

  client.on('disconnect', function() {
    let game = games.find(function(g) {
      return g.players.indexOf(client.playerName) !== -1;
    });
    
    // if(game) removePlayer(game, client.playerName);
    if(game) {
      game.waiting++;
      updateGame(game);
    };
  });

  client.on('NEW_PLAYER', function(playerName) {
    client.playerName = playerName;
    let game = games.find(function(g) {
      return g.players.indexOf(client.playerName) !== -1;
    });
    if(game) {
      game.waiting--;
      updateGame(game);
      client.join(game.id);
      client.emit('JOIN_THE_GAME', game);
    };
    client.emit('GAME_LIST', games.filter(isPending));
  })

  client.on('CREATE_A_GAME', function() {
    const game = {id:Date.now(), players: [client.playerName], waiting: 0};
    client.join(game.id);
    games.push(game);
    client.emit('JOIN_THE_GAME', game);
    sendGames();
  });

  client.on('JOIN_GAME', function(gameId) {
    let game = games.find(function(game) {
      return game.id === gameId;
    });
    client.join(gameId);
    game.players.push(client.playerName);
    sendGames();
    client.emit('JOIN_THE_GAME', game);
    updateGame(game);
  })

  client.on('LEAVE_GAME', function(id) {
    let game = games.find(function(el) {
      return el.id === id;
    });

    if(game) {
      client.leave(id);
      removePlayer(game, client.playerName);
    };
  })
});

function sendGames() {
  server.emit('GAME_LIST', games.filter(isPending))
};

function updateGame(game) {
  server.to(game.id).emit('GAME_INFO', game);
};

function removePlayer(game, playerId) {
  game.players = game.players.filter(function(player) {
    return player != playerId;
  })

  if (game.players.length === 0) {
    games = games.filter(function(el) {
      return el.id !== game.id;
    })
  }

  sendGames();

  updateGame(game);
};