import http from '@/http'
import { AxiosResponse } from 'axios'

export type CollectionForm = {
  name: string;
  'router.name': string;
  numShards: number;
  replicationFactor: number;
  maxShardsPerNode: number;
  createNodeSet: string;
  'collection.configName': string;
}

class CollectionsService {
  public fields (collection: string, wt = 'csv'): Promise<AxiosResponse<any>> {
    return http.get(`/solr/${collection}/schema/fields?wt=${wt}`)
  }

  public docs (collection: string, params: object): Promise<AxiosResponse<any>> {
    return http.get(`/solr/${collection}/select`, { params })
  }

  public query (collection: string, params: object): Promise<AxiosResponse<any>> {
    return http.get(`/solr/${collection}/query`, { params })
  }

  public collections (params: object = {}): Promise<AxiosResponse<any>> {
    return http.get('/solr/admin/collections?action=LIST', { params })
  }

  public cores (params: object = {}): Promise<AxiosResponse<any>> {
    return http.get('/solr/admin/cores', { params })
  }

  public clusters (params: object = {}): Promise<AxiosResponse<any>> {
    return http.get('/solr/admin/collections?action=CLUSTERSTATUS', { params })
  }

  public create (params: CollectionForm): Promise<AxiosResponse<any>> {
    return http.get('/solr/admin/collections?action=CREATE', { params })
  }
}

export default new CollectionsService()
