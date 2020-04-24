import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { buildURL } from '../helper/url';
import { transformRequest, transformResponse } from '../helper/data';
import { processHeaders, flattenHeaders } from '../helper/headers';
import xhr from './xhr';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  });
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url!, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config;
  return transformRequest(data);
}

function transformHeaders(config: AxiosRequestConfig): void {
  const { headers = {}, data, method } = config;
  return processHeaders(headers, data);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}
