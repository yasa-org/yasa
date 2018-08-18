import Vue from 'vue'
import Vuex from 'vuex'

import collections from './collections'
import tree from './tree'

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
    collections,
    tree
  }
}
