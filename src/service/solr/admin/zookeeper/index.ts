import http from '@/http'
import { AxiosResponse } from 'axios'

export class Prop {
  version = 0;
  aversion = 0;
  children_count = 0;
  ctime = '';
  cversion = 0;
  czxid = 0;
  ephemeralOwner = 0;
  mtime = '';
  mzxid = 0;
  pzxid = 0;
  dataLength = 0;
}

export class TreeNode {
  data: {
    title: string;
    attr: object;
  } = {
    title: '',
    attr: {}
  };

  ephemeral = true;
  version = 0;
}

export class ZNode {
  path = '';
  prop: Prop = new Prop();
  tree: TreeNode[] = [];
  data = '';
}

export interface ZookeeperResponse {
  znode: ZNode;
  tree: TreeNode[];
}

class ZookeeperService {
  public zookeeper (params: object = {}): Promise<AxiosResponse<ZookeeperResponse>> {
    return http.get('/solr/admin/zookeeper', { params })
  }
}

export default new ZookeeperService()
