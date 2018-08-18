import Vue from 'vue'

import _ from '../../util'

export default {
  namespaced: true,
  state: {
    configSets: [],
    loadingConfigSets: false,
    fileContent: ''
  },
  mutations: {
    setConfigSets: _.set('configSets'),
    setLoadingConfigSets: _.set('loadingConfigSets'),
    setFileContent: _.set('fileContent')
  },
  actions: {
    loadConfigSets: (context) => {
      context.commit('setLoadingConfigSets', true)
      Vue.http.get('/solr/admin/zookeeper', {
        params: {
          path: '/'
        }
      }).then(res => {
        context.commit('setLoadingConfigSets', false)
        const r = res.data.tree
        context.commit('setConfigSets', r)
      }, () => context.commit('setLoadingConfigSets', false))
    }
  }
}
