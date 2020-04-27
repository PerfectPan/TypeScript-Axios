import { isDate, isPlainObject, encode } from './util';

interface URLOrigin {
  protocol: string;
  host: string;
}

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

  const serializeParams: string = param.join('&');

  if (serializeParams) {
    const markIndex: number = url.indexOf('#');

    if (~markIndex) {
      url = url.slice(0, markIndex);
    }

    url += (~url.indexOf('?') ? '&' : '?') + serializeParams;
  }

  return url;
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
