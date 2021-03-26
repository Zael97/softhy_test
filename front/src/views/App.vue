<template>
  <navbar/>
  <router-view/>
</template>

<script>
import TheNavbar from '../components/TheNavbar/TheNavbar.vue';
export default {
  name: 'App',
  components:{
    'navbar': TheNavbar
  }
}
</script>

<style>
</style>
