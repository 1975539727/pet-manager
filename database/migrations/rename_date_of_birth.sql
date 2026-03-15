-- 重命名用户表的出生日期字段以保持与代码一致性
-- 添加日期: 2026-03-15

-- 重命名字段
ALTER TABLE users 
RENAME COLUMN date_of_birth TO birth_date;

-- 更新注释
COMMENT ON COLUMN users.birth_date IS '用户出生日期';
