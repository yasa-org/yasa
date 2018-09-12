import Vue from 'vue'

import _ from '../../util/index'

const aggregationJsonFacet = (formData) => {
  const result = {}
  formData.charts.forEach(c => {
    const agg = c.yFieldAggregation.toLowerCase()
    switch (agg) {
      case 'count':
        result[c.title] = {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc'
        }
        break
      case 'min':
      case 'max':
      case 'sum':
      case 'unique':
        result[c.title] = {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc',
          facet: {
            yAxis: `${agg}(${formData.yField})`
          }
        }
        break
      case 'average':
        result[c.title] = {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc',
          facet: {
            yAxis: `avg(${formData.yField})`
          }
        }
        break
    }
  })
  return result
}

export default {
  namespaced: true,
  state: {
    collection: undefined,
    fields: [],
    loadingFields: false,
    queryString: undefined,
    formData: {
      type: 'line'
    },
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
      state.formData = {
        type: 'line'
      }
      state.chartDataSource = [{}]
      state.queryString = undefined
      state.result = {}
    }
  },
  actions: {
    loadChartData: (context) => {
      if (context.state.loadingChartData) return
      context.state.loadingChartData = true
      Vue.http.get(`/solr/${context.state.collection}/query?w=json`, {
        params: {
          q: context.state.queryString || '*:*',
          rows: 0,
          'json.facet': JSON.stringify(aggregationJsonFacet(context.state.formData))
        }
      }).then(res => {
        const dataSource = {}
        for (let index in context.state.formData.charts) {
          const c = context.state.formData.charts[index]
          const dataSource = res.data['facets'][c.title].buckets.reverse()
          if (c.yFieldAggregation.toLowerCase() === 'count') {
            dataSource.forEach(it => (it['yAxis'] = it.count))
          }
        }
        context.state.formData.charts.map(c => {
          const dataSource = res.data['facets'][c.title].buckets.reverse()
          if (c.yFieldAggregation.toLowerCase() === 'count') {
            dataSource.forEach(it => (it['yAxis'] = it.count))
          }
          return dataSource
        })
        console.log('%o', context.state.chartDataSource)

        context.state.chartDataSource = dataSource
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
