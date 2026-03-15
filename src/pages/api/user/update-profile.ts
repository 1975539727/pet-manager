import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

interface ResponseData {
  success: boolean;
  message: string;
  data?: any;
  detail?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { 
    userId,
    username,
    bio,
    gender,
    birth_date,
    avatar_url
  } = req.body;

  // 校验参数
  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      message: '缺少用户ID' 
    });
  }

  try {
    // 构建更新数据对象
    const updateData: any = {};
    
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (gender !== undefined) updateData.gender = gender;
    if (birth_date !== undefined) updateData.birth_date = birth_date;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    
    // 添加更新时间
    updateData.updated_at = new Date().toISOString();

    // 更新用户信息
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, username, full_name, avatar_url, phone, bio, gender, birth_date, is_email_verified, is_active, created_at, updated_at')
      .single();

    if (updateError) {
      console.error('更新用户信息失败:', updateError);
      return res.status(500).json({
        success: false,
        message: '更新失败，请稍后再试',
        ...(process.env.NODE_ENV === 'development' && { 
          detail: updateError.message 
        })
      });
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    return res.status(200).json({
      success: true,
      message: '更新成功！',
      data: {
        user: updatedUser
      }
    });

  } catch (error: any) {
    console.error('更新用户资料失败:', error);
    return res.status(500).json({ 
      success: false,
      message: '更新失败，请稍后再试',
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.message 
      })
    });
  }
}
