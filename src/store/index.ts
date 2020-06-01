import Vue from 'vue'
import Vuex from 'vuex'

import discover from '@store/modules/discover/discover'
import visualize from '@store/modules/visualize/visualize'
import devtools from '@store/modules/dev-tools'
import management from '@store/modules/management'
import service from '@/service'

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
    setCollections (state, collections) {
      state.collections = collections
    },
    setLoadingCollections (state, loadingCollections) {
      state.loadingCollections = loadingCollections
    },
    setSolrMode (state, solrMode) {
      state.solrMode = solrMode
    }
  },
  actions: {
    loadCollections: (context) => {
      if (context.state.loadingCollections) return
      context.commit('setLoadingCollections', true)
      service.solr.admin.info.system().then(res => {
        context.commit('setSolrMode', res.data.mode)
        if (res.data.mode === 'solrcloud') {
          return service.solr.collections.collections(params).then(res => {
            context.commit('setCollections', res.data.collections)
          })
        } else {
          return service.solr.admin.cores.cores(params).then((res) => {
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
