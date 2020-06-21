import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { Bucket, Buckets, SelectResult } from '@service/solr/collections'
import { Field } from '@/model'
import service from '@/service'

export class ChartFormData {
  title = '';
  type = '';
  xField = '';
  charts: Array<{
    type: string;
    title: string;
    yField: string;
    yFieldAggregation: string;
  }> = [];
}

type JsonFacet = {
  type: string;
  field: string;
  sort: string;
  facet?: {
    yAxis: string;
  };
}

const aggregationJsonFacet = (formData: ChartFormData) => {
  const result: {
    [key: string]: JsonFacet;
  } = {}
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
  private chartDataSource: { [title: string]: Bucket[] } = {}
  private loadingChartData = false
  private result: SelectResult = {} as SelectResult
  private formData: ChartFormData = {
    title: '',
    type: '',
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
  public setFormData (formData: ChartFormData): void {
    this.formData = formData
  }

  @Mutation
  public setQueryString (queryString: string): void {
    this.queryString = queryString
  }

  @Mutation
  public setResult (result: SelectResult): void {
    this.result = result
  }

  @Mutation
  public setChartDataSource (chartDataSource: { [title: string]: Bucket[] }): void {
    this.chartDataSource = chartDataSource
  }

  @Mutation
  public setLoadingChartData (loadingChartData: boolean): void {
    this.loadingChartData = loadingChartData
  }

  @Action
  public reset (): void {
    this.context.commit('setFormData', {
      title: '',
      type: 'line',
      xField: '',
      charts: [{
        type: 'line',
        title: 'Chart 1',
        yField: '',
        yFieldAggregation: ''
      }]
    } as ChartFormData)
    this.context.commit('setChartDataSource', {})
    this.context.commit('setQueryString', '')
    this.context.commit('setResult', {} as SelectResult)
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
      const dataSource: { [title: string]: Bucket[] } = {}
      this.formData.charts.forEach(c => {
        const buckets: Bucket[] = (res.data.facets[c.title] as Buckets).buckets.reverse()
        if (c.yFieldAggregation.toLowerCase() === 'count') {
          buckets.forEach(it => (it.yAxis = it.count))
        }
        dataSource[c.title] = buckets
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
