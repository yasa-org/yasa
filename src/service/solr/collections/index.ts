import http from '@/http'
import { AxiosResponse } from 'axios'
import { GenericResult, Header, WT } from '@service/solr/model'

export interface CollectionForm {
  name: string;
  'router.name': string;
  numShards: number;
  replicationFactor: number;
  maxShardsPerNode: number;
  createNodeSet: string;
  'collection.configName': string;
}

export interface Doc {
  [key: string]: object;
}

export interface Response {
  numFound: number;
  start: number;
  docs: Doc[];
}

export interface Bucket {
  val: string;
  count: number;
  yAxis: number;
}

export interface Buckets {
  buckets: Array<Bucket>;
}

export interface Facets {
  [key: string]: number | Buckets;
}

export interface SelectResult {
  nextCursorMark: string;
  numFound: number;
  response: Response;
  facets: Facets;
}

export interface CollectionsResult {
  header: Header;
  collections: string[];
}

export interface CoreNode {
  core: string;
  base_url: string;
  node_name: string;
  state: string;
  type: string;
  force_set_state: string;
}

export interface Replicas {
  [name: string]: CoreNode;
}

export interface Shards {
  name: string;
  range: string;
  state: string;
  replicas: Replicas;
}

export interface CollectionDetail {
  pullReplicas: number;
  replicationFactor: number;
  shards: {
    [name: string]: Shards;
  };

  router: {
    name: 'compositeId' | 'implicit';
  };

  maxShardsPerNode: number;
  autoAddReplicas: boolean;
  nrtReplicas: number;
  tlogReplicas: number;
  znodeVersion: number;
  configName: string;
}

export interface ClusterResult {
  responseHeader: Header;
  cluster: {
    collections: {
      [name: string]: CollectionDetail;
    };
    live_nodes: string[];
  };
}

class CollectionsService {
  public fields (collection: string, wt: WT = 'csv'): Promise<AxiosResponse<string>> {
    return http.get(`/solr/${collection}/schema/fields?wt=${wt}`)
  }

  public select (collection: string, params: object): Promise<AxiosResponse<SelectResult>> {
    return http.get(`/solr/${collection}/select`, { params })
  }

  public query (collection: string, params: object): Promise<AxiosResponse<SelectResult>> {
    return http.get(`/solr/${collection}/query`, { params })
  }

  public collections (params: object = {}): Promise<AxiosResponse<CollectionsResult>> {
    return http.get('/solr/admin/collections?action=LIST', { params })
  }

  public clusters (params: object = {}): Promise<AxiosResponse<ClusterResult>> {
    return http.get('/solr/admin/collections?action=CLUSTERSTATUS', { params })
  }

  public create (params: CollectionForm): Promise<AxiosResponse<GenericResult>> {
    return http.get('/solr/admin/collections?action=CREATE', { params })
  }

  public reload (collection: string): Promise<AxiosResponse<void>> {
    return http.get('/solr/admin/collections?action=RELOAD', {
      params: {
        name: collection
      }
    })
  }
}

export default new CollectionsService()
