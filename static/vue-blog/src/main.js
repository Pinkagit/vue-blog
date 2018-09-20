// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './axios'

// 引入Element-UI
import ElementUI from 'element-ui'
import "../static/css/element-variables.scss"

// prism 代码高亮
import VuePrism from 'vue-prism'
import 'prismjs/themes/prism-okaidia.css'
// 引入全局scss
import '../static/css/main.scss'
import '../static/fonts/iconfont/iconfont.css'
import 'animate.css'


Vue.use(ElementUI)
Vue.use(VuePrism)

Vue.config.productionTip = false
Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
