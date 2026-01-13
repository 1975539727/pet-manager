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

  const { email, password } = req.body;

  // 校验参数
  if (!email || !/^\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入有效邮箱' 
    });
  }

  if (!password) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入密码' 
    });
  }

  try {
    // 1. 查找用户
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, password_hash, username, full_name, avatar_url, is_email_verified, is_active, created_at')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(400).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 2. 检查账户状态
    if (!user.is_active) {
      return res.status(400).json({
        success: false,
        message: '账户已被停用，请联系管理员'
      });
    }

    if (!user.is_email_verified) {
      return res.status(400).json({
        success: false,
        message: '邮箱未验证，请先验证邮箱'
      });
    }

    // 3. 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 4. 更新最后登录时间（可选）
    // await supabase
    //   .from('users')
    //   .update({ last_login_at: new Date().toISOString() })
    //   .eq('id', user.id);

    // 5. 返回成功结果（不返回密码哈希）
    const { password_hash, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      message: '登录成功！',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error: any) {
    console.error('用户登录失败:', error);
    return res.status(500).json({ 
      success: false,
      message: '登录失败，请稍后再试',
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.message 
      })
    });
  }
}
