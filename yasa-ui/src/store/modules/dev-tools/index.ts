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

import http from '@/http';
import { GenericResult } from '@service/solr/model';
import { AxiosResponse } from 'axios';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({
  namespaced: true,
})
export default class DevTools extends VuexModule {
  private content: string = localStorage.getItem('content') || '';
  private result: GenericResult = {} as GenericResult;
  private loading = false;

  @Mutation
  public setContent(content: string): void {
    this.content = content;
    localStorage.setItem('content', content);
  }

  @Mutation
  public setResult(result: GenericResult): void {
    this.result = result;
  }

  @Mutation
  public setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Action
  public doGet({ url, data }: { url: string; data: object }) {
    const context = this.context;
    context.commit('setLoading', true);
    http
      .get(url, { params: data })
      .then((res: AxiosResponse<GenericResult>) => {
        context.commit('setResult', res.data);
      })
      .catch((err) => {
        context.commit('setResult', err);
      })
      .finally(() => {
        context.commit('setLoading', false);
      });
  }
}
