// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import TreeView from 'vue-json-tree-view'
import './http'
import './style/theme/index.css'
import './style/style.less'

import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/axisPointer'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'

Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(TreeView)

Vue.component('chart', ECharts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store,
  i18n
})
