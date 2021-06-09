<template>
  <div>
    <transition name="home" mode="out-in"></transition>
    <Roleuser/>
  </div> 
</template>

<script>
  import Roleuser from '~/components/userrole.vue'
  export default {
    transition: {
      name: 'home',
      mode: 'out-in'
    },
    components : {
      Roleuser
    },
    mounted (){
      if(this.$auth.loggedIn && this.$auth.user[0].logs[0].role == 'admin'){
        this.$router.push('/admin');
      }
    }
  }
</script>

<style lang="scss" scoped>
.home-enter-active, .home-leave-active { transition: opacity .5s; }
.home-enter, .home-leave-active { opacity: 0; }
</style>