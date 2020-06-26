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
import { ZkTreeNode } from '@service/solr/admin/zookeeper';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({
  namespaced: true,
})
export default class Tree extends VuexModule {
  private configSets: ZkTreeNode[] = [];
  private loadingConfigSets = false;
  private fileContent = '';

  @Mutation public setConfigSets(configSets: ZkTreeNode[]): void {
    this.configSets = configSets;
  }

  @Mutation public setLoadingConfigSets(loadingConfigSets: boolean): void {
    this.loadingConfigSets = loadingConfigSets;
  }

  @Mutation public setFileContent(fileContent: string): void {
    this.fileContent = fileContent;
  }

  @Action
  public loadConfigSets(): void {
    const context = this.context;
    context.commit('setLoadingConfigSets', true);
    service.solr.admin.zookeeper
      .zookeeper({
        path: '/',
      })
      .then(
        (res) => {
          context.commit('setLoadingConfigSets', false);
          const r = res.data.tree;
          context.commit('setConfigSets', r);
        },
        () => context.commit('setLoadingConfigSets', false),
      );
  }
}
