import { read } from './utils';

export default class BaseService {
  constructor(axios, name, pathname, params = {}) {
    this.axios = axios;
    this.name = name;
    this.pathname = pathname;
    this.params = params;
  }

  read(req, resource, params, config) {
    return read(this.axios, this.name, this.pathname, { ...this.params, ...params });
  }
}