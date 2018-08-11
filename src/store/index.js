import Vue from 'vue'
import Vuex from 'vuex'

import _ from '../util'
import discover from './discover'
import visualize from './visualize'

Vue.use(Vuex)

const params = {
  params: {
    wt: 'json'
  },
  jsonp: 'json.wrf'
}

export default new Vuex.Store({
  state: {
    collections: [],
    loadingCollections: true,
    collection: undefined,
    fields: [],
    loadingFields: true
  },
  mutations: {
    setCollections: _.set('collections'),
    setLoadingCollections: _.set('loadingCollections'),
    setCollection: (state, val) => {
      state.collection = val
      localStorage.setItem('collection', state.collection)
    },
    setFields: _.set('fields'),
    setLoadingFields: _.set('loadingFields')
  },
  actions: {
    loadCollections: (context) => {
      context.commit('setLoadingCollections', true)
      Vue.http.jsonp('/solr/admin/info/system?wt=json', {jsonp: 'json.wrf'}).then(res => {
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
      if (!context.state.collection) return

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
