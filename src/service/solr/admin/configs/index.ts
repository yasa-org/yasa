import http from '@/http'
import { AxiosResponse } from 'axios'
import { Header } from '@service/solr/model'

export class ConfigSetsResponse {
  responseHeader = new Header();
  configSets: string[] = [];
}

class ConfigsService {
  public configs (wt = 'json', params: object = {}): Promise<AxiosResponse<ConfigSetsResponse>> {
    return http.get(`/solr/admin/configs?wt=${wt}&action=LIST`, { params })
  }
}

export default new ConfigsService()
