import Vue from 'vue'
import Vuex from 'vuex'

import _ from '@/util'
import discover from '@store/modules/discover/discover'
import visualize from '@store/modules/visualize/visualize'
import devtools from '@store/modules/dev-tools'
import management from '@store/modules/management'
import infoService from '@/service/solr/admin/info'
import collectionService from '@/service/solr/collections'

Vue.use(Vuex)

const params = {
  params: {
    wt: 'json'
  }
}

const store = new Vuex.Store({
  state: {
    collections: [],
    loadingCollections: false,
    solrMode: undefined
  },
  mutations: {
    setCollections: _.set('collections'),
    setLoadingCollections: _.set('loadingCollections'),
    setSolrMode: _.set('solrMode')
  },
  actions: {
    loadCollections: (context) => {
      if (context.state.loadingCollections) return
      context.commit('setLoadingCollections', true)
      infoService.system().then(res => {
        context.commit('setSolrMode', res.data.mode)
        if (res.data.mode === 'solrcloud') {
          return collectionService.collections(params).then(res => {
            context.commit('setCollections', res.data.collections)
          })
        } else {
          return collectionService.cores(params).then((res) => {
            context.commit('setCollections', Object.keys(res.data.status))
          })
        }
      }).finally(() => context.commit('setLoadingCollections', false))
    }
  },
  modules: {
    discover,
    visualize,
    devtools,
    management
  }
})
export default store
