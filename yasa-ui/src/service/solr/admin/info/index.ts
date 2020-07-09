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
import { Header } from '@service/solr/model';
import { AxiosResponse } from 'axios';

export interface JVM {
  version: string;
  name: string;
  spec: {
    vendor: string;
    name: string;
    version: string;
  };

  jre: {
    vendor: string;
    version: string;
  };

  vm: {
    vendor: string;
    name: string;
    version: string;
  };

  processors: number;

  memory: {
    free: string;
    total: string;
    max: string;
    used: string;
    raw: {
      free: number;
      total: number;
      max: number;
      used: number;
      'used%': number;
    };
  };

  jmx: {
    classpath: string;
    commandLineArgs: string[];
    startTime: string;
    upTimeMS: number;
  };
}

export interface System {
  name: string;
  arch: string;
  availableProcessors: number;
  systemLoadAverage: number;
  version: string;
  committedVirtualMemorySize: number;
  freePhysicalMemorySize: number;
  freeSwapSpaceSize: number;
  processCpuLoad: number;
  processCpuTime: number;
  systemCpuLoad: number;
  totalPhysicalMemorySize: number;
  totalSwapSpaceSize: number;
  maxFileDescriptorCount: number;
  openFileDescriptorCount: number;
  uname: string;
  uptime: string;
}

export interface SystemResponse {
  responseHeader: Header;
  mode: string;
  zkHost: string;
  lucene: {
    'solr-spec-version': string;
    'solr-impl-version': string;
    'lucene-spec-version': string;
    'lucene-impl-version': string;
  };

  jvm: JVM;
  system: System;
  node: string;
}

export interface ThreadDump {
  id: number;
  name: string;
  state: string;
  cpuTime: string;
  userTime: string;
  stackTrace: string[];
}

export interface ThreadsResponse {
  responseHeader: Header;
  system: {
    threadCount: {
      current: number;
      peak: number;
      daemon: number;
    };
    threadDump: (ThreadDump | string)[];
  };
}

class InfoService {
  public system(format = 'json'): Promise<AxiosResponse<SystemResponse>> {
    return http.get(`/solr/admin/info/system?wt=${format}`);
  }

  public threads(format = 'json'): Promise<AxiosResponse<ThreadsResponse>> {
    return http.get(`/solr/admin/info/threads?wt=${format}`);
  }
}

export default new InfoService();
