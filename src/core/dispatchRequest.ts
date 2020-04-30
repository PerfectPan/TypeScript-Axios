import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { buildURL, isAbsoluteURL, combineURL } from '../helper/url';
import { flattenHeaders } from '../helper/headers';
import xhr from './xhr';
import transform from './transform';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  // 发送请求前检测cancelToken是否已经取消
  throwIfCancellationRequested(config);
  return xhr(config).then(
    res => {
      return transformResponseData(res);
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response);
      }
      return Promise.reject(e);
    }
  );
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.data = transform(config.data, config.headers || {}, config.transformRequest);
  config.headers = flattenHeaders(config.headers, config.method!);
}

export function transformURL(config: AxiosRequestConfig): string {
  const { url, params, paramsSerializer, baseURL } = config;
  return buildURL(
    baseURL && !isAbsoluteURL(url!) ? combineURL(baseURL, url) : url!,
    params,
    paramsSerializer
  );
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
