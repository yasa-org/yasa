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

import { Header } from '@service/solr/model';
import { AxiosResponse } from 'axios';
import http from '@/http';

export interface LogItem {
  time: string;
  level: string;
  logger: string;
  message: string;
  core: string;
}

export interface History {
  numFound: number;
  start: number;
  docs: LogItem[];
}

export interface LoggingResponse {
  responseHeader: Header;
  watcher: string;
  info: {
    levels: string[];
    last: number;
    buffer: number;
    threshold: string;
  };
  history: History;
}

class LoggingService {
  public logs(since = 0): Promise<AxiosResponse<LoggingResponse>> {
    return http.get('/solr/admin/info/logging', {
      params: {
        since,
      },
    });
  }
}

export default new LoggingService();
