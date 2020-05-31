import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import service from '@/service'
import { CollectionForm } from '@/service/solr/collections'

const params = {
  params: {
    wt: 'json'
  }
}

@Module({
  namespaced: true
})
export default class ManagementCollections extends VuexModule {
  detailedCollections: any[] = []
  loadingDetailedCollections = false
  loadingConfigSets = false
  configSets: string[] = []
  newCollectionFormData: CollectionForm = {
    name: '',
    'router.name': 'compositeId',
    numShards: 0,
    replicationFactor: 1,
    maxShardsPerNode: 1,
    createNodeSet: '',
    'collection.configName': ''
  }

  @Mutation
  public setLoadingConfigSets (loadingConfigSets: boolean): void {
    this.loadingConfigSets = loadingConfigSets
  }

  @Mutation
  public setConfigSets (configSets: any[]): void {
    this.configSets = configSets
  }

  @Mutation
  public setDetailedCollections (detailedCollections: any[]): void {
    this.detailedCollections = detailedCollections
  }

  @Mutation
  public setLoadingDetailedCollections (loadingDetailedCollections: boolean): void {
    this.loadingDetailedCollections = loadingDetailedCollections
  }

  @Action
  public loadDetailedCollections (): void {
    const context = this.context
    if (context.rootState.solrMode === 'solrcloud') {
      context.commit('setLoadingDetailedCollections', true)
      service.solr.collections.clusters(params).then((res) => {
        const detailedCollectionsKeyedByName = res.data.cluster.collections
        const detailedCollections = Object.keys(detailedCollectionsKeyedByName).map(name => {
          const detailedCollection = detailedCollectionsKeyedByName[name]
          detailedCollection.name = name
          return detailedCollection
        })
        context.commit('setDetailedCollections', detailedCollections)
        context.commit('setLoadingDetailedCollections', false)
      }, () => context.commit('setLoadingDetailedCollections', false))
    }
  }

  @Action
  public loadConfigSets (): void {
    const context = this.context
    if (this.loadingConfigSets) {
      return
    }
    context.commit('setLoadingConfigSets', true)
    service.solr.admin.configs.configs().then(res => {
      context.commit('setLoadingConfigSets', false)
      context.commit('setConfigSets', res.data.configSets)
    }, () => context.commit('setLoadingConfigSets', false))
  }
}
