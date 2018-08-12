import Vue from 'vue'

import _ from '../util'

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
    queryString: undefined,
    formData: {},
    chartDataSource: [{}],
    loadingChartData: false,
    result: {}
  },
  mutations: {
    setFormData: _.set('formData'),
    setQueryString: _.set('queryString'),
    setResult: _.set('result')
  },
  actions: {
    loadChartData: (context) => {
      if (context.state.loadingChartData) return
      context.state.loadingChartData = true
      Vue.http.jsonp(`/solr/${context.rootState.collection}/query?w=json`, {
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
    }
  }
}
