import { getAuthHeaders } from './auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string;
}
export async function fetchFromAPI<T = any>(
  url: string, 
  params: Record<string, any> = {}, 
  getToken?: () => Promise<string | null>, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  timeout: number = 30000
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders(getToken)
    // 构建请求选项
    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: 'include', // 包含 cookies，Clerk 可能会使用
    };
    // 处理请求参数
    if (params && Object.keys(params).length > 0) {
      if (method === 'GET') {
        // GET 请求将参数添加到 URL
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url = `${url}?${searchParams.toString()}`;
      } else {
        // 非 GET 请求添加 body
        requestOptions.body = JSON.stringify(params);
      }
    }

    // 添加超时支持
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      requestOptions.signal = controller.signal;
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        // 处理不同类型的错误状态码
        const errorData = await response.json().catch(() => ({}));
        
        let errorMessage: string;
        switch (response.status) {
          case 400:
            errorMessage = '请求参数错误';
            break;
          case 401:
            errorMessage = '未授权：请先登录';
            break;
          case 403:
            errorMessage = '没有权限执行此操作';
            break;
          case 404:
            errorMessage = '请求的资源不存在';
            break;
          case 429:
            errorMessage = '请求过于频繁，请稍后再试';
            break;
          case 500:
            errorMessage = '服务器内部错误';
            break;
          default:
            errorMessage = errorData.error || errorData.message || `请求失败: ${response.status}`;
        }
        
        return { success: false, data: null, error: errorMessage };
      }

      // 处理空响应
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { success: true, data: data as T, error: '' };
      } else {
        return { success: true, data: null, error: '' };
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return { success: false, data: null, error: '请求超时，请检查网络连接' };
      }
      throw fetchError; // 重新抛出其他错误
    }
  } catch (error: any) {
    return { 
      success: false, 
      data: null, 
      error: error.message || '网络错误，请稍后重试' 
    };
  }
}

