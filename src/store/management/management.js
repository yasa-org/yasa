import Vue from 'vue'
import Vuex from 'vuex'

import tree from './tree'
import collections from './collections'
import configSets from './config-sets'

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
    collections,
    configSets
  }
}
