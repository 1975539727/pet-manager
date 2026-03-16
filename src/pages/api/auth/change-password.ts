import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { email, currentPassword, newPassword } = req.body;

  // 校验参数
  if (!email || !/^\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入有效邮箱' 
    });
  }

  if (!currentPassword) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入当前密码' 
    });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: '新密码长度至少6位' 
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: '新密码不能与当前密码相同' 
    });
  }

  try {
    // 1. 查找用户并获取当前密码哈希
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(400).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 2. 验证当前密码
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '当前密码错误'
      });
    }

    // 3. 哈希新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 4. 更新密码
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('更新密码失败:', updateError);
      return res.status(500).json({
        success: false,
        message: '密码修改失败，请稍后再试'
      });
    }

    // 5. 返回成功结果
    return res.status(200).json({
      success: true,
      message: '密码修改成功',
      data: {
        email: user.email
      }
    });

  } catch (error: any) {
    console.error('修改密码失败:', error);
    return res.status(500).json({ 
      success: false,
      message: '密码修改失败，请稍后再试',
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.message 
      })
    });
  }
}
