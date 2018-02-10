<template>
  <header id="header" class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link to="/" exact class="navbar-brand">FileUploader</router-link>
    <button type="button" @click.prevent="navShow = !navShow" class="navbar-toggler"><span class="navbar-toggler-icon"></span></button>
    <nav id="navbar" :class="{collapse: true, 'navbar-collapse': true, show: navShow}">
      <ul class="navbar-nav">
        <li class="nav-item text-left"><router-link to="/" exact class="nav-link">List File</router-link></li>
        <li class="nav-item text-left"><router-link to="/upload" exact class="nav-link">Upload File</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  data(){
    return {
      navShow: false
    }
  }
}
</script>

<style lang="css">
header{
  margin-bottom: 30px;
}
.router-link-active{
  color: #fff;
}
</style>
