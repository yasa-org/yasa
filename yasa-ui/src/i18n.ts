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
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  en: {
    common: {
      justNow: 'Just Now',
      loadMore: 'Load More',
      nDaysAgo: '{0} days ago',
      nHoursAgo: '{0} hours ago',
      nMinutesAgo: '{0} minutes ago',
    },
    dashboard: {},
    discover: {
      availableFields: 'Available Fields',
      numHit: '{0} hits',
      queryInputHint: 'Search... (e.g. status:200 AND extension:java)',
      selectedFields: 'Selected Fields',
    },
    menu: {
      back2LegacyUI: 'Back to Legacy UI',
      cloud: 'Cloud',
      collapse: 'Collapse',
      collections: 'Collections',
      configSet: 'Config Set',
      dashboard: 'Dashboard',
      devTools: 'Dev Tools',
      discover: 'Discover',
      expand: 'Expand',
      logging: 'Logging',
      management: 'Management',
      tree: 'Tree',
      visualize: 'Visualize',
      zkStatus: 'ZK Status',
    },
    visualize: {
      aggregationIsRequired: 'Aggregation is required',
      buckets: 'Buckets',
      fieldIsRequired: 'Field is required',
      metrics: 'Metrics',
      title: 'Visualize',
      titleHint: 'Type chart title here',
      typeIsRequired: 'Chart type is required',
      xAxis: 'X-Axis',
      yAxis: 'Y-Axis',
    },
  },
};

export default new VueI18n({
  locale: 'en',
  messages,
});
