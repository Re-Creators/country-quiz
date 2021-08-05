<template>
  <div class="flex flex-col min-h-screen">
    <Home/>
    
    <footer class="relative w-full mb-2 z-10 flex-grow flex flex-row items-end">
        <p class="text-white mx-auto">created by <span class="underline font-bold">Re-Creators</span> - devChallenges.io </p>
    </footer>

  </div>
</template>

<script>
import Home from './components/Home.vue'
export default {
  name: 'App',
  components: {
    Home
  }
}
</script>
<style>
body {
  background-image: url('~@/assets/images/background.png');
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  overflow-y: hidden;
}
</style>
