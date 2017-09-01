<template>
  <div id="app">
    <div v-if="!playerName">
      Enter your name:
      <br>
      <input type="text" v-model="nickname"><button @click="submitName()">Enter</button>
    </div>
    <game-screen v-else :player-name="playerName"></game-screen>
  </div>
  
</template>

<script>

import GameScreen from './components/GameScreen'


export default {
  name: 'app',
  components: {
    GameScreen
  },

  data() {
    return {
      playerName: null,
      nickname: null
    }
  },

  created: function() {
    this.playerName = localStorage.getItem('playerName');
    if(this.playerName) {
      this.$socket.emit('NEW_PLAYER', this.playerName);
    }
  },

  methods: {
    submitName: function() {
      if(this.nickname !== '') {
        this.playerName = this.nickname;
        localStorage.setItem('playerName', this.playerName)
        this.$socket.emit('NEW_PLAYER', this.playerName);
      }
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
