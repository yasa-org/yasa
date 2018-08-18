import Vue from 'vue'
import Vuex from 'vuex'

import _ from '../util'
import discover from './discover/discover'
import visualize from './visualize/visualize'
import devtools from './dev-tools/dev-tools'
import management from './management/management'

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
      Vue.http.get('/solr/admin/info/system', params).then(res => {
        context.commit('setSolrMode', res.data.mode)
        if (res.data.mode === 'solrcloud') {
          Vue.http.get('/solr/admin/collections?action=LIST', params).then((res) => {
            context.commit('setCollections', res.data.collections)
            context.commit('setLoadingCollections', false)
          }, () => context.commit('setLoadingCollections', false))
        } else {
          Vue.http.get('/solr/admin/cores', params).then((res) => {
            context.commit('setCollections', Object.keys(res.data.status))
            context.commit('setLoadingCollections', false)
          }, () => context.commit('setLoadingCollections', false))
        }
      })
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
