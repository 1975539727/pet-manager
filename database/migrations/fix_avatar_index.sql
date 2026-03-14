-- 修复 avatar_url 索引问题
-- Base64 编码的图片太大，不适合创建索引
-- 执行日期: 2024-03-14

-- 删除之前创建的索引（如果存在）
DROP INDEX IF EXISTS idx_user_pets_avatar;

-- 注意：avatar_url 字段不需要索引，因为：
-- 1. 不会用于查询条件
-- 2. Base64 编码的数据太大，超过 PostgreSQL 索引限制（8191字节）
