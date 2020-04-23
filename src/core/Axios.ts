import { AxiosRequestConfig, AxiosPromise, Method } from '../types';
import dispatchRequest from './dispatchRequest';

export default class Axios {
  request(config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(config);
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config || {});
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config || {});
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config || {});
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config || {});
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, config || {}, data);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, config || {}, data);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, config || {}, data);
  }

  _requestMethodWithoutData(method: Method, url: string, config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest({ ...config, url, method });
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    config: AxiosRequestConfig,
    data?: any
  ): AxiosPromise {
    return dispatchRequest({ ...config, url, method, data });
  }
}