import service from '@/service'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { TreeNode } from '@/service/solr/admin/zookeeper'

@Module({
  namespaced: true
})
export default class Tree extends VuexModule {
  private configSets: TreeNode[] = []
  private loadingConfigSets = false
  private fileContent = ''

  @Mutation public setConfigSets (configSets: TreeNode[]): void {
    this.configSets = configSets
  }

  @Mutation public setLoadingConfigSets (loadingConfigSets: boolean): void {
    this.loadingConfigSets = loadingConfigSets
  }

  @Mutation public setFileContent (fileContent: string): void {
    this.fileContent = fileContent
  }

  @Action
  public loadConfigSets (): void {
    const context = this.context
    context.commit('setLoadingConfigSets', true)
    service.solr.admin.zookeeper.zookeeper({
      path: '/'
    }).then(res => {
      context.commit('setLoadingConfigSets', false)
      const r = res.data.tree
      context.commit('setConfigSets', r)
    }, () => context.commit('setLoadingConfigSets', false))
  }
}
