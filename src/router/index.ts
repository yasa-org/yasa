import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Discover from '@/components/discover/Discover.vue'
import VisualizeChart from '@/components/visualize/Chart.vue'
import DevTools from '@/components/dev-tools/DevTools.vue'
import Collections from '@/components/management/Collections.vue'
import ConfigSet from '@/components/management/ConfigSets.vue'
import Tree from '@/components/management/Tree.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/dashboard' },

    { path: '/dashboard', component: Dashboard },

    { path: '/discover', component: Discover },

    { path: '/visualize', component: VisualizeChart },
    { path: '/visualize/chart', component: VisualizeChart },

    { path: '/dev-tools', component: DevTools },

    { path: '/management/config-sets', component: ConfigSet },
    { path: '/management/collections', component: Collections },
    { path: '/management/tree', component: Tree }
  ]
})
