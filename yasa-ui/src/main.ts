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

import App from '@/App.vue';
import http from '@/http';
import i18n from '@/i18n';
import router from '@/router';
import store from '@/store';
import '@/style/element-variables.scss';
import '@/style/style.scss';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import Vue from 'vue';

import service from '@/service';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/axis';
import 'echarts/lib/component/axisPointer';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/tooltip';
import ECharts from 'vue-echarts/components/ECharts.vue';

Vue.use(ElementUI, { locale, size: 'mini' });

Vue.use({
  install(VueType: typeof Vue) {
    VueType.prototype.$service = service;
    VueType.prototype.$http = http;
  },
});

Vue.component('chart', ECharts);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  i18n,
  render: (h) => h(App),
  router,
  store,
}).$mount('#app');
