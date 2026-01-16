/**
 * 流式聊天 API
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatStream = async (
  messages: Message[],
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  api_url?: string,
  api_key?: string,
  model: string = 'GLM-4.7'
) => {
  const baseUrl = api_url || process.env.NEXT_PUBLIC_ANTHROPIC_BASE_URL;
  const authToken = api_key || process.env.NEXT_PUBLIC_ANTHROPIC_AUTH_TOKEN;

  if (!baseUrl || !authToken) {
    onError(new Error('Missing API URL or API Key'));
    return;
  }

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true, // 启用流式输出
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // 保留最后一行(可能不完整)
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine || trimmedLine === 'data: [DONE]') {
          continue;
        }

        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonStr = trimmedLine.slice(6);
            const data = JSON.parse(jsonStr);
            
            // 处理不同API格式
            const content = 
              data?.choices?.[0]?.delta?.content || 
              data?.delta?.content ||
              data?.content ||
              '';
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e, trimmedLine);
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
};
