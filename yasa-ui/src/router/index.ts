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

import CodeEditor from '@components/common/code-editor/CodeEditor.vue';
import Dashboard from '@components/dashboard/Dashboard.vue';
import DevTools from '@components/dev-tools/DevTools.vue';
import Discover from '@components/discover/Discover.vue';
import ThreadDump from '@components/thread-dump/ThreadDumpView.vue';
import Logging from '@components/logging/Logging.vue';
import Collections from '@components/collection/Collections.vue';
import CollectionQuery from '@components/collection/Query.vue';
import ConfigSet from '@components/management/ConfigSets.vue';
import Tree from '@components/management/Tree.vue';
import VisualizeChart from '@components/visualize/Chart.vue';
import ZookeeperStatus from '@components/cloud/ZookeeperStatus.vue';
import Vue from 'vue';
import Router from 'vue-router';
import { RawLocation, Route } from 'vue-router/types/router';
import Callback from '@components/login/Callback.vue';

Vue.use(Router);

const originalPush: (location: RawLocation) => Promise<Route> = Router.prototype.push;

Router.prototype.push = function push(location: RawLocation) {
  return originalPush.call(this, location).catch((err) => err);
};

export default new Router({
  routes: [
    { path: '/', redirect: '/dashboard' },

    { path: '/callback', component: Callback },

    { path: '/test', component: CodeEditor },

    { path: '/dashboard', component: Dashboard },

    { path: '/discover', component: Discover },
    { path: '/thread-dump', component: ThreadDump },
    { path: '/logging', component: Logging },

    { path: '/visualize', component: VisualizeChart },
    { path: '/visualize/chart', component: VisualizeChart },

    { path: '/dev-tools', component: DevTools },

    { path: '/config-sets', component: ConfigSet },
    { path: '/collections', component: Collections },
    { path: '/collections/:name/query', component: CollectionQuery },

    { path: '/cloud/tree', component: Tree },
    { path: '/cloud/zk-status', component: ZookeeperStatus },
  ],
});
