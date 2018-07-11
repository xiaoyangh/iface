import Vue from 'vue'
import App from './App.vue'
import router from '@g/router'
import store from '@g/store'
import ElementUI from 'element-ui'
import 'flex.css'
import './assets/css/base.scss'
import './assets/icons/icon'
import utils from '@utils/index'
import regComponents from '@g/regComponents'
import formVerify from '@g/formVerify'

Vue.use(ElementUI, {size: 'small'})
Vue.use(formVerify)

// 注册一些全局组件
Vue.use(regComponents)

if (process.env.VUE_APP_MOCK) {
  /* tslint:disable:no-var-requires */
  require(process.env.VUE_APP_MOCK)
}
Vue.config.productionTip = false
Vue.use(utils)
export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
