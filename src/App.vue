<template>
  <div id="app">
    <face-detector/>
  </div>
</template>

<script>
import FaceDetector from './components/FaceDetector.vue'
export default {
  name: 'App',
  components: {
    FaceDetector
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
  margin-top: 60px;
}
</style>
