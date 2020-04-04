import { AxiosRequestConfig, AxiosPromise } from './types';
import { buildURL } from './helper/url';
import { transformRequest } from './helper/data';
import { processHeaders } from './helper/headers';
import xhr from './xhr';

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config);
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config;
  return transformRequest(data);
}

function transformHeaders(config: AxiosRequestConfig): void {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

export default axios;
