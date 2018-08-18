import Vue from 'vue'
import Router from 'vue-router'
import Discover from '../components/discover/Discover'
import VisualizeNew from '../components/visualize/Visualize'
import VisualizeChart from '../components/visualize/Chart'
import DevTools from '../components/dev-tools/DevTools'
import Collections from '../components/management/Collections'
import Tree from '../components/management/Tree'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/discover'},
    {path: '/discover', component: Discover},

    {path: '/visualize', component: VisualizeNew},
    {path: '/visualize/chart', component: VisualizeChart},

    {path: '/dev-tools', component: DevTools},

    {path: '/management/collections', component: Collections},
    {path: '/management/tree', component: Tree}
  ]
})
