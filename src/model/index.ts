export interface Field {
  name: string;
}

export class FieldStats {

}

export class Doc {

}

export class Response {
  numFound = 0;
  start = 0;
  docs: Doc[] = [];
}

export class Result {
  nextCursorMark = '';
  numFound = 0;
  response: Response = {
    numFound: 0,
    start: 0,
    docs: []
  };
}

export interface JsonFacet {
  type: string;
  field: string;
  limit: number;
}
