// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale/lang/en'
import VueResource from 'vue-resource'
import TreeView from 'vue-json-tree-view'
import './style/theme/index.css'
import './style/style.less'

Vue.use(VueI18n)
Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(VueResource)
Vue.use(TreeView)

Vue.http.interceptors.push((req, next) => {
  next((res) => {
    console.log(`req=${JSON.stringify(req)}, res=${JSON.stringify(res)}`)
    if (res.ok) {
      return {data: res.body, ok: true}
    }
    return res
  })
})

Vue.config.productionTip = false

const messages = {
  en: {
    menu: {
      collapse: 'Collapse',
      expand: 'Expand',
      discover: 'Discover',
      visualize: 'Visualize',
      devTools: 'Dev Tools',
      dashboard: 'Dashboard',
      management: 'Management'
    },
    discover: {
      numHit: '{0} hits',
      queryInputHint: 'Search... (e.g. status:200 AND extension:java)'
    }
  }
}

const i18n = new VueI18n({
  locale: 'en',
  messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  i18n
})
