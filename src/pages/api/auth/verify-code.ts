import type { NextApiRequest, NextApiResponse } from 'next';
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

  const { email, code, codeType = 'registration' } = req.body;

  // 校验参数
  if (!email || !/^\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入有效邮箱' 
    });
  }

  if (!code || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入6位数字验证码' 
    });
  }

  if (!['registration', 'password_reset'].includes(codeType)) {
    return res.status(400).json({ 
      success: false, 
      message: '无效的验证码类型' 
    });
  }

  try {
    // 验证验证码
    const result = await verifyVerificationCode(email, code, codeType);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          email,
          codeType,
          verifiedAt: new Date().toISOString()
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error: any) {
    console.error('验证码验证失败:', error);
    return res.status(500).json({ 
      success: false,
      message: '验证失败，请稍后再试',
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.message 
      })
    });
  }
}
