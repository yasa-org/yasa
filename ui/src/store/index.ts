/*!
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import Vue from 'vue';
import Vuex from 'vuex';

import service from '@/service';
import devtools from '@store/modules/dev-tools';
import discover from '@store/modules/discover/discover';
import management from '@store/modules/management';
import visualize from '@store/modules/visualize/visualize';

Vue.use(Vuex);

const params = {
  params: {
    wt: 'json',
  },
};

const store = new Vuex.Store({
  actions: {
    loadCollections: (context) => {
      if (context.state.loadingCollections) {
        return;
      }
      context.commit('setLoadingCollections', true);
      service.solr.admin.info
        .system()
        .then((modeRes) => {
          context.commit('setSolrMode', modeRes.data.mode);
          if (modeRes.data.mode === 'solrcloud') {
            return service.solr.collections.collections(params).then((res) => {
              context.commit('setCollections', res.data.collections);
            });
          } else {
            return service.solr.admin.cores.cores(params).then((res) => {
              context.commit('setCollections', Object.keys(res.data.status));
            });
          }
        })
        .finally(() => context.commit('setLoadingCollections', false));
    },
  },
  modules: {
    devtools,
    discover,
    management,
    visualize,
  },
  mutations: {
    setCollections(state, collections) {
      state.collections = collections;
    },
    setLoadingCollections(state, loadingCollections) {
      state.loadingCollections = loadingCollections;
    },
    setSolrMode(state, solrMode) {
      state.solrMode = solrMode;
    },
  },
  state: {
    collections: [],
    loadingCollections: false,
    solrMode: undefined,
  },
});
export default store;
