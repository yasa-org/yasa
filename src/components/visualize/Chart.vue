<template>
  <el-container id="chart-root">
    <el-header height="28px">
      <el-input v-model="localQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" v-model="collection" :value="collection" :loading="$store.state.loadingCollections">
          <el-option v-for="c in collections" :key="c" :value="c"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="onQuery" :loading="loadingChartData">{{ $t('discover.numHit', [numHit]) }}</el-button>
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
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  name: 'yasa-chart',
  components: {ChartForm},
  data () {
    return {
      localQueryString: undefined
    }
  },
  created () {
    this.selectCollection()
  },
  mounted () {
    this.reset()
  },
  computed: {
    ...mapState(['collections']),
    ...mapState('visualize', ['fields', 'chartDataSource', 'loadingChartData', 'result', 'formData']),
    collection: {
      get () {
        return this.$store.state.visualize.collection
      },
      set (val) {
        this.setCollection(val)
      }
    },
    chartType () {
      const type = this.$route.query['type'].toLowerCase()
      switch (type) {
        case 'line':
        case 'area':
          return 'line'
        case 'vertical bar':
          return 'bar'
        default:
          return undefined
      }
    },
    areaStyle () {
      const type = this.$route.query['type'].toLowerCase()
      return type === 'area' ? {} : undefined
    },
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
          {name: this.formData.title || 'xAxis', type: this.chartType, dimensions: ['val', 'yAxis'], areaStyle: this.areaStyle, smooth: true}
        ],
        grid: {
          left: 10,
          right: 20,
          bottom: 10,
          top: 40,
          containLabel: true
        }
      }
    },
    numHit () {
      return ((this.result || {}).response || {}).numFound || 0
    }
  },
  methods: {
    ...mapMutations('visualize', ['setCollection', 'setFormData', 'setResult', 'setQueryString', 'reset']),
    ...mapActions('visualize', ['loadFields', 'loadChartData']),
    onSubmit (formData) {
      this.setFormData(formData)
      this.loadChartData()
    },
    onQuery () {
      this.setQueryString(this.localQueryString)
      this.loadChartData()
    },
    selectCollection () {
      if (this.collections.length > 0) {
        this.setCollection(this.collections[0])
      }
    }
  },
  watch: {
    collections () {
      this.selectCollection()
    },
    loadingChartData () {
      if (this.loadingChartData) {
        this.$refs.chart.showLoading()
      } else {
        this.$refs.chart.hideLoading()
      }
    },
    collection () {
      this.setFormData({})
      this.setResult({})
      this.loadFields()
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
