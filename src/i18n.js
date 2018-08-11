import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    menu: {
      collapse: 'Collapse',
      expand: 'Expand',
      discover: 'Discover',
      visualize: 'Visualize',
      devTools: 'Dev Tools',
      dashboard: 'Dashboard',
      management: 'Management'
    },
    common: {
      loadMore: 'Load More'
    },
    discover: {
      numHit: '{0} hits',
      queryInputHint: 'Search... (e.g. status:200 AND extension:java)',
      availableFields: 'Available Fields',
      selectedFields: 'Selected Fields'
    },
    visualize: {
      metrics: 'Metrics',
      buckets: 'Buckets',
      xAxis: 'X-Axis',
      yAxis: 'Y-Axis'
    }
  }
}

export default new VueI18n({
  locale: 'en',
  messages
})
