import { isDate, isObject, encode } from './util';

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url;
  }

  let param: string[] = [];

  Object.keys(params).forEach(key => {
    const val = params[key];

    if (val === null || typeof val === 'undefined') {
      return;
    }

    // unite as array-like for future process
    let values = [];
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }

    const valueConvert = values
      .map(val => {
        if (isObject(val)) {
          return `${encode(key)}=${encode(JSON.stringify(val))}`;
        } else if (isDate(val)) {
          return `${encode(key)}=${encode(val.toISOString())}`;
        }
        return `${encode(key)}=${encode(val)}`;
      })
      .filter(item => typeof item === 'string');

    param = [...param, ...valueConvert!];
  });

  let serializeParams = param.join('&');

  if (serializeParams) {
    const markIndex = url.indexOf('#');

    if (~markIndex) {
      url = url.slice(0, markIndex);
    }

    url += (~url.indexOf('?') ? '?' : '&') + serializeParams;
  }

  return url;
}
