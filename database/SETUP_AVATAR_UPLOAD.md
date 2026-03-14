# 宠物头像上传功能设置指南

本指南将帮助您在Supabase中设置宠物头像上传功能。

## 1. 数据库迁移

### 添加 avatar_url 字段

在Supabase SQL编辑器中执行以下SQL语句：

```sql
-- 为用户宠物表添加头像字段
ALTER TABLE user_pets 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 添加注释
COMMENT ON COLUMN user_pets.avatar_url IS '宠物头像URL，存储在Supabase Storage中的图片路径';

-- 创建索引（可选）
CREATE INDEX IF NOT EXISTS idx_user_pets_avatar ON user_pets(avatar_url) WHERE avatar_url IS NOT NULL;
```

或者直接执行迁移文件：
```bash
# 在Supabase SQL编辑器中运行
-- @database/migrations/add_avatar_url.sql
```

## 2. 创建 Storage Bucket

### 步骤 1：创建存储桶

1. 登录Supabase Dashboard
2. 进入项目的 **Storage** 页面
3. 点击 **New bucket**
4. 填写以下信息：
   - **Name**: `pet-avatars`
   - **Public bucket**: ✅ 勾选（允许公开访问）
   - **File size limit**: 5MB（可选）
   - **Allowed MIME types**: `image/*`（可选）

### 步骤 2：设置存储策略

在 **Storage** > **Policies** 中，为 `pet-avatars` bucket 添加以下策略：

#### 上传策略（Insert）

```sql
CREATE POLICY "用户可以上传自己宠物的头像"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-avatars' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM user_pets WHERE user_id = auth.uid()
  )
);
```

#### 查看策略（Select）

```sql
CREATE POLICY "所有人都可以查看宠物头像"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-avatars');
```

#### 更新策略（Update）

```sql
CREATE POLICY "用户可以更新自己宠物的头像"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-avatars' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM user_pets WHERE user_id = auth.uid()
  )
);
```

#### 删除策略（Delete）

```sql
CREATE POLICY "用户可以删除自己宠物的头像"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-avatars' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM user_pets WHERE user_id = auth.uid()
  )
);
```

## 3. 验证设置

### 测试上传功能

1. 登录应用
2. 进入"我的宠物"页面
3. 选择一个宠物，点击"编辑"
4. 点击头像区域的相机图标
5. 选择一张图片上传
6. 保存宠物信息

### 检查上传结果

在Supabase Dashboard中：
1. 进入 **Storage** > **pet-avatars**
2. 查看是否有新上传的图片
3. 图片应该存储在 `{pet_id}/` 文件夹下

## 4. 功能特性

### 支持的图片格式
- JPG/JPEG
- PNG
- GIF
- WebP

### 文件大小限制
- 最大 5MB

### 图片处理
- 自动压缩（最大800x800像素）
- 保持宽高比
- 压缩质量：80%

### 安全性
- 用户只能上传/删除自己宠物的头像
- 文件名使用时间戳和随机字符串防止冲突
- 支持替换旧头像（自动删除旧文件）

## 5. 故障排查

### 上传失败

**问题**: "图片上传失败"错误

**解决方案**:
1. 检查 Storage bucket 是否创建
2. 检查 bucket 名称是否为 `pet-avatars`
3. 检查 bucket 是否设置为 Public
4. 检查 Storage 策略是否正确设置
5. 检查文件大小是否超过限制

### 无法查看图片

**问题**: 图片上传成功但无法显示

**解决方案**:
1. 检查 bucket 的 Public 设置
2. 检查 SELECT 策略是否正确
3. 检查图片 URL 是否正确
4. 在浏览器中直接访问图片 URL 测试

### 无法删除旧头像

**问题**: 更换头像后旧图片仍然存在

**解决方案**:
1. 检查 DELETE 策略是否正确
2. 检查用户权限
3. 手动在 Storage 中删除旧文件

## 6. API 使用示例

### 上传图片

```typescript
import { uploadImage } from '@/lib/api/upload';

const handleUpload = async (file: File, petId: string) => {
  const url = await uploadImage(file, 'pet-avatars', petId);
  if (url) {
    console.log('上传成功:', url);
  }
};
```

### 删除图片

```typescript
import { deleteImage } from '@/lib/api/upload';

const handleDelete = async (imageUrl: string) => {
  const success = await deleteImage(imageUrl, 'pet-avatars');
  if (success) {
    console.log('删除成功');
  }
};
```

### 压缩图片

```typescript
import { compressImage } from '@/lib/api/upload';

const handleCompress = async (file: File) => {
  const compressed = await compressImage(file, 800, 800, 0.8);
  console.log('原始大小:', file.size);
  console.log('压缩后大小:', compressed.size);
};
```

## 7. 环境变量

确保 `.env.local` 文件中有以下配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 8. 完成

设置完成后，用户就可以在编辑宠物信息页面上传、更换和删除宠物头像了！
