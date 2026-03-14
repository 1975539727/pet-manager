-- 为用户宠物表添加头像字段
-- 执行日期: 2024-03-11
-- 更新日期: 2024-03-14 - 移除索引（Base64数据太大）

-- 添加 avatar_url 字段
ALTER TABLE user_pets 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 添加注释
COMMENT ON COLUMN user_pets.avatar_url IS '宠物头像，存储Base64编码的图片数据';

-- 注意：不创建索引，因为 Base64 编码的图片数据太大
-- Base64 字符串可能超过 8KB，超过 PostgreSQL 索引限制
