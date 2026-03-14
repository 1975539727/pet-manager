# 宠物头像上传 - 快速修复指南 🔧

## 问题原因

错误：`index row requires 62688 bytes, maximum size is 8191`

**原因**：Base64 编码的图片数据太大（约 60KB），超过了 PostgreSQL 索引的大小限制（8191 字节）。

## 解决方案

### 在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 步骤 1：删除索引（如果存在）
DROP INDEX IF EXISTS idx_user_pets_avatar;

-- 步骤 2：确保 avatar_url 字段存在
ALTER TABLE user_pets 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 步骤 3：添加注释
COMMENT ON COLUMN user_pets.avatar_url IS '宠物头像，存储Base64编码的图片数据';
```

## 执行步骤

### 1. 登录 Supabase Dashboard
访问：https://supabase.com/dashboard

### 2. 进入 SQL Editor
- 选择您的项目
- 点击左侧菜单的 **SQL Editor**
- 点击 **New query**

### 3. 粘贴并执行 SQL
- 复制上面的 SQL 代码
- 粘贴到编辑器中
- 点击 **Run** 按钮

### 4. 验证执行结果
应该看到以下成功消息：
```
Success. No rows returned.
```

## 验证修复

### 1. 检查字段是否存在
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_pets' 
AND column_name = 'avatar_url';
```

应该返回：
```
column_name | data_type
------------|----------
avatar_url  | text
```

### 2. 确认索引已删除
```sql
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'user_pets' 
AND indexname = 'idx_user_pets_avatar';
```

应该返回空结果（0 rows）

## 完成！

执行完上述 SQL 后，再次尝试上传宠物头像，应该就可以正常工作了！

## 为什么不需要索引？

- `avatar_url` 字段只用于存储和显示，不用于查询条件
- Base64 编码的数据太大（30KB - 100KB），不适合创建索引
- 没有索引不会影响性能，因为我们通过 `id` 字段查询宠物信息

## 如果还有问题

请检查浏览器控制台是否还有其他错误信息。
