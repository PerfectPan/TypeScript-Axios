export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

export interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  data?: any;
  headers?: any;
  params?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  cancelToken?: CancleToken;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onDownloadProgress?: (e: ProgressEvent) => void;
  onUploadProgress?: (e: ProgressEvent) => void;
  auth?: AxiosBasicCredentials;
  validateStatus?: (status: number) => boolean;
  paramsSerializer?: (params: any) => string;

  [propName: string]: any;
}

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: any;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  isAxiosError: boolean;
  config: AxiosRequestConfig;
  code?: string | null;
  request?: any;
  response?: AxiosResponse;
}

export interface Axios {
  defaults: AxiosRequestConfig;

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>;
}

export interface RejetedFn {
  (error: any): any;
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejetedFn): number;

  eject(id: number): void;
}

export interface AxiosTransformer {
  (data: any, header?: any): any;
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance;

  CancelToken: CancelTokenStatic;
  Cancel: CancelStatic;
  /**
   * 判断传来的错误是不是Cancel类，从而判断是不是请求发送取消
   */
  isCancel: (value: any) => boolean;
}

export interface CancleToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  throwIfRequested(): void;
}

export interface Canceler {
  (message?: string): void;
}

export interface CancelExecutor {
  (cancel: Canceler): void;
}

export interface CancelTokenSource {
  token: CancleToken;
  /**
   * 取消发送请求
   */
  cancel: Canceler;
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancleToken;

  source(): CancelTokenSource;
}

export interface Cancel {
  message?: string;
}

export interface CancelStatic {
  new (message?: string): Cancel;
}

export interface AxiosBasicCredentials {
  username: string;
  password: string;
}
