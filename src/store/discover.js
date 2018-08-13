import Vue from 'vue'

import _ from '../util'

export default {
  namespaced: true,
  state: {
    availableFields: [],
    selectedFields: [],
    queryString: '*:*',
    loadingMore: false,
    docs: [],
    result: {
      nextCursorMark: '*',
      numFound: 0
    },
    numHit: 0
  },
  mutations: {
    setAvailableFields: _.set('availableFields'),
    setSelectedFields: _.set('selectedFields'),
    setQueryString: _.set('queryString'),
    setLoadingMore: _.set('loadingMore'),
    setDocs: _.set('docs'),
    addDocs: (state, docs) => state.docs.push(...docs),
    setResult: (state, val) => {
      state.result = val
      state.numHit = ((state.result || {}).response || {}).numFound || 0
    },
    addSelectedField: (state, field) => {
      state.selectedFields.push(field)
      state.availableFields.splice(state.availableFields.indexOf(field), 1)
      state.availableFields.sort((a, b) => a.name.localeCompare(b.name))
    },
    removeSelectedField: (state, field) => {
      state.availableFields.push(field)
      state.selectedFields.splice(state.selectedFields.indexOf(field), 1)
      state.availableFields.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  actions: {
    loadMore (context) {
      console.log('loading more')
      context.commit('setLoadingMore', true)
      Vue.http.get(`/solr/${context.rootState.collection}/select?wt=json`, {
        params: {
          q: context.state.queryString,
          sort: 'id desc',
          rows: 50,
          cursorMark: context.state.result.nextCursorMark || '*'
        }
      }).then(res => {
        context.commit('setResult', res.data)
        context.commit('addDocs', res.data.response.docs)
        context.commit('setLoadingMore', false)
      }, () => context.commit('setLoadingMore', false))
    }
  }
}
