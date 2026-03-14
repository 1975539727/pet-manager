# 宠物头像上传功能 - 简化方案

## 方案说明

当前实现使用 **Base64 编码**直接将图片存储在数据库中，无需配置 Supabase Storage。

### ✅ 优点
- **零配置**：不需要创建 Storage Bucket
- **简单易用**：图片直接存储在数据库的 `avatar_url` 字段中
- **无需额外权限**：不需要配置复杂的 Storage 策略
- **开发友好**：本地开发和生产环境完全一致

### ⚠️ 注意事项
- **文件大小限制**：最大 2MB（压缩后约 600x600 像素）
- **数据库大小**：Base64 编码会增加约 33% 的存储空间
- **适用场景**：适合小型应用和头像图片

## 已完成的设置

### 1. 数据库字段
已在 `user_pets` 表中添加 `avatar_url` 字段（类型：TEXT）

```sql
ALTER TABLE user_pets 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### 2. 功能特性

#### 支持的图片格式
- JPG/JPEG
- PNG
- GIF
- WebP

#### 图片处理流程
1. 选择图片 → 验证格式和大小（最大2MB）
2. 自动压缩（600x600像素，70%质量）
3. 转换为 Base64 编码
4. 存储到数据库的 `avatar_url` 字段
5. 页面直接显示 Base64 图片

## 使用方法

### 编辑宠物信息
1. 进入"我的宠物"页面
2. 点击宠物卡片进入详情
3. 点击"编辑"按钮
4. 在头像区域点击相机图标
5. 选择图片（自动压缩和上传）
6. 点击"保存"按钮

### 删除头像
点击头像右上角的 X 按钮即可删除

## 技术实现

### Base64 编码
```typescript
// 将图片转换为 Base64
const base64String = await convertImageToBase64(compressedFile);

// 存储格式示例
"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
```

### 数据库存储
```sql
UPDATE user_pets 
SET avatar_url = 'data:image/jpeg;base64,/9j/4AAQ...'
WHERE id = 'pet-uuid';
```

### 显示图片
```tsx
<img src={avatarUrl} alt="宠物头像" />
```

## 如果需要更高级的功能

如果您的应用需要：
- 上传更大的图片（>2MB）
- 存储大量图片
- 更好的性能
- CDN 加速

可以参考 `SETUP_AVATAR_UPLOAD.md` 配置 Supabase Storage。

## 常见问题

### Q: 为什么限制 2MB？
A: Base64 编码会增加文件大小约 33%。2MB 的原始文件编码后约 2.7MB，仍在合理范围内。压缩后的图片通常小于 500KB。

### Q: 图片质量会下降吗？
A: 会有轻微压缩，但对于头像图片（600x600）来说，视觉效果仍然很好。

### Q: 可以存储多张图片吗？
A: 当前方案仅支持一张头像。如果需要相册功能，建议使用 Supabase Storage。

### Q: 是否影响性能？
A: 对于头像图片（压缩后<500KB），对性能影响可忽略。如果存储大量大图片，建议改用 Storage。

## 完成！

现在您可以直接使用图片上传功能，无需任何额外配置！🎉
