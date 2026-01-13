# 用户系统数据库设计

## 数据库表结构

### 1. users 表 - 用户主表
存储用户的基本信息和账户状态。

**主要字段：**
- `id`: 用户唯一标识 (UUID)
- `email`: 用户邮箱，唯一约束
- `password_hash`: 密码哈希值 (建议使用 bcrypt)
- `username`: 用户名
- `full_name`: 用户真实姓名
- `is_email_verified`: 邮箱验证状态
- `is_active`: 账户激活状态

### 2. email_verification_codes 表 - 邮箱验证码表
存储邮箱验证码，支持注册验证、密码重置等场景。

**主要字段：**
- `email`: 目标邮箱
- `code`: 6位数验证码
- `code_type`: 验证码类型 (registration/password_reset/email_change)
- `expires_at`: 过期时间
- `is_used`: 是否已使用

### 3. user_sessions 表 - 用户会话表
管理用户登录状态，支持多设备登录。

**主要字段：**
- `session_token`: 会话令牌
- `device_type`: 设备类型
- `ip_address`: 登录IP
- `expires_at`: 会话过期时间

### 4. user_activity_logs 表 - 用户操作日志
记录重要的用户操作，用于安全审计。

## 部署说明

### 1. 执行 SQL 脚本
```bash
# 在 Supabase Dashboard 的 SQL Editor 中执行
# 或者使用 psql 连接到你的 PostgreSQL 数据库
psql -h your-db-host -U your-username -d your-database -f user_tables.sql
```

### 2. 环境配置
确保在 `.env.local` 文件中配置了正确的 Supabase 连接信息：
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 权限设置 (Row Level Security)
在 Supabase 中启用 RLS 并设置适当的策略：

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的信息
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- 用户只能更新自己的信息
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- 验证码表的访问策略（通常通过服务端函数操作）
CREATE POLICY "Service role can manage verification codes" ON email_verification_codes
    FOR ALL USING (auth.role() = 'service_role');
```

## 使用示例

### 1. 发送验证码
```typescript
import { sendVerificationCode } from '@/lib/auth/email-verification';

const result = await sendVerificationCode('user@example.com', 'registration');
if (result.success) {
    console.log(result.message); // "验证码已发送..."
}
```

### 2. 验证验证码
```typescript
import { verifyVerificationCode } from '@/lib/auth/email-verification';

const result = await verifyVerificationCode('user@example.com', '123456', 'registration');
if (result.success) {
    console.log('验证成功');
    // 继续用户注册流程
}
```

### 3. 用户注册流程
```typescript
// 1. 发送验证码
await sendVerificationCode(email, 'registration');

// 2. 用户输入验证码，前端验证
const verification = await verifyVerificationCode(email, code, 'registration');

// 3. 验证成功后创建用户
if (verification.success) {
    const { data, error } = await supabase
        .from('users')
        .insert({
            email,
            password_hash: await bcrypt.hash(password, 12),
            username,
            full_name,
            is_email_verified: true
        });
}
```

## 安全考虑

### 1. 密码安全
- 使用 bcrypt 哈希密码，建议 cost 为 12 或更高
- 实施密码强度要求

### 2. 验证码安全
- 验证码10分钟过期
- 同一邮箱5分钟内最多发送3次验证码
- 验证码使用后立即标记为已使用

### 3. 会话管理
- 会话令牌使用强随机算法生成
- 支持会话过期和主动登出
- 记录登录设备和IP信息

### 4. 数据保护
- 启用 Row Level Security (RLS)
- 敏感操作记录审计日志
- 定期清理过期数据

## 维护任务

### 1. 定期清理
建议设置定时任务清理过期数据：

```sql
-- 清理过期验证码
SELECT cleanup_expired_verification_codes();

-- 清理过期会话
SELECT cleanup_expired_sessions();
```

### 2. 监控指标
- 注册转化率
- 邮箱验证成功率
- 异常登录活动
- 系统性能指标

## 扩展建议

### 1. 第三方登录
可以扩展支持 Google、GitHub 等第三方登录：
- 添加 `oauth_providers` 表
- 存储第三方用户标识

### 2. 用户角色权限
根据需要添加角色权限系统：
- 添加 `roles` 和 `permissions` 表
- 实现基于角色的访问控制

### 3. 邮件服务集成
集成专业的邮件服务：
- Resend (推荐)
- SendGrid
- Amazon SES

### 4. 短信验证
可以添加手机号验证功能：
- 添加 `sms_verification_codes` 表
- 集成短信服务提供商
