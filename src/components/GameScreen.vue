<template>
  <div class="game-screen">
    <div>{{playerName}}</div>
    <div v-if="game != null">
      <div v-if="game.waiting">Waiting on a player to reconnect</div>
      <div>
        {{game.id}}<button @click="leaveGame(game.id)">Fuck off</button>
      </div>
      <div>
        {{game.players.length}} out of 2
      </div>
    </div>
    <div v-else>
      <div v-for="game in gameList">
        {{game.id}} {{game.players.length}} out of 2 <button @click="joinGame(game.id)">JOIN</button>
      </div>
      <button @click="createGame()">Create a game</button>
    </div>
  </div>
</template>

<script>


export default {
  name: 'game-screen',
  data () {
    return {
      gameList: [],
      game: null
    }
  },

  props: ['playerName'],

  sockets: {
    JOIN_THE_GAME: function(data) {
      this.game = data;
    },

    GAME_LIST: function(data) {
      this.gameList = data;
    },

    GAME_INFO: function(data) {
      this.game = data;
    }
  },

  methods: {
    createGame: function() {
      this.$socket.emit('CREATE_A_GAME')
    },

    joinGame: function(gameId) {
      this.$socket.emit('JOIN_GAME', gameId)
    },

    leaveGame: function(id) {
      this.$socket.emit('LEAVE_GAME', id);
      this.game = null;
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
