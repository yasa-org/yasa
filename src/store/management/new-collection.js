import Vue from 'vue'

import _ from '../../util'

export default {
  namespaced: true,
  state: {
    loadingConfigSets: false,
    configSets: [],
    newCollectionFormData: {
      name: undefined,
      'router.name': 'compositeId',
      numShards: 0,
      replicationFactor: 1,
      maxShardsPerNode: 1,
      createNodeSet: undefined,
      'collection.configName': undefined
    }
  },
  mutations: {
    setLoadingConfigSets: _.set('loadingConfigSets'),
    setConfigSets: _.set('configSets')
  },
  actions: {
    loadConfigSets: (context) => {
      if (context.state.loadingConfigSets) return
      context.commit('setLoadingConfigSets', true)
      Vue.http.get('/solr/admin/configs?wt=json&action=LIST').then(res => {
        context.commit('setLoadingConfigSets', false)
        context.commit('setConfigSets', res.data.configSets)
      }, () => context.commit('setLoadingConfigSets', false))
    }
  }
}
