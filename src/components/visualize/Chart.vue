<template>
  <el-container id="chart-root">
    <el-header height="28px">
      <el-input v-model="inputQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" v-model="selectedCollection" :value="selectedCollection" :loading="state.loadingCollections">
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

export default {
  name: 'yasa-chart',
  components: {ChartForm},
  data () {
    return {
      numHit: 0,
      collections: [],
      selectedCollection: undefined,
      fields: [],
      inputQueryString: undefined,
      state: {
        loadingCollections: true,
        loadingCollectionsSuccess: true,
        loadingFields: true,
        loadingFieldsSuccess: true
      },
      chartOptions: {
        dataset: {
          source: []
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
  created () {
    this.loadCollections()
  },
  methods: {
    loadCollections () {
      this.state.loadingCollections = true
      this.$http.jsonp('/solr/admin/info/system?wt=json', {jsonp: 'json.wrf'}).then(res => {
        if (res.data.mode === 'solrcloud') {
          this.$http.jsonp('/solr/admin/collections', {
            params: {
              action: 'LIST',
              wt: 'json'
            },
            jsonp: 'json.wrf'
          }).then((res) => {
            this.collections = res.data.collections
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = true
          }, () => {
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = false
          })
        } else {
          this.$http.jsonp('/solr/admin/cores', {
            params: {
              wt: 'json'
            },
            jsonp: 'json.wrf'
          }).then((res) => {
            this.collections = Object.keys(res.data.status)
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = true
          }, () => {
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = false
          })
        }
      })
    },
    loadFields () {
      if (!this.selectedCollection) return

      this.state.loadingFields = true

      this.$http.get(`/solr/${this.selectedCollection}/schema/fields?wt=csv`).then(res => {
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
      console.log('xAxis=%o, yAxis=%o', xAxis, yAxis)
      this.$http.jsonp(`/solr/${this.selectedCollection}/query?w=json`, {
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
        this.chartOptions.dataset.source = res.data.facets.xAxis.buckets
      })
    }
  },
  watch: {
    collections () {
      if (this.collections.length > 0) {
        this.selectedCollection = this.collections[0]
      }
    },
    selectedCollection () {
      this.result = {}
      this.loadFields()
    },
    result () {
      this.numHit = ((this.result || {}).response || {}).numFound || 0
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
