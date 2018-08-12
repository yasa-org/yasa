import Vue from 'vue'
import Vuex from 'vuex'

import _ from '../util'
import discover from './discover'
import visualize from './visualize/visualize'

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
    loadingCollections: false,
    collection: undefined,
    fields: [],
    loadingFields: false
  },
  mutations: {
    setCollections: _.set('collections'),
    setLoadingCollections: _.set('loadingCollections'),
    setCollection: (state, val) => {
      state.collection = val
      localStorage.setItem('currentCollection', state.collection)
    },
    setFields: _.set('fields'),
    setLoadingFields: _.set('loadingFields')
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
    },
    loadFields: (context) => {
      if (!context.state.collection || context.state.loadingFields) return
      context.commit('setLoadingFields', true)
      Vue.http.get(`/solr/${context.state.collection}/schema/fields?wt=csv`).then(res => {
        context.commit('setFields', res.data.split(',').map(f => ({name: f.trim()})).sort((a, b) => a.name.localeCompare(b.name)))
        context.commit('setLoadingFields', false)
      }, () => context.commit('setLoadingFields', false))
    }
  },
  modules: {
    discover,
    visualize
  }
})
export default store
