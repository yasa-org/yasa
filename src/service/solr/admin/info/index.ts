import http from '@/http'
import { AxiosResponse } from 'axios'
import { Header } from '@service/solr/model'

export interface JVM {
  version: string;
  name: string;
  spec: {
    vendor: string;
    name: string;
    version: string;
  };

  jre: {
    vendor: string;
    version: string;
  };

  vm: {
    vendor: string;
    name: string;
    version: string;
  };

  processors: number;

  memory: {
    free: string;
    total: string;
    max: string;
    used: string;
    raw: {
      free: number;
      total: number;
      max: number;
      used: number;
      'used%': number;
    };
  };

  jmx: {
    classpath: string;
    commandLineArgs: string[];
    startTime: string;
    upTimeMS: number;
  };
}

export interface System {
  name: string;
  arch: string;
  availableProcessors: number;
  systemLoadAverage: number;
  version: string;
  committedVirtualMemorySize: number;
  freePhysicalMemorySize: number;
  freeSwapSpaceSize: number;
  processCpuLoad: number;
  processCpuTime: number;
  systemCpuLoad: number;
  totalPhysicalMemorySize: number;
  totalSwapSpaceSize: number;
  maxFileDescriptorCount: number;
  openFileDescriptorCount: number;
  uname: string;
  uptime: string;
}

export interface SystemResponse {
  responseHeader: Header;
  mode: string;
  zkHost: string;
  lucene: {
    'solr-spec-version': string;
    'solr-impl-version': string;
    'lucene-spec-version': string;
    'lucene-impl-version': string;
  };

  jvm: JVM;
  system: System;
  node: string;
}

class InfoService {
  public system (format = 'json'): Promise<AxiosResponse<SystemResponse>> {
    return http.get(`/solr/admin/info/system?wt=${format}`)
  }
}

export default new InfoService()
