import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { sendVerificationCode } from '@/lib/auth/email-verification';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.qq.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // QQ邮箱587端口用STARTTLS，不是SSL
  auth: {
    user: process.env.SMTP_USER, // 你的QQ邮箱
    pass: process.env.SMTP_PASS, // 16位授权码
  },
  // 调试时可启用
  // logger: true,
  // debug: true,
});

type ResponseData = {
  success: boolean;
  message: string;
  code?: string; // 仅开发环境返回
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

  const { email, codeType = 'registration' } = req.body;

  // 简单校验邮箱格式
  if (!email || !/^\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: '请输入有效邮箱' 
    });
  }

  // 检查验证码类型
  if (!['registration', 'password_reset'].includes(codeType)) {
    return res.status(400).json({ 
      success: false, 
      message: '无效的验证码类型' 
    });
  }

  try {
    // 使用我们的邮箱验证工具函数生成和保存验证码
    const result = await sendVerificationCode(email, codeType);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // 从数据库获取刚生成的验证码
    // result.code 在开发环境下会返回验证码用于调试
    const verificationCode = result.code || '000000'; // 备用，实际从数据库获取

    // 发送邮件
    const emailSubject = codeType === 'registration' ? 
      '【爪爪管家】注册验证码' : 
      '【爪爪管家】密码重置验证码';

    const emailText = codeType === 'registration' ?
      `您好！您的注册验证码是：${verificationCode}，10分钟内有效。请勿泄露给他人。` :
      `您好！您的密码重置验证码是：${verificationCode}，10分钟内有效。请勿泄露给他人。`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">🐾 爪爪管家</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">
            ${codeType === 'registration' ? '注册验证码' : '密码重置验证码'}
          </h3>
          <p style="font-size: 16px; color: #666;">您好！</p>
          <p style="font-size: 16px; color: #666;">您的验证码是：</p>
          <div style="background: white; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #ff6b35; letter-spacing: 5px;">
              ${verificationCode}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            • 验证码有效期为10分钟<br>
            • 请勿泄露给他人<br>
            • 如非本人操作，请忽略此邮件
          </p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          此邮件由系统自动发送，请勿直接回复<br>
          —— 爪爪管家团队
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"爪爪管家" <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({ 
      success: true,
      message: '验证码已发送，请查收邮箱（包括垃圾邮件箱）',
      // 开发环境下返回验证码便于调试
      ...(process.env.NODE_ENV === 'development' && result.code && { code: result.code })
    });

  } catch (error: any) {
    console.error('QQ邮箱发送失败:', error);
    
    // 根据错误类型返回更具体的错误信息
    let errorMessage = '验证码发送失败，请稍后再试';
    
    if (error.code === 'EAUTH') {
      errorMessage = '邮箱配置错误，请联系管理员';
    } else if (error.code === 'EMESSAGE') {
      errorMessage = '邮件内容有误，请稍后再试';
    } else if (error.responseCode === 550) {
      errorMessage = '邮箱地址无效，请检查后重试';
    }

    return res.status(500).json({ 
      success: false,
      message: errorMessage,
      // 开发环境下返回详细错误信息
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.message,
        code: error.code
      })
    });
  }
}
