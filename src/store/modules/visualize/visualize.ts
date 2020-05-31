import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { Field } from '@/model'
import service from '@/service'

export type ChartFormData = {
  xField: string;
  charts: [{
    type: string;
    title: string;
    yField: string;
    yFieldAggregation: string;
  }];
}

const aggregationJsonFacet = (formData: ChartFormData) => {
  const result = {} as any
  formData.charts.forEach(c => {
    const agg = c.yFieldAggregation.toLowerCase()
    switch (agg) {
      case 'count':
        result[c.title] = {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc'
        }
        break
      case 'min':
      case 'max':
      case 'sum':
      case 'unique':
        result[c.title] = {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc',
          facet: {
            yAxis: `${agg}(${c.yField})`
          }
        }
        break
      case 'average':
        result[c.title] = {
          type: 'terms',
          field: formData.xField,
          sort: 'index desc',
          facet: {
            yAxis: `avg(${c.yField})`
          }
        }
        break
    }
  })
  return result
}

@Module({
  namespaced: true
})
export default class Visualize extends VuexModule {
  private collection = localStorage.getItem('collection') || ''
  private fields: Field[] = []
  private loadingFields = false
  private queryString = ''
  private chartDataSource: any[] = []
  private loadingChartData = false
  private result = {} as any
  private formData: ChartFormData = {
    xField: '',
    charts: [{
      type: 'line',
      title: 'Chart 1',
      yField: '',
      yFieldAggregation: ''
    }]
  }

  @Mutation
  public setCollection (collection: string): void {
    this.collection = collection
  }

  @Mutation
  public setFields (fields: Field[]): void {
    this.fields = fields
  }

  @Mutation
  public setLoadingFields (loadingFields: boolean): void {
    this.loadingFields = loadingFields
  }

  @Mutation
  public setFormData (formData: any): void {
    this.formData = formData
  }

  @Mutation
  public setQueryString (queryString: string): void {
    this.queryString = queryString
  }

  @Mutation
  public setResult (result: any): void {
    this.result = result
  }

  @Mutation
  public setChartDataSource (chartDataSource: any[]): void {
    this.chartDataSource = chartDataSource
  }

  @Mutation
  public setLoadingChartData (loadingChartData: boolean): void {
    this.loadingChartData = loadingChartData
  }

  @Action
  public reset (): void {
    this.context.commit('setFormData', {
      xField: '',
      charts: [{
        type: 'line',
        title: 'Chart 1',
        yField: '',
        yFieldAggregation: ''
      }]
    })
    this.context.commit('setChartDataSource', [{}])
    this.context.commit('setQueryString', '')
    this.context.commit('setResult', {})
  }

  @Action
  public loadChartData (): void {
    if (this.loadingChartData) {
      return
    }
    this.context.commit('setLoadingChartData', true)
    service.solr.collections.query(this.collection, {
      q: this.queryString || '*:*',
      rows: 0,
      'json.facet': JSON.stringify(aggregationJsonFacet(this.formData))
    }).then(res => {
      const dataSource = this.formData.charts.map(c => {
        const dataSource = res.data.facets[c.title].buckets.reverse()
        if (c.yFieldAggregation.toLowerCase() === 'count') {
          dataSource.forEach((it: any) => (it.yAxis = it.count))
        }
        return dataSource
      })

      this.context.commit('setChartDataSource', dataSource)
      this.context.commit('setLoadingChartData', false)
      this.context.commit('setResult', res.data)
    }, () => (this.context.commit('setLoadingChartData', false)))
  }

  @Action
  public loadFields (): void {
    const context = this.context
    if (!this.collection || this.loadingFields) return
    context.commit('setLoadingFields', true)
    service.solr.collections.fields(this.collection).then(res => {
      context.commit(
        'setFields',
        res.data.split(',')
          .map((field: string) => ({ name: field.trim() }))
          .sort((a: Field, b: Field) => a.name.localeCompare(b.name))
      )
      context.commit('setLoadingFields', false)
    }, () => context.commit('setLoadingFields', false))
  }
}
