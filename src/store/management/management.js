import Vue from 'vue'
import Vuex from 'vuex'

import tree from './tree'
import collections from './collections'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    tree,
    collections
  }
}
