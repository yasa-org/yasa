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
    dashboard: {
    },
    common: {
      loadMore: 'Load More',
      justNow: 'Just Now',
      nMinutesAgo: '{0} minutes ago',
      nHoursAgo: '{0} hours ago',
      nDaysAgo: '{0} days ago'
    },
    discover: {
      numHit: '{0} hits',
      queryInputHint: 'Search... (e.g. status:200 AND extension:java)',
      availableFields: 'Available Fields',
      selectedFields: 'Selected Fields'
    },
    visualize: {
      title: 'Visualize',
      metrics: 'Metrics',
      buckets: 'Buckets',
      titleHint: 'Type chart title here',
      xAxis: 'X-Axis',
      yAxis: 'Y-Axis',
      aggregationIsRequired: 'Aggregation is required',
      fieldIsRequired: 'Field is required',
      typeIsRequired: 'Chart type is required'
    }
  }
}

export default new VueI18n({
  locale: 'en',
  messages
})
