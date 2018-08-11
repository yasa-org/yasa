<template>
  <el-container id="chart-root">
    <el-header height="28px">
      <el-input v-model="inputQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" v-model="collection" :value="collection" :loading="$store.state.loadingCollections">
          <el-option v-for="c in collections" :key="c" :value="c"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="onQuery" :loading="$store.state.loadingMore">{{ $t('discover.numHit', [numHit]) }}</el-button>
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
      numHit: 0,
      inputQueryString: undefined
    }
  },
  computed: {
    ...mapState(['collections', 'fields']),
    ...mapState('visualize', ['chartDataSource', 'loadingChartData']),
    collection: {
      get () {
        return this.$store.state.collection
      },
      set (val) {
        this.setCollection(val)
      }
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
    ...mapMutations('visualize', ['setXAxisOptions', 'setYAxisOptions']),
    ...mapActions(['loadFields']),
    ...mapActions('visualize', ['loadChartData']),
    onQuery () {
    },
    onSubmit (xAxis, yAxis) {
      this.setXAxisOptions(xAxis)
      this.setYAxisOptions(yAxis)
      this.loadChartData()
    }
  },
  watch: {
    collections () {
      if (this.collections.length > 0) {
        this.setCollection(this.collections[0])
      }
    },
    collection () {
      this.loadFields()
    },
    result () {
      this.numHit = ((this.result || {}).response || {}).numFound || 0
    },
    loadingChartData () {
      if (this.loadingChartData) {
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
