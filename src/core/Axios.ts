import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejetedFn
} from '../types';
import dispatchRequest, { transformURL } from './dispatchRequest';
import InterceptorManager from './interceptorManager';
import mergeConfig from './mergeConfig';

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>;
  response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | typeof dispatchRequest;
  rejected?: RejetedFn;
}
export default class Axios {
  defaults: AxiosRequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    };
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      config = config || {};
      config.url = url;
    } else {
      config = url;
    }

    return this.func(config);
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
    return this.func({ ...config, url, method });
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    config: AxiosRequestConfig,
    data?: any
  ): AxiosPromise {
    return this.func({ ...config, url, method, data });
  }

  func(config: AxiosRequestConfig): AxiosPromise {
    config = mergeConfig(this.defaults, config);
    config.method = config.method!.toLowerCase() as Method;

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ];

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }
    return promise as AxiosPromise;
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config);
    return transformURL(config);
  }
}
