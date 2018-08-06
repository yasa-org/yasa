import Vue from 'vue'
import Router from 'vue-router'
import Discover from '../components/discover/Discover'
import VisualizeNew from '../components/visualize/New'
import VisualizeChart from '../components/visualize/Chart'
import DevTools from '../components/dev-tools/DevTools'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/discover', component: Discover},

    {path: '/visualize', redirect: '/visualize/new'},
    {path: '/visualize/new', component: VisualizeNew},
    {path: '/visualize/chart', component: VisualizeChart},

    {path: '/dev-tools', component: DevTools}
  ]
})
