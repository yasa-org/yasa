import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/dashboard/Dashboard'
import Discover from '../components/discover/Discover'
import VisualizeChart from '../components/visualize/Chart'
import DevTools from '../components/dev-tools/DevTools'
import Collections from '../components/management/Collections'
import ConfigSet from '../components/management/ConfigSets'
import Tree from '../components/management/Tree'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/dashboard'},

    {path: '/dashboard', component: Dashboard},

    {path: '/discover', component: Discover},

    {path: '/visualize', component: VisualizeChart},
    {path: '/visualize/chart', component: VisualizeChart},

    {path: '/dev-tools', component: DevTools},

    {path: '/management/config-sets', component: ConfigSet},
    {path: '/management/collections', component: Collections},
    {path: '/management/tree', component: Tree}
  ]
})
