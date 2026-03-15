-- 为用户表添加个人简介字段
-- 添加日期: 2026-03-15

-- 添加bio字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 添加注释
COMMENT ON COLUMN users.bio IS '用户个人简介';
