import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { verifyVerificationCode } from '@/lib/auth/email-verification';

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

  const { 
    email, 
    password, 
    username, 
    full_name, 
    verification_code 
  } = req.body;

  // 校验参数
  if (!email || !/^\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入有效邮箱' 
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: '密码长度至少6位' 
    });
  }

  if (!verification_code || !/^\d{6}$/.test(verification_code)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入6位数字验证码' 
    });
  }

  try {
    // 1. 验证验证码
    const verificationResult = await verifyVerificationCode(
      email, 
      verification_code, 
      'registration'
    );

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }

    // 2. 检查邮箱是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = 没找到记录
      console.error('检查用户是否存在失败:', checkError);
      return res.status(500).json({
        success: false,
        message: '系统错误，请稍后再试'
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 3. 检查用户名是否已存在（如果提供了用户名）
    if (username) {
      const { data: existingUsername, error: usernameCheckError } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .single();

      if (usernameCheckError && usernameCheckError.code !== 'PGRST116') {
        console.error('检查用户名是否存在失败:', usernameCheckError);
        return res.status(500).json({
          success: false,
          message: '系统错误，请稍后再试'
        });
      }

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: '该用户名已被使用'
        });
      }
    }

    // 4. 哈希密码
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. 创建用户
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        username,
        full_name,
        is_email_verified: true, // 已通过邮箱验证
        is_active: true
      })
      .select('id, email, username, full_name, is_email_verified, created_at')
      .single();

    if (insertError) {
      console.error('创建用户失败:', insertError);
      return res.status(500).json({
        success: false,
        message: '注册失败，请稍后再试'
      });
    }

    // 6. 返回成功结果（不返回敏感信息）
    return res.status(201).json({
      success: true,
      message: '注册成功！',
      data: {
        user: newUser
      }
    });

  } catch (error: any) {
    console.error('用户注册失败:', error);
    return res.status(500).json({ 
      success: false,
      message: '注册失败，请稍后再试',
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.message 
      })
    });
  }
}
