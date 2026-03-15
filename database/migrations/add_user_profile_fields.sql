-- 为用户表添加个人资料字段
-- 添加日期: 2026-03-15
-- 说明: 添加个人简介、性别、出生日期三个字段

-- 添加个人简介字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 添加性别字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('男', '女', '其他'));

-- 添加出生日期字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- 添加字段注释
COMMENT ON COLUMN users.bio IS '用户个人简介，最多255字符';
COMMENT ON COLUMN users.gender IS '用户性别：男/女/其他';
COMMENT ON COLUMN users.birth_date IS '用户出生日期';

-- 验证字段是否添加成功
-- 可以运行以下查询来检查：
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- AND column_name IN ('bio', 'gender', 'birth_date');
