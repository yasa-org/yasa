import Vue from 'vue'

import _ from '../../util/index'

const aggregationJsonFacet = (formData) => {
  const agg = formData.yFieldAggregation.toLowerCase()
  switch (agg) {
    case 'count':
      return {
        xAxis: {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc'
        }
      }
    case 'min':
    case 'max':
    case 'sum':
    case 'unique':
      return {
        xAxis: {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc',
          facet: {
            yAxis: `${agg}(${formData.yField})`
          }
        }
      }
    case 'average':
      return {
        xAxis: {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc',
          facet: {
            yAxis: `avg(${formData.yField})`
          }
        }
      }
    default:
      return undefined
  }
}

export default {
  namespaced: true,
  state: {
    collection: undefined,
    fields: [],
    loadingFields: false,
    queryString: undefined,
    formData: {},
    chartDataSource: [{}],
    loadingChartData: false,
    result: {}
  },
  mutations: {
    setCollection: _.set('collection'),
    setFields: _.set('fields'),
    setLoadingFields: _.set('loadingFields'),
    setFormData: _.set('formData'),
    setQueryString: _.set('queryString'),
    setResult: _.set('result'),
    reset: (state) => {
      state.formData = {}
      state.chartDataSource = [{}]
      state.queryString = undefined
      state.result = {}
    }
  },
  actions: {
    loadChartData: (context) => {
      if (context.state.loadingChartData) return
      context.state.loadingChartData = true
      Vue.http.jsonp(`/solr/${context.state.collection}/query?w=json`, {
        params: {
          q: context.state.queryString || '*:*',
          rows: 0,
          'json.facet': JSON.stringify(aggregationJsonFacet(context.state.formData))
        },
        jsonp: 'json.wrf'
      }).then(res => {
        context.state.chartDataSource = res.data['facets'].xAxis.buckets.reverse()
        if (context.state.formData.yFieldAggregation.toLowerCase() === 'count') {
          context.state.chartDataSource.forEach(it => (it['yAxis'] = it.count))
        }
        context.state.loadingChartData = false
        context.state.result = res.data
      }, () => (context.state.loadingChartData = false))
    },
    loadFields: (context) => {
      if (!context.state.collection || context.state.loadingFields) return
      context.commit('setLoadingFields', true)
      Vue.http.get(`/solr/${context.state.collection}/schema/fields?wt=csv`).then(res => {
        context.commit('setFields', res.data.split(',').map(f => ({name: f.trim()})).sort((a, b) => a.name.localeCompare(b.name)))
        context.commit('setLoadingFields', false)
      }, () => context.commit('setLoadingFields', false))
    }
  }
}
