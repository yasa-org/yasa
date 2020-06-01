import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Doc, Facets, SelectResult } from '@service/solr/collections'
import { Field } from '@/model'
import service from '@/service'

@Module({
  namespaced: true
})
export default class Discover extends VuexModule {
  private collection = localStorage.getItem('collection') || ''
  private fields: Field[] = []
  private loadingFields = false
  private loadingFieldsStats = false
  private fieldsStats: Facets = {}
  private availableFields: Field[] = []
  private selectedFields: Field[] = []
  private queryString = '*:*'
  private loadingMore = false
  private docs: Doc[] = []
  private numHit = 0
  private result: SelectResult = new SelectResult();

  @Mutation
  public setCollection (collection: string): void {
    this.collection = collection
    localStorage.setItem('collection', collection)
  }

  @Mutation
  public setFields (fields: Field[]) {
    this.fields = fields
  }

  @Mutation
  public setLoadingFields (loadingFields: boolean) {
    this.loadingFields = loadingFields
  }

  @Mutation
  public setLoadingFieldsStats (loadingFieldsStats: boolean) {
    this.loadingFieldsStats = loadingFieldsStats
  }

  @Mutation
  public setFieldsStats (fieldsStats: Facets) {
    this.fieldsStats = fieldsStats
  }

  @Mutation
  public setAvailableFields (availableFields: Field[]) {
    this.availableFields = availableFields
  }

  @Mutation
  public setSelectedFields (selectedFields: Field[]) {
    this.selectedFields = selectedFields
  }

  @Mutation
  public setQueryString (queryString: string): void {
    this.queryString = queryString
  }

  @Mutation
  public setLoadingMore (loadingMore: boolean) {
    this.loadingMore = loadingMore
  }

  @Mutation
  public setDocs (docs: Doc[]) {
    this.docs = docs
  }

  @Mutation
  public addDocs (docs: Doc[]) {
    this.docs.push(...docs)
  }

  @Mutation
  public setResult (result: SelectResult) {
    this.result = result
    this.numHit = this.result.response.numFound || 0
  }

  @Mutation
  public addSelectedField (field: Field) {
    this.selectedFields.push(field)
    this.availableFields.splice(this.availableFields.indexOf(field), 1)
    this.availableFields.sort((a, b) => a.name.localeCompare(b.name))
  }

  @Mutation
  public removeSelectedField (field: Field): void {
    this.availableFields.push(field)
    this.selectedFields.splice(this.selectedFields.indexOf(field), 1)
    this.availableFields.sort((a, b) => a.name.localeCompare(b.name))
  }

  @Action({ rawError: true })
  public loadMore () {
    this.context.commit('setLoadingMore', true)
    service.solr.collections.select(this.collection, {
      q: this.queryString,
      sort: 'id desc',
      rows: 50,
      cursorMark: this.result.nextCursorMark || '*'
    }).then(res => {
      this.context.commit('setResult', res.data)
      this.context.commit('addDocs', res.data.response.docs)
      this.context.commit('setLoadingMore', false)
    }, () => this.context.commit('setLoadingMore', false))
  }

  @Action({ rawError: true })
  public loadFields () {
    if (!this.collection || this.loadingFields) return
    this.context.commit('setLoadingFields', true)
    service.solr.collections.fields(this.collection).then(res => {
      this.context.commit(
        'setFields',
        res.data.split(',')
          .map((f: string) => ({ name: f.trim() }))
          .sort((a: Field, b: Field) => a.name.localeCompare(b.name))
      )
      this.context.commit('setLoadingFields', false)
    }, () => this.context.commit('setLoadingFields', false))
  }

  @Action({ rawError: true })
  public loadFieldsStats () {
    if (this.fields.length === 0 || this.loadingFieldsStats) return
    const jsonFacets: {
      [name: string]: {
        type: string;
        field: string;
        limit: number;
      };
    } = {}
    this.fields.forEach(field => {
      jsonFacets[field.name] = {
        type: 'terms',
        field: field.name,
        limit: 5
      }
    })
    this.context.commit('setFieldsStats', [])
    this.context.commit('setLoadingFieldsStats', true)
    service.solr.collections.select(this.collection, {
      q: this.queryString,
      rows: 0,
      wt: 'json',
      'json.facet': JSON.stringify(jsonFacets)
    }).then(res => {
      this.context.commit('setLoadingFieldsStats', false)
      this.context.commit('setFieldsStats', res.data.facets)
    }, () => this.context.commit('setLoadingFieldsStats', false))
  }
}
