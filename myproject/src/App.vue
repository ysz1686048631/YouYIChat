<template>
  <div id="app">
    <transition name="fade" mode="out-in">
        <keep-alive>
            <router-view/>
        </keep-alive>
     </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active{
          transition:opacity .1s;
  }
  .fade-enter , .fade-leave-to{
           opacity: 0;
  }
</style>