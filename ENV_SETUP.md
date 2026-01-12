# 环境变量配置指南

## 需要的环境变量

请在 `.env` 文件中添加以下环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_项目_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_匿名_密钥
```

## 如何获取 Supabase 配置

1. 登录到 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings > API
4. 复制以下信息：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 注意事项

- 使用 `NEXT_PUBLIC_` 前缀的环境变量会暴露给客户端
- 只在这里使用 `anon` 密钥，不要使用 `service_role` 密钥
- 确保 `.env` 文件在 `.gitignore` 中，不要提交到版本控制

## 示例 .env 文件

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
