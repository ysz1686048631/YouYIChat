import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css';
import router from './router';
import Axios from 'axios';
import store from './store';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)
// 大道至简，知易行难。从今天开始改变，这是对平庸生活最好的回击。
Vue.config.productionTip = false

const VueSocketIO = require('vue-socket.io');

router.beforeEach((to,from,next)=>{

  if(!localStorage.getItem('userinfo')&&to.path!=='/login'){
      
      next({
         path:'/login'
      })
  }else{
    
      next()
  }
})
const webUrl = 'http://localhost:5005';

Axios.defaults.baseURL = webUrl;
Vue.prototype.$http = Axios;
Vue.prototype.$store = store;
Vue.use(Vant);
//拦截器
Axios.interceptors.request.use(function(config){
  config.headers = {
    "Content-Type":"application/x-www-form-urlencoded",
  }
  return config
})
const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  messages:{
       'zh':require('./languages/zh'),
       'en':require('./languages/en')
  }
})
//Socket
Vue.use(new VueSocketIO({

    debug: true,

    connection: webUrl  

}))
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
