import Vue from 'vue'

import _ from '../../util'

const params = {
  params: {
    wt: 'json'
  },
  jsonp: 'json.wrf'
}

export default {
  namespaced: true,
  state: {
    detailedCollections: [],
    loadingDetailedCollections: false
  },
  mutations: {
    setDetailedCollections: _.set('detailedCollections'),
    setLoadingDetailedCollections: _.set('loadingDetailedCollections')
  },
  actions: {
    loadDetailedCollections: (context) => {
      context.commit('setLoadingDetailedCollections', true)
      Vue.http.get('/solr/admin/info/system', params).then(res => {
        if (res.data.mode === 'solrcloud') {
          Vue.http.get('/solr/admin/collections?action=CLUSTERSTATUS', params).then((res) => {
            const detailedCollectionsKeyedByName = res.data.cluster.collections
            const detailedCollections = Object.keys(detailedCollectionsKeyedByName).map(name => {
              const detailedCollection = detailedCollectionsKeyedByName[name]
              detailedCollection.name = name
              return detailedCollection
            })
            context.commit('setDetailedCollections', detailedCollections)
            context.commit('setLoadingDetailedCollections', false)
          }, () => context.commit('setLoadingDetailedCollections', false))
        } else {
          context.commit('setLoadingDetailedCollections', false)
        }
      }, () => context.commit('setLoadingDetailedCollections', false))
    }
  }
}
