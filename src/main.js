import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// 按钮显示 判断
Vue.directive('permission', {
  bind(el, binding) {
    setTimeout(() => {
      let flag = false
      const role = store.getters.roles[0]
      if (role === 'admin') {
        return
      } else {
        const actions = store.getters.actions
        for (let i = 0; i < actions.length; i++) {
          for (const j in actions[i]['children']) {
            if (actions[i]['children'][j]['path'] === binding.value) {
              flag = true
              break
            }
          }
        }
      }
      if (!flag) {
        el.parentNode.removeChild(el)
      }
    }, 0)
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
