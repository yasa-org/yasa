// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
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
Vue.use(Vuex)
Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(VueResource)
Vue.use(TreeView)

Vue.http.interceptors.push((req, next) => {
  next((res) => {
    if (res.ok) {
      return {data: res.body, ok: true}
    }
    return res
  })
})

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
  }
})

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
    common: {
      loadMore: 'Load More'
    },
    discover: {
      numHit: '{0} hits',
      queryInputHint: 'Search... (e.g. status:200 AND extension:java)'
    },
    visualize: {
      metrics: 'Metrics',
      buckets: 'Buckets'
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
  components: { App },
  template: '<App/>',
  router,
  store,
  i18n
})
