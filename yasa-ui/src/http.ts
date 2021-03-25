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

import axios, { AxiosResponse } from 'axios';

const instance = axios.create({
  headers: {
    'Content-type': 'application/json',
  },
});

const paramsToString = (params: Record<string, string>) => {
  return Object.keys(params)
    .filter((key) => Object.prototype.hasOwnProperty.call(params, key))
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
};

instance.interceptors.request.use(
  (req) => {
    const authorization = sessionStorage.getItem('Authorization');
    authorization && (req.headers['Authorization'] = authorization);
    return req;
  },
  (error) => Promise.reject(error),
);

const setAuthData = (response: AxiosResponse) => {
  const header = response.headers['x-solr-authdata'];
  header && sessionStorage.setItem('auth.authDataHeader', atob(header));
  sessionStorage.setItem('auth.status', String(response.status));
};

instance.interceptors.response.use(
  (res) => {
    setAuthData(res);

    return res;
  },
  (error) => {
    setAuthData(error.response);

    const authNonce =
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2);
    const xSolrAuthData = JSON.parse(sessionStorage.getItem('auth.authDataHeader') || '{}');
    const params = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      response_type: 'id_token token',
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: xSolrAuthData['client_id'],
      // eslint-disable-next-line @typescript-eslint/camelcase
      redirect_uri: window.location.href.split('/#')[0] + '/#/callback?',
      scope: `openid ${xSolrAuthData['scope']}`,
      state: Math.random().toString(36).substr(2),
      nonce: authNonce,
    };

    if (error.response.status === 401) {
      window.location.href = `${xSolrAuthData['authorizationEndpoint']}?${paramsToString(params)}`;
      return;
    }

    return Promise.reject(error);
  },
);

export default instance;
