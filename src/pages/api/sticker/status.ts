import type { NextApiRequest, NextApiResponse } from 'next';

const DASHSCOPE_API_KEY = 'sk-81ff004d6a53409d93dfca28abbda689';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task_id } = req.query;

  if (!task_id || typeof task_id !== 'string') {
    return res.status(400).json({ error: '缺少 task_id' });
  }

  try {
    console.log(`=== [status] 查询任务: ${task_id} ===`);

    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${task_id}`, {
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
    });

    const data = await response.json();

    console.log('=== [status] DashScope 原始响应 ===');
    console.log(JSON.stringify(data, null, 2));

    const result: Record<string, unknown> = {
      task_id: data.output?.task_id,
      task_status: data.output?.task_status,
    };

    // 任务完成时返回生成的图片 URL
    if (data.output?.task_status === 'SUCCEEDED' && data.output?.results) {
      result.results = data.output.results;
    }

    // 任务失败时返回错误信息
    if (data.output?.task_status === 'FAILED') {
      result.error = data.output?.message || '生成失败';
    }

    console.log('=== [status] 返回前端 ===', JSON.stringify(result, null, 2));
    return res.status(200).json(result);
  } catch (error) {
    console.error('查询任务状态异常:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
