import type { NextApiRequest, NextApiResponse } from 'next';

const DASHSCOPE_API_KEY = 'sk-81ff004d6a53409d93dfca28abbda689';
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, imageBase64 } = req.body;

  console.log('=== [generate] 收到请求 ===');
  console.log('text:', text);
  console.log('imageBase64:', imageBase64 ? `(图片 base64, 长度: ${imageBase64.length})` : '无');

  if (!text) {
    return res.status(400).json({ error: '缺少模板文本' });
  }

  // 构建消息内容
  const content: Array<Record<string, string>> = [];

  if (imageBase64) {
    content.push({ image: imageBase64 });
  }

  content.push({ text });

  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-image-2.0-pro',
        input: {
          messages: [
            {
              role: 'user',
              content,
            },
          ],
        },
        parameters: {
          n: 1,
          negative_prompt: ' ',
          prompt_extend: true,
          watermark: false,
          size: '1024*1024',
        },
      }),
    });

    const data = await response.json();

    console.log('=== [generate] DashScope 响应体 ===');
    console.log(JSON.stringify(data, null, 2));

    // 同步模式：从 output.choices[0].message.content[0].image 取图片
    const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;
    if (imageUrl) {
      const result = {
        status: 'SUCCEEDED',
        imageUrl,
      };
      console.log('=== [generate] 同步结果，返回前端 ===', result);
      return res.status(200).json(result);
    }

    // 异步模式（兜底）：返回 task_id
    if (data.output?.task_id) {
      const result = {
        status: 'ASYNC',
        task_id: data.output.task_id,
        task_status: data.output.task_status,
      };
      console.log('=== [generate] 异步任务，返回前端 ===', result);
      return res.status(200).json(result);
    }

    console.error('=== [generate] DashScope 生成失败 ===', data);
    return res.status(500).json({ error: '生成任务创建失败', details: data });
  } catch (error) {
    console.error('DashScope 请求异常:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
