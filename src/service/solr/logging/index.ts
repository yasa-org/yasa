import { Header } from '@service/solr/model';
import { AxiosResponse } from 'axios';
import http from '@/http';

export interface LogItem {
  time: string;
  level: string;
  logger: string;
  message: string;
  core: string;
}

export interface History {
  numFound: number;
  start: number;
  docs: LogItem[];
}

export interface LoggingResponse {
  responseHeader: Header;
  watcher: string;
  info: {
    levels: string[];
    last: number;
    buffer: number;
    threshold: string;
  };
  history: History;
}

class LoggingService {
  public logs(since = 0): Promise<AxiosResponse<LoggingResponse>> {
    return http.get('/solr/admin/info/logging', {
      params: {
        since,
      },
    });
  }
}

export default new LoggingService();
