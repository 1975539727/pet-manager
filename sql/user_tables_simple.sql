-- 用户表 (users)
-- 存储用户基本信息
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50),
  full_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  
  -- 账户状态
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 系统字段
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 邮箱格式检查
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- 邮箱验证码表 (email_verification_codes)
-- 存储邮箱验证码信息，用于注册验证和找回密码
CREATE TABLE email_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  code_type VARCHAR(20) NOT NULL CHECK (code_type IN ('registration', 'password_reset')),
  
  -- 验证状态
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- 有效期控制
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_verification_codes_email ON email_verification_codes(email);
CREATE INDEX idx_verification_codes_expires_at ON email_verification_codes(expires_at);
CREATE INDEX idx_verification_codes_code_type ON email_verification_codes(code_type);
CREATE INDEX idx_verification_codes_is_used ON email_verification_codes(is_used);

-- 创建更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 users 表创建自动更新 updated_at 的触发器
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建清理过期验证码的函数
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_verification_codes 
    WHERE expires_at < NOW() AND is_used = FALSE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 插入示例数据用于测试
INSERT INTO users (email, password_hash, username, full_name, is_email_verified) VALUES
('test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UYVu7nj.z0Z2', 'testuser', '测试用户', TRUE),
('demo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UYVu7nj.z0Z2', 'demouser', '演示用户', FALSE);

-- 注释说明
COMMENT ON TABLE users IS '用户主表，存储用户基本信息';
COMMENT ON COLUMN users.email IS '用户邮箱，唯一标识符';
COMMENT ON COLUMN users.password_hash IS '密码哈希值，使用bcrypt加密';
COMMENT ON COLUMN users.is_email_verified IS '邮箱是否已验证';
COMMENT ON COLUMN users.is_active IS '账户是否激活';

COMMENT ON TABLE email_verification_codes IS '邮箱验证码表，用于注册验证和密码重置';
COMMENT ON COLUMN email_verification_codes.code IS '6位数验证码';
COMMENT ON COLUMN email_verification_codes.code_type IS '验证码类型：注册、密码重置';
COMMENT ON COLUMN email_verification_codes.expires_at IS '验证码过期时间';
