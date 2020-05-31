import http from '@/http'
import { AxiosResponse } from 'axios'
import { Header } from '@/service/solr/model'

export type CollectionForm = {
  name: string;
  'router.name': string;
  numShards: number;
  replicationFactor: number;
  maxShardsPerNode: number;
  createNodeSet: string;
  'collection.configName': string;
}

export class Doc {

}

export class Response {
  numFound = 0;
  start = 0;
  docs: Doc[] = [];
}

export class Bucket {
  val = '';
  count = 0;
  yAxis = 0;
}

export class Buckets {
  buckets: Array<Bucket> = []
}

export class Facets {
  [key: string]: number | Buckets;
}

export class SelectResult {
  nextCursorMark = '';
  numFound = 0;
  response: Response = new Response();
  facets: Facets = new Facets();
}

export class CollectionsResult {
  header: Header = new Header();
  collections: string[] = [];
}

export class CoreNode {
  core = '';
  base_url = '';
  node_name = '';
  state = '';
  type = '';
  force_set_state = '';
}

export class Replicas {
  [name: string]: CoreNode
}

export class Shards {
  range = '';
  state = '';
  replicas: Replicas = {};
}

export class CollectionDetail {
  pullReplicas = 0;
  replicationFactor = 2;
  shards: {
    [name: string]: Shards;
  } = {};

  router: {
    name: string;
  } = {
    name: 'compositeId'
  };

  maxShardsPerNode = -1;
  autoAddReplicas = false;
  nrtReplicas = 0;
  tlogReplicas = 0;
  znodeVersion = 0;
  configName = '';
}

/* eslint-disable @typescript-eslint/camelcase */
export class ClusterResult {
  responseHeader = new Header();
  cluster: {
    collections: {
      [name: string]: CollectionDetail;
    };
    live_nodes: string[];
  } = {
    collections: {},
    live_nodes: []
  }
}

class CollectionsService {
  public fields (collection: string, wt = 'csv'): Promise<AxiosResponse<string>> {
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

  public cores (params: object = {}): Promise<AxiosResponse<any>> {
    return http.get('/solr/admin/cores', { params })
  }

  public clusters (params: object = {}): Promise<AxiosResponse<ClusterResult>> {
    return http.get('/solr/admin/collections?action=CLUSTERSTATUS', { params })
  }

  public create (params: CollectionForm): Promise<AxiosResponse<any>> {
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
