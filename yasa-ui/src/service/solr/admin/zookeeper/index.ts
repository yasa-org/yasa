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
import { AxiosResponse } from 'axios';
import { Header } from '@service/solr/model';

export interface Prop {
  version: number;
  aversion: number;
  children_count: number;
  ctime: string;
  cversion: number;
  czxid: number;
  ephemeralOwner: number;
  mtime: string;
  mzxid: number;
  pzxid: number;
  dataLength: number;
}

export interface ZkTreeNode {
  data?: {
    title: string;
    attr: {
      href: string;
    };
  };
  text?: string;
  a_attr?: {
    href: string;
  };
  children: never[];

  ephemeral: boolean;
  version: number;
}

export interface ZNode {
  path: string;
  prop: Prop;
  tree: ZkTreeNode[];
  data: string;
}

export interface ZookeeperResponse {
  znode: ZNode;
  tree: ZkTreeNode[];
}

export interface ZKStatusResponse {
  responseHeader: Header;
  zkStatus: {
    mode: string;
    ensembleSize: number;
    zkHost: string;
    status: string;
    details: {
      zk_version: string;
      zk_znode_count: number;
      host: string;
      clientPort: number;
      secureClientPort: number;
      ok: boolean;
      zk_approximate_data_size: number;
    }[];
  };
}

class ZookeeperService {
  public zookeeper(params: object = {}): Promise<AxiosResponse<ZookeeperResponse>> {
    return http.get('/solr/admin/zookeeper', { params });
  }

  public status(wt = 'json'): Promise<AxiosResponse<ZKStatusResponse>> {
    return http.get('/solr/admin/zookeeper/status', {
      params: {
        wt,
      },
    });
  }
}

export default new ZookeeperService();
