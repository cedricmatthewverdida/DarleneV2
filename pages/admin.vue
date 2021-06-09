<template>
    <div>
        <transition name="home" mode="out-in"></transition>

        <Admindashboard/>
    </div>
</template>

<script>

    import Admindashboard from '~/components/adminrole.vue'
    export default {
        components:{
            Admindashboard
        },
        transition: {
            name: 'home',
            mode: 'out-in'
        },
        mounted (){
            if(this.$auth.loggedIn){
                if(this.$auth.user[0].logs[0].role != "admin"){
                    this.$router.push("/dashboard");
                }
            }else{
                this.$router.push("/dashboard");
            }
        }
    }
</script>

<style lang="scss" scoped>
.home-enter-active, .home-leave-active { transition: opacity .5s; }
.home-enter, .home-leave-active { opacity: 0; }
</style>