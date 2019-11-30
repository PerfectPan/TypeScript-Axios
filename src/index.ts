import { AxiosRequestConfig } from './types';
import { buildURL } from './helper/url';
import { transformRequest } from './helper/data';
import xhr from './xhr';

function axios(config: AxiosRequestConfig): void {
  processConfig(config);
  xhr(config);
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
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

export default axios;
