import Vue from 'vue'
import Vuex from 'vuex'

import _ from '../util'
import discover from './discover'
import visualize from './visualize/visualize'
import devtools from './dev-tools/dev-tools'

Vue.use(Vuex)

const params = {
  params: {
    wt: 'json'
  },
  jsonp: 'json.wrf'
}

const store = new Vuex.Store({
  state: {
    collections: [],
    loadingCollections: false
  },
  mutations: {
    setCollections: _.set('collections'),
    setLoadingCollections: _.set('loadingCollections')
  },
  actions: {
    loadCollections: (context) => {
      if (context.state.loadingCollections) return
      context.commit('setLoadingCollections', true)
      Vue.http.jsonp('/solr/admin/info/system', params).then(res => {
        if (res.data.mode === 'solrcloud') {
          Vue.http.jsonp('/solr/admin/collections?action=LIST', params).then((res) => {
            context.commit('setCollections', res.data.collections)
            context.commit('setLoadingCollections', false)
          }, () => context.commit('setLoadingCollections', false))
        } else {
          Vue.http.jsonp('/solr/admin/cores', params).then((res) => {
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
    devtools
  }
})
export default store
