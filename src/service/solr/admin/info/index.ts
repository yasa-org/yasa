import http from '@/http'
import { AxiosResponse } from 'axios'
import { Header } from '@service/solr/model'

export class JVM {
  version = '';
  name = '';
  spec: {
    vendor: string;
    name: string;
    version: string;
  } = {
    vendor: '',
    name: '',
    version: ''
  };

  jre: {
    vendor: string;
    version: string;
  } = {
    vendor: '',
    version: ''
  };

  vm: {
    vendor: string;
    name: string;
    version: string;
  } = {
    vendor: '',
    name: '',
    version: ''
  };

  processors = 0;

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
  } = {
    free: '',
    total: '',
    max: '',
    used: '',
    raw: {
      free: 0,
      total: 0,
      max: 0,
      used: 0,
      'used%': 0
    }
  };

  jmx: {
    classpath: string;
    commandLineArgs: string[];
    startTime: string;
    upTimeMS: number;
  } = {
    classpath: '',
    commandLineArgs: [],
    startTime: '',
    upTimeMS: 0
  };
}

export class System {
  name = '';
  arch = '';
  availableProcessors = 0;
  systemLoadAverage = 0;
  version = '';
  committedVirtualMemorySize = 0;
  freePhysicalMemorySize = 0;
  freeSwapSpaceSize = 0;
  processCpuLoad = 0;
  processCpuTime = 0;
  systemCpuLoad = 0;
  totalPhysicalMemorySize = 0;
  totalSwapSpaceSize = 0;
  maxFileDescriptorCount = 0;
  openFileDescriptorCount = 0;
  uname = '';
  uptime = '';
}

export class SystemResponse {
  responseHeader = new Header();
  mode = '';
  zkHost = '';
  lucene: {
    'solr-spec-version': string;
    'solr-impl-version': string;
    'lucene-spec-version': string;
    'lucene-impl-version': string;
  } = {
    'solr-spec-version': '',
    'solr-impl-version': '',
    'lucene-spec-version': '',
    'lucene-impl-version': ''
  };

  jvm = new JVM();
  system = new System();
  node = '';
}

class InfoService {
  public system (format = 'json'): Promise<AxiosResponse<SystemResponse>> {
    return http.get(`/solr/admin/info/system?wt=${format}`)
  }
}

export default new InfoService()
