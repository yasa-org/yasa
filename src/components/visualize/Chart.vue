<template>
  <el-container id="chart-root">
    <el-header height="28px">
      <el-input v-model="inputQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" :value="collection" :loading="state.loadingCollections">
          <el-option v-for="c in collections" :key="c" :value="c"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="onQuery" :loading="state.loadingMore">{{ $t('discover.numHit', [numHit]) }}</el-button>
      </el-input>
    </el-header>
    <el-container>
      <el-aside>
        <chart-form :fields="fields" @submit="onSubmit"></chart-form>
      </el-aside>
      <el-main>
        <chart class="chart" ref="chart" :options="chartOptions" auto-resize/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ChartForm from './ChartForm'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'yasa-chart',
  components: {ChartForm},
  data () {
    return {
      numHit: 0,
      fields: [],
      inputQueryString: undefined,
      state: {
        loadingCollections: true,
        loadingCollectionsSuccess: true,
        loadingFields: true,
        loadingFieldsSuccess: true,
        loadingChartData: false
      },
      chartDataSource: [{}],
      xAxisOptions: {},
      yAxisOptions: {}
    }
  },
  created () {
    this.loadCollections()
  },
  computed: {
    ...mapState(['collections', 'collection']),
    chartOptions () {
      return {
        dataset: {
          source: this.chartDataSource
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {}
        },
        legend: {},
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {},
        series: [
          {name: 'xAxis', type: 'line', dimensions: ['val', 'yAxis']}
        ],
        grid: {
          left: 10,
          right: 20,
          bottom: 10,
          top: 40,
          containLabel: true
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setCollection']),
    loadFields () {
      if (!this.collection) return

      this.state.loadingFields = true

      this.$http.get(`/solr/${this.collection}/schema/fields?wt=csv`).then(res => {
        this.fields = res.data.split(',').map(f => ({name: f.trim()})).sort((a, b) => a.name.localeCompare(b.name))
        this.state.loadingFields = false
        this.state.loadingFieldsSuccess = true
      }, () => {
        this.state.loadingFields = false
        this.state.loadingFieldsSuccess = false
      })
    },
    onQuery () {
    },
    onSubmit (xAxis, yAxis) {
      this.xAxisOptions = xAxis
      this.yAxisOptions = yAxis
      if (this.state.loadingChartData) return
      this.state.loadingChartData = true
      this.$http.jsonp(`/solr/${this.collection}/query?w=json`, {
        params: {
          q: '*:*',
          rows: 0,
          'json.facet': JSON.stringify({
            xAxis: {
              type: 'terms',
              field: xAxis.field,
              limit: 50,
              sort: 'index',
              facet: {
                yAxis: `unique(${yAxis.field})`
              }
            }
          })
        },
        jsonp: 'json.wrf'
      }).then(res => {
        this.chartDataSource = res.data.facets.xAxis.buckets
        this.state.loadingChartData = false
      })
    }
  },
  watch: {
    collections () {
      if (this.collections.length > 0) {
        this.setCollection(this.collections[0])
      }
    },
    collection () {
      this.result = {}
      this.loadFields()
    },
    result () {
      this.numHit = ((this.result || {}).response || {}).numFound || 0
    },
    'state.loadingChartData' () {
      if (this.state.loadingChartData) {
        this.$refs.chart.showLoading()
      } else {
        this.$refs.chart.hideLoading()
      }
    }
  }
}
</script>

<style scoped>
#chart-root {
  height: 100%;
  overflow: auto;
  padding: 0;
}
.el-main, .el-container, .el-header {
  height: 100%;
  padding: 0;
}
.el-header {
  padding: 0 8px;
}
.el-aside {
  padding: 8px;
  border-right: 1px solid lightgray;
}
.el-select {
  width: 290px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
