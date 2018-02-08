<template>
  <header id="header" class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link to="/" exact class="navbar-brand">FileUploader</router-link>
    <button type="button" class="navbar-toggler"><span class="navbar-toggler-icon"></span></button>
    <nav id="navbar" class="collapse navbar-collapse">
      <ul class="navbar-nav">
        <li class="nav-item"><router-link to="/" exact class="nav-link">List File</router-link></li>
        <li class="nav-item"><router-link to="/upload" exact class="nav-link">Upload File</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
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
