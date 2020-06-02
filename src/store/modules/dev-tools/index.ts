import http from '@/http'
import { Module, Action, Mutation, VuexModule } from 'vuex-module-decorators'
import { GenericResult } from '@service/solr/model'
import { AxiosResponse } from 'axios'

@Module({
  namespaced: true
})
export default class DevTools extends VuexModule {
  private content: string = localStorage.getItem('content') || ''
  private result: GenericResult = {} as GenericResult
  private loading = false

  @Mutation
  public setContent (content: string): void {
    this.content = content
    localStorage.setItem('content', content)
  }

  @Mutation
  public setResult (result: GenericResult): void {
    this.result = result
  }

  @Mutation
  public setLoading (loading: boolean): void {
    this.loading = loading
  }

  @Action
  public doGet ({ url, data }: { url: string; data: object }) {
    const context = this.context
    context.commit('setLoading', true)
    http.get(url, { params: data }).then((res: AxiosResponse<GenericResult>) => {
      context.commit('setResult', res.data)
      context.commit('setLoading', false)
    }, () => {
      context.commit('setLoading', false)
    })
  }
}
