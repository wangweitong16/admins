import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/common.css'
import VueQuillEditor from 'vue-quill-editor'
import "quill/dist/quill.core.css" ;
import "quill/dist/quill.snow.css" ;
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor)
Vue.use(VueAxios,axios)
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
