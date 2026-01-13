# 简化版用户系统数据库设计

适用于个人小项目的用户注册登录系统。

## 数据库表结构

### 1. users 表 - 用户主表
存储用户的基本信息。

**主要字段：**
- `id`: 用户唯一标识 (UUID)
- `email`: 用户邮箱，唯一约束
- `password_hash`: 密码哈希值 (使用 bcrypt)
- `username`: 用户名
- `full_name`: 用户真实姓名
- `avatar_url`: 头像URL
- `phone`: 手机号
- `is_email_verified`: 邮箱验证状态
- `is_active`: 账户激活状态

### 2. email_verification_codes 表 - 邮箱验证码表
存储邮箱验证码，支持注册验证和密码重置。

**主要字段：**
- `email`: 目标邮箱
- `code`: 6位数验证码
- `code_type`: 验证码类型 (registration/password_reset)
- `expires_at`: 过期时间 (10分钟)
- `is_used`: 是否已使用

## 快速开始

### 1. 执行 SQL 脚本
在 Supabase Dashboard 的 SQL Editor 中执行：
```sql
-- 复制 user_tables_simple.sql 的内容并执行
```

### 2. 环境配置
在 `.env.local` 中配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 使用示例

#### 发送注册验证码
```typescript
import { sendVerificationCode } from '@/lib/auth/email-verification';

const result = await sendVerificationCode('user@example.com', 'registration');
if (result.success) {
    console.log(result.message); // "验证码已发送..."
}
```

#### 验证验证码并注册用户
```typescript
import { verifyVerificationCode } from '@/lib/auth/email-verification';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 1. 验证验证码
const verification = await verifyVerificationCode(email, code, 'registration');

if (verification.success) {
    // 2. 创建用户
    const { data, error } = await supabase
        .from('users')
        .insert({
            email,
            password_hash: await bcrypt.hash(password, 12),
            username,
            full_name,
            is_email_verified: true
        })
        .select()
        .single();
        
    if (!error) {
        console.log('用户注册成功', data);
    }
}
```

#### 用户登录
```typescript
// 简单的登录验证
const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password_hash, username, full_name, is_email_verified, is_active')
    .eq('email', email)
    .eq('is_active', true)
    .single();

if (user && await bcrypt.compare(password, user.password_hash)) {
    // 登录成功
    console.log('登录成功', user);
}
```

## 安全功能

- ✅ 密码 bcrypt 哈希加密
- ✅ 邮箱格式验证
- ✅ 验证码10分钟过期
- ✅ 防止重复发送验证码
- ✅ 自动清理过期验证码

## 维护

定期清理过期验证码：
```sql
SELECT cleanup_expired_verification_codes();
```

## 扩展建议

1. **邮件服务集成**: 推荐使用 Resend 或 SendGrid
2. **JWT认证**: 可以添加 JWT token 进行会话管理
3. **头像上传**: 集成文件上传服务
4. **忘记密码**: 使用 `password_reset` 类型的验证码

这个简化版本非常适合个人项目和小型应用！
