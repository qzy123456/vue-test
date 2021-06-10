// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui' //New Added
import 'element-ui/lib/theme-chalk/index.css' //New Added
import App from './App'
import router from './router'
import qs from 'qs';
import axios from "axios";
import Global from '../config/global'

Vue.config.productionTip = false;
Vue.use(ElementUI); //New Added
//下面是将$axios和$qs挂在原型上，以便在实例中能用 this.$axios能够拿到
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.GLOBAL = Global;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
