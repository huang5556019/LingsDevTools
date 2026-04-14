import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpRequestOptions {
  url: string;
  method: string;
  headers: Array<{ key: string; value: string }>;
  body: string;
  bodyType: 'json' | 'form' | 'text';
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
}

export async function sendHttpRequest(options: HttpRequestOptions): Promise<HttpResponse> {
  const startTime = Date.now();
  
  try {
    const config: AxiosRequestConfig = {
      url: options.url,
      method: options.method,
      headers: options.headers.reduce((acc, header) => {
        if (header.key) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as Record<string, string>),
    };

    // 根据 bodyType 处理请求体
    if (options.body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      if (options.bodyType === 'json') {
        config.data = JSON.parse(options.body);
        if (!config.headers) {
          config.headers = {};
        }
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
        }
      } else if (options.bodyType === 'form') {
        // 解析表单数据
        const formData = new URLSearchParams();
        options.body.split('&').forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key) {
            formData.append(key, value || '');
          }
        });
        config.data = formData;
        if (!config.headers) {
          config.headers = {};
        }
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      } else {
        // text 类型
        config.data = options.body;
      }
    }

    const response: AxiosResponse = await axios(config);
    const endTime = Date.now();

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      data: response.data,
      time: endTime - startTime,
    };
  } catch (error: any) {
    const endTime = Date.now();
    
    if (error.response) {
      // 服务器返回错误状态码
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>,
        data: error.response.data,
        time: endTime - startTime,
      };
    } else if (error.request) {
      // 请求已发送但没有收到响应
      throw new Error('网络连接失败，服务器无响应');
    } else {
      // 请求配置出错
      throw new Error(error.message);
    }
  }
}
