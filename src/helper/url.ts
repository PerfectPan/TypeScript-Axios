import { isDate, isPlainObject, encode, isURLSearchParams } from './util';

interface URLOrigin {
  protocol: string;
  host: string;
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url;
  }

  let serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    let param: string[] = [];

    Object.keys(params).forEach(key => {
      const val = params[key];

      if (val === null || typeof val === 'undefined') {
        return;
      }

      // unite as array-like for future process
      let values: any[] = [];
      if (Array.isArray(val)) {
        values = val;
        key += '[]';
      } else {
        values = [val];
      }

      const valueConvert: string[] = values.map(val => {
        if (isPlainObject(val)) {
          return `${encode(key)}=${encode(JSON.stringify(val))}`;
        } else if (isDate(val)) {
          return `${encode(key)}=${encode(val.toISOString())}`;
        }
        return `${encode(key)}=${encode(val)}`;
      });

      param = [...param, ...valueConvert!];
    });

    serializedParams = param.join('&');
  }

  if (serializedParams) {
    const markIndex: number = url.indexOf('#');

    if (~markIndex) {
      url = url.slice(0, markIndex);
    }

    url += (~url.indexOf('?') ? '&' : '?') + serializedParams;
  }

  return url;
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d+\-\.]*:)?\/\//i.test(url);
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL);
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  );
}

const urlParingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

function resolveURL(url: string): URLOrigin {
  urlParingNode.setAttribute('href', url);
  const { protocol, host } = urlParingNode;

  return {
    protocol,
    host
  };
}
