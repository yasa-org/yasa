import http from '@/http'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import TreeView from 'vue-json-tree-view'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/style.less'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/axisPointer'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import service from '@/service'

Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(TreeView)

Vue.use({
  install (_Vue: typeof Vue) {
    _Vue.prototype.$service = service
    _Vue.prototype.$http = http
  }
})

Vue.component('chart', ECharts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')
