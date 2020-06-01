import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { ZkTreeNode } from '@service/solr/admin/zookeeper'
import service from '@/service'

@Module({
  namespaced: true
})
export default class ConfigSets extends VuexModule {
  configSets: ZkTreeNode[] = []
  loadingConfigSets = false
  fileContent = ''

  @Mutation
  public setConfigSets (configSets: ZkTreeNode[]): void {
    this.configSets = configSets
  }

  @Mutation
  public setLoadingConfigSets (loadingConfigSets: boolean): void {
    this.loadingConfigSets = loadingConfigSets
  }

  @Mutation
  public setFileContent (fileContent: string): void {
    this.fileContent = fileContent
  }

  @Action
  public loadConfigSets (): void {
    const context = this.context
    context.commit('setLoadingConfigSets', true)
    service.solr.admin.zookeeper.zookeeper({
      path: '/configs'
    }).then(res => {
      context.commit('setLoadingConfigSets', false)
      context.commit('setConfigSets', res.data.tree)
    }, () => context.commit('setLoadingConfigSets', false))
  }
}
