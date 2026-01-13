# QQ邮箱验证码系统使用指南

## 📧 QQ邮箱配置步骤

### 1. 开启QQ邮箱SMTP服务
1. 登录你的QQ邮箱 (https://mail.qq.com)
2. 点击右上角「设置」→「账户」
3. 往下拉，找到 "POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
4. 开启：✅ **IMAP/SMTP服务**
5. 点击「生成授权码」→ 按提示用手机验证 → 得到**16位授权码**

⚠️ **重要**: 这个16位授权码就是 `SMTP_PASS`，不是你的QQ登录密码！

### 2. 配置环境变量
1. 将 `env.example.txt` 重命名为 `.env.local`
2. 填入你的真实配置：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# QQ邮箱 SMTP 配置
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=你的QQ号@qq.com           # 例如: 123456789@qq.com
SMTP_PASS=你的16位授权码             # 例如: abcd1234efgh5678
```

### 3. 数据库设置
在 Supabase Dashboard 中执行 `sql/user_tables_simple.sql` 脚本创建数据库表。

## 🚀 功能特点

### ✅ 注册流程
1. 用户输入邮箱 → 点击"获取验证码"
2. 系统发送6位数验证码到用户邮箱
3. 用户输入验证码 → 验证成功后填写个人信息
4. 完成注册，邮箱自动标记为已验证

### ✅ 登录功能
- 使用邮箱和密码登录
- 自动检查账户状态（激活、邮箱验证）
- 登录成功后保存用户信息到localStorage

### ✅ 安全措施
- 密码使用 bcrypt 哈希加密（cost=12）
- 验证码10分钟有效期
- 同一邮箱5分钟内最多发送3次验证码
- 验证码使用后立即标记为已使用

## 📡 API接口

### 发送验证码
```bash
POST /api/auth/send-code
Content-Type: application/json

{
  "email": "user@qq.com",
  "codeType": "registration" // 或 "password_reset"
}
```

### 验证验证码
```bash
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "user@qq.com",
  "code": "123456",
  "codeType": "registration"
}
```

### 用户注册
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@qq.com",
  "password": "password123",
  "username": "用户名",
  "full_name": "真实姓名",
  "verification_code": "123456"
}
```

### 用户登录
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@qq.com",
  "password": "password123"
}
```

## 🎯 页面路径

- 注册页面: `/auth/register`
- 登录页面: `/auth/login`
- 首页: `/`

## 📝 开发调试

### 开发环境特性
- 发送验证码API会在响应中返回验证码（便于调试）
- 控制台会输出验证码：`console.log('验证码（仅开发环境显示）:', result.code)`
- 错误信息会更详细

### 测试建议
1. 先用你自己的QQ邮箱作为收件人测试
2. 检查垃圾邮件箱
3. 确认SMTP配置正确

## ⚠️ 注意事项

### 邮件可能进垃圾箱
- QQ邮箱对新发件人较敏感
- 建议用户检查垃圾邮件箱
- 可以将发件邮箱加入白名单

### 发送限制
- QQ邮箱免费账户：每天最多发500封邮件
- 系统限制：每5分钟最多发3次验证码

### 生产环境建议
- 使用专业邮件服务（Resend、SendGrid）
- 启用邮件模板
- 配置邮件统计和监控
- 实施更严格的频率限制

## 🔧 故障排查

### 1. 验证码发送失败
- 检查 SMTP 配置是否正确
- 确认授权码是否有效
- 查看控制台错误信息

### 2. 邮件未收到
- 检查垃圾邮件箱
- 确认邮箱地址正确
- 尝试重新发送

### 3. 验证码无效
- 检查验证码是否过期（10分钟）
- 确认验证码是否已被使用
- 重新获取验证码

现在您可以使用完整的QQ邮箱验证码系统了！🎉
