<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <TianDocs />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TianDocs from './components/TianDocs.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    TianDocs
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
