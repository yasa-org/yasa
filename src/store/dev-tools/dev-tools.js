import Vue from 'vue'

import _ from '../../util'

export default {
  namespaced: true,
  state: {
    content: localStorage.getItem('content') || '',
    result: {},
    loading: false
  },
  mutations: {
    setContent: _.set('content', true),
    setResult: _.set('result'),
    setLoading: _.set('loading')
  },
  actions: {
    doGet: (context, {url, data}) => {
      context.commit('setLoading', true)
      Vue.http.get(url, { params: data }).then(res => {
        context.commit('setResult', res.data)
        context.commit('setLoading', false)
      }, () => {
        context.commit('setLoading', false)
      })
    }
  }
}
