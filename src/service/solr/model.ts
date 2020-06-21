export type WT = 'json' | 'xml' | 'python' | 'ruby' | 'php' | 'csv'

export interface Header {
  status: number;
  QTime: number;
}

export interface GenericResult {
  responseHeader: Header;
}
