import { Header } from '@service/solr/model'
import { AxiosResponse } from 'axios'
import http from '@/http'

export interface Index {
  numDocs: number;
  maxDoc: number;
  deletedDocs: number;
  indexHeapUsageBytes: number;
  version: number;
  segmentCount: number;
  current: boolean;
  hasDeletions: boolean;
  directory: string;
  segmentsFile: string;
  segmentsFileSizeInBytes: number;
  lastModified: string;
  sizeInBytes: number;
  size: string;
}

export interface CoreStatus {
  name: string;
  instanceDir: string;
  dataDir: string;
  config: string;
  schema: string;
  startTime: string;
  uptime: number;
  index: Index;
}

export interface CoreResult {
  responseHeader: Header;
  status: {
    [name: string]: CoreStatus;
  };
}

export class CoreService {
  public cores (params: object = {}): Promise<AxiosResponse<CoreResult>> {
    return http.get('/solr/admin/cores', { params })
  }
}

export default new CoreService()
