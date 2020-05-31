import http from '@/http'
import { Module, Action, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  namespaced: true
})
export default class DevTolls extends VuexModule {
  private content: string = localStorage.getItem('content') || ''
  private result = {}
  private loading = false

  @Mutation
  public setContent (content: string): void {
    localStorage.setItem('content', content)
    this.content = content
  }

  @Mutation
  public setResult (result: any): void {
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
    http.get(url, { params: data }).then(res => {
      context.commit('setResult', res.data)
      context.commit('setLoading', false)
    }, () => {
      context.commit('setLoading', false)
    })
  }
}
