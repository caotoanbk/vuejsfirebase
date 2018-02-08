// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import jQuery from 'jquery'
import Routes from './routes'

global.jQuery = jQuery
let Bootstrap = require('bootstrap')
import 'bootstrap/dist/css/bootstrap.css'
import 'cropperjs/dist/cropper.css'

Vue.config.productionTip = false
Vue.use(VueFire)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.filter("formatSize", function(value){
  if(value > 1048576){
    return (value/1048576).toFixed(2)+' MB'
  }else if(value > 1024){
    return (value/1024).toFixed(2) + ' KB'
  } else{
    return value.toFixed(2) +' B'
  }
})

const router = new VueRouter({
  routes: Routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router: router
})
