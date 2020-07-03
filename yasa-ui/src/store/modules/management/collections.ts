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

import service from '@/service';
import { CollectionDetail, CollectionForm } from '@service/solr/collections';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

const params = {
  params: {
    wt: 'json',
  },
};

export type NamedCollectionDetail = CollectionDetail & { name: string };

@Module({
  namespaced: true,
})
export default class ManagementCollections extends VuexModule {
  public detailedCollections: NamedCollectionDetail[] = [];
  public loadingDetailedCollections = false;
  public loadingConfigSets = false;
  public configSets: string[] = [];
  public newCollectionFormData: CollectionForm = {
    'collection.configName': '',
    createNodeSet: undefined,
    maxShardsPerNode: 1,
    name: '',
    numShards: 0,
    replicationFactor: 1,
    'router.name': 'compositeId',
    autoAddReplicas: false,
  };

  @Mutation
  public setLoadingConfigSets(loadingConfigSets: boolean): void {
    this.loadingConfigSets = loadingConfigSets;
  }

  @Mutation
  public setConfigSets(configSets: string[]): void {
    this.configSets = configSets;
  }

  @Mutation
  public setDetailedCollections(detailedCollections: NamedCollectionDetail[]): void {
    this.detailedCollections = detailedCollections;
  }

  @Mutation
  public setLoadingDetailedCollections(loadingDetailedCollections: boolean): void {
    this.loadingDetailedCollections = loadingDetailedCollections;
  }

  @Action
  public loadDetailedCollections(): void {
    const context = this.context;
    if (context.rootState.solrMode === 'solrcloud') {
      context.commit('setLoadingDetailedCollections', true);
      service.solr.collections.clusters(params).then(
        (res) => {
          const detailedCollectionsKeyedByName = res.data.cluster.collections;
          const detailedCollections = Object.keys(detailedCollectionsKeyedByName).map((name) => {
            const detailedCollection = detailedCollectionsKeyedByName[name] as NamedCollectionDetail;
            detailedCollection.name = name;
            return detailedCollection;
          });
          context.commit('setDetailedCollections', detailedCollections);
          context.commit('setLoadingDetailedCollections', false);
        },
        () => context.commit('setLoadingDetailedCollections', false),
      );
    }
  }

  @Action
  public loadConfigSets(): void {
    const context = this.context;
    if (this.loadingConfigSets) {
      return;
    }
    context.commit('setLoadingConfigSets', true);
    service.solr.admin.configs.configs().then(
      (res) => {
        context.commit('setLoadingConfigSets', false);
        context.commit('setConfigSets', res.data.configSets);
      },
      () => context.commit('setLoadingConfigSets', false),
    );
  }
}
