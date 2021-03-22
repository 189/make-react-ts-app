import qs from "qs";

// import { fetch as fetchPolyfill } from 'whatwg-fetch'

export const apiAddress =
  "http://" + window.location.host.replace(window.location.port, "8081");

function checkStatus(response: Response): Response {
  if (!response.ok) {
    const error = new Error(response.statusText);
    throw error;
  }
  return response;
}

function absoluteUri(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("https://");
}

interface Params<K> extends RequestInit {
  query?: K & object;
  body?: any;
  method?: string;
  headers?: {
    [key: string]: any;
  };
  responseType?: "json" | "text";
}

/* T 返回值类型 K 参数类型 */
async function webapi<T, K>(uri: string, params?: Params<K>): Promise<T> {
  let url = uri;
  if (!absoluteUri(uri)) {
    uri = uri.startsWith("/") ? uri : "/" + uri;
    url = apiAddress + uri;
  }
  let {
    query,
    body,
    headers,
    method = "GET",
    responseType = "json",
  } = params || {
    query: null,
    body: {},
    headers: {},
  };
  method = method.toLocaleUpperCase();

  if (query) {
    url += "?" + qs.stringify(query, { encode: false });
  }

  // 对Get请求进行节流 防止同参数Get请求并行发出，改成订阅上一次同参数同类型的Get请求
  if (method === "GET") {
    const init: RequestInit = { method: "GET", headers };
    const response = await fetch(url, init);
    checkStatus(response);
    if (responseType !== "json") {
      const data = response.text();
      return data as any;
    }
    return response.json();
  }

  const init: RequestInit = {
    credentials: "include",
    method: "POST",
    body,
  };
  const response = await fetch(url, init);
  checkStatus(response);
  if (responseType !== "json") {
    return response.text() as any;
  }
  return response.json();
}

export function webxhr<T = any>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        let response = xhr.response;
        resolve(response);
      }
    };
    xhr.onerror = reject;
    xhr.ontimeout = reject;
    xhr.open("GET", url, true);
    xhr.send();
  });
}

export function jsonp<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const callbackFn: string = "jsonpCallback_" + Date.now();
    window[callbackFn] = function (data: any) {
      resolve(data);
      delete window[callbackFn];
    };
    script.src = url + "?callback=" + callbackFn;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default webapi;
