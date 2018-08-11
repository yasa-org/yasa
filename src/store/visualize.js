import Vue from 'vue'

import _ from '../util'

export default {
  namespaced: true,
  state: {
    xAxisOptions: {},
    yAxisOptions: {},
    chartDataSource: [{}],
    loadingChartData: false
  },
  mutations: {
    setXAxisOptions: _.set('xAxisOptions'),
    setYAxisOptions: _.set('yAxisOptions')
  },
  actions: {
    loadChartData: (context) => {
      if (context.state.loadingChartData) return
      context.state.loadingChartData = true
      Vue.http.jsonp(`/solr/${context.rootState.collection}/query?w=json`, {
        params: {
          q: '*:*',
          rows: 0,
          'json.facet': JSON.stringify({
            xAxis: {
              type: 'terms',
              field: context.state.xAxisOptions.field,
              limit: 50,
              sort: 'index',
              facet: {
                yAxis: `unique(${context.state.yAxisOptions.field})`
              }
            }
          })
        },
        jsonp: 'json.wrf'
      }).then(res => {
        context.state.chartDataSource = res.data.facets.xAxis.buckets
        context.state.loadingChartData = false
      })
    }
  }
}
