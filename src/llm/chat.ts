/**
 * chat 聊天 智能助手  询问有关宠物的信息
 * 
 */

// 消息类型定义
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 聊天响应类型定义
export interface ChatResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: Array<{
    index?: number;
    message?: {
      role: string;
      content: string;
    };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: {
    message: string;
    type: string;
  };
}

export const chat = async (
  messages: Message[],
  api_url?: string,
  api_key?: string,
  model: string = 'GLM-4.7'
): Promise<ChatResponse | null> => {
  // 使用提供的参数或环境变量（客户端使用 NEXT_PUBLIC_ 前缀）
  const baseUrl = api_url || process.env.NEXT_PUBLIC_ANTHROPIC_BASE_URL;
  const authToken = api_key || process.env.NEXT_PUBLIC_ANTHROPIC_AUTH_TOKEN;

  console.log(baseUrl, authToken);

  // 验证必需参数
  if (!baseUrl || !authToken) {
    console.error('Missing API URL or API Key');
    return null;
  }

  try {
    console.log('Sending request to:', baseUrl);
    console.log('Request payload:', { model, messages });

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'QC-c46671c32fa594127dbb82de4fa7f380-d7b90c40f67f258936a5b05f226b54a5',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // 检查响应类型
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!response.ok) {
      // 尝试读取错误信息
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      // 尝试解析为 JSON
      try {
        const errorData = JSON.parse(errorText);
        return { error: errorData };
      } catch {
        return { 
          error: { 
            message: errorText || `HTTP ${response.status}: ${response.statusText}`,
            type: 'api_error'
          } 
        };
      }
    }

    // 检查响应是否是 JSON
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response:', responseText);
      return { 
        error: { 
          message: 'API returned non-JSON response',
          type: 'invalid_response'
        } 
      };
    }

    const data: ChatResponse = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'network_error'
      } 
    };
  }
}