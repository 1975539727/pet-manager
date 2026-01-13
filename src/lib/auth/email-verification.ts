import { supabase } from '../supabase';
import type { EmailVerificationCode } from '../supabase';

// 生成6位数验证码
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 发送验证码邮件
export async function sendVerificationCode(
  email: string, 
  codeType: 'registration' | 'password_reset' = 'registration'
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    // 检查是否已有有效验证码
    const { data: existingCodes, error: checkError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code_type', codeType)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString());

    if (checkError) {
      console.error('检查现有验证码失败:', checkError);
      return { success: false, message: '系统错误，请稍后重试' };
    }

    // 如果有有效验证码，先使其失效
    if (existingCodes && existingCodes.length > 0) {
      const { error: updateError } = await supabase
        .from('email_verification_codes')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('email', email)
        .eq('code_type', codeType)
        .eq('is_used', false);

      if (updateError) {
        console.error('更新现有验证码失败:', updateError);
      }
    }

    // 生成新验证码
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10分钟有效期
    // 保存验证码到数据库
    const { data: newCode, error: insertError } = await supabase
      .from('email_verification_codes')
      .insert({
        email,
        code,
        code_type: codeType,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('保存验证码失败:', insertError);
      return { success: false, message: '验证码生成失败，请稍后重试' };
    }

    // 邮件发送逻辑在API中处理，这里只负责生成和保存验证码
    return { 
      success: true, 
      message: '验证码已生成并保存到数据库',
      code: process.env.NODE_ENV === 'development' ? code : undefined
    };

  } catch (error) {
    console.error('发送验证码失败:', error);
    return { success: false, message: '验证码发送失败，请稍后重试' };
  }
}

// 验证验证码
export async function verifyVerificationCode(
  email: string,
  code: string,
  codeType: 'registration' | 'password_reset' = 'registration'
): Promise<{ success: boolean; message: string; codeData?: EmailVerificationCode }> {
  try {
    // 查找有效的验证码
    const { data: codeData, error: findError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('code_type', codeType)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();
    if (findError || !codeData) {
      return { 
        success: false, 
        message: '验证码无效或已过期，请重新获取' 
      };
    }

    // 标记验证码为已使用
    const { error: updateError } = await supabase
      .from('email_verification_codes')
      .update({ 
        is_used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('标记验证码为已使用失败:', updateError);
      return { success: false, message: '验证码处理失败，请稍后重试' };
    }

    return { 
      success: true, 
      message: '验证码验证成功',
      codeData 
    };

  } catch (error) {
    console.error('验证验证码失败:', error);
    return { success: false, message: '验证码验证失败，请稍后重试' };
  }
}

// 清理过期验证码
export async function cleanupExpiredCodes(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('email_verification_codes')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .eq('is_used', false)
      .select('id');

    if (error) {
      console.error('清理过期验证码失败:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('清理过期验证码失败:', error);
    return 0;
  }
}

// 检查邮箱验证码频率限制
export async function checkEmailRateLimit(email: string): Promise<{ allowed: boolean; waitTime?: number }> {
  try {
    // 检查过去5分钟内发送的验证码数量
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const { data, error } = await supabase
      .from('email_verification_codes')
      .select('created_at')
      .eq('email', email)
      .gt('created_at', fiveMinutesAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('检查邮箱频率限制失败:', error);
      return { allowed: true }; // 出错时允许发送
    }

    // 限制每5分钟最多3次
    if (data && data.length >= 3) {
      const lastSent = new Date(data[0].created_at);
      const waitTime = Math.ceil((lastSent.getTime() + 5 * 60 * 1000 - Date.now()) / 1000);
      return { allowed: false, waitTime: Math.max(waitTime, 0) };
    }

    return { allowed: true };
  } catch (error) {
    console.error('检查邮箱频率限制失败:', error);
    return { allowed: true };
  }
}
