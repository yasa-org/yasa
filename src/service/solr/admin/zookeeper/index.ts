import http from '@/http'
import { AxiosResponse } from 'axios'

export interface Prop {
  version: number;
  aversion: number;
  children_count: number;
  ctime: string;
  cversion: number;
  czxid: number;
  ephemeralOwner: number;
  mtime: string;
  mzxid: number;
  pzxid: number;
  dataLength: number;
}

export interface ZkTreeNode {
  data: {
    title: string;
    attr: {
      href: string;
    };
  };

  ephemeral: boolean;
  version: number;
}

export interface ZNode {
  path: string;
  prop: Prop;
  tree: ZkTreeNode[];
  data: string;
}

export interface ZookeeperResponse {
  znode: ZNode;
  tree: ZkTreeNode[];
}

class ZookeeperService {
  public zookeeper (params: object = {}): Promise<AxiosResponse<ZookeeperResponse>> {
    return http.get('/solr/admin/zookeeper', { params })
  }
}

export default new ZookeeperService()
