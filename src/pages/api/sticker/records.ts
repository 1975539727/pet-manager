import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取用户的贴纸记录
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== 'string') {
      return res.status(400).json({ success: false, message: '缺少 user_id' });
    }

    try {
      const { data, error } = await supabase
        .from('sticker_records')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('查询贴纸记录失败:', error);
        return res.status(500).json({ success: false, message: '查询失败', detail: error.message });
      }

      return res.status(200).json({ success: true, data });
    } catch (err: any) {
      console.error('查询贴纸记录异常:', err);
      return res.status(500).json({ success: false, message: '服务器错误' });
    }
  }

  if (req.method === 'POST') {
    // 创建新的贴纸记录
    const { user_id, template_id, template_name, prompt, status, image_url, task_id } = req.body;

    if (!user_id || !template_name) {
      return res.status(400).json({ success: false, message: '缺少必填字段' });
    }

    try {
      const { data, error } = await supabase
        .from('sticker_records')
        .insert({
          user_id,
          template_id: template_id || null,
          template_name,
          prompt: prompt || null,
          status: status || 'generating',
          image_url: image_url || null,
          task_id: task_id || null,
        })
        .select()
        .single();

      if (error) {
        console.error('创建贴纸记录失败:', error);
        return res.status(500).json({ success: false, message: '创建失败', detail: error.message });
      }

      return res.status(201).json({ success: true, data });
    } catch (err: any) {
      console.error('创建贴纸记录异常:', err);
      return res.status(500).json({ success: false, message: '服务器错误' });
    }
  }

  if (req.method === 'PATCH') {
    // 更新贴纸记录（状态、图片URL等）
    const { id, status, image_url } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: '缺少记录 id' });
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (image_url) updateData.image_url = image_url;

    try {
      const { data, error } = await supabase
        .from('sticker_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('更新贴纸记录失败:', error);
        return res.status(500).json({ success: false, message: '更新失败', detail: error.message });
      }

      return res.status(200).json({ success: true, data });
    } catch (err: any) {
      console.error('更新贴纸记录异常:', err);
      return res.status(500).json({ success: false, message: '服务器错误' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: '缺少记录 id' });
    }

    try {
      const { error } = await supabase
        .from('sticker_records')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('删除贴纸记录失败:', error);
        return res.status(500).json({ success: false, message: '删除失败', detail: error.message });
      }

      return res.status(200).json({ success: true, message: '删除成功' });
    } catch (err: any) {
      console.error('删除贴纸记录异常:', err);
      return res.status(500).json({ success: false, message: '服务器错误' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
