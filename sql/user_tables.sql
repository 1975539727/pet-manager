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
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  
  -- 账户状态
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 用户偏好设置
  preferred_language VARCHAR(10) DEFAULT 'zh-CN',
  timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
  
  -- 系统字段
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- 索引优化
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- 邮箱验证码表 (email_verification_codes)
-- 存储邮箱验证码信息，用于注册验证和找回密码
CREATE TABLE email_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  code_type VARCHAR(20) NOT NULL CHECK (code_type IN ('registration', 'password_reset', 'email_change')),
  
  -- 验证状态
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 有效期控制
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 安全控制：同一邮箱同一类型的验证码在有效期内只能有一个
  UNIQUE(email, code_type, is_used) DEFERRABLE
);

-- 用户会话表 (user_sessions)
-- 记录用户登录会话，支持多设备登录管理
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 会话信息
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  
  -- 设备信息
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  device_name VARCHAR(100),
  browser_name VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  
  -- 时间控制
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 会话状态
  is_active BOOLEAN DEFAULT TRUE,
  logout_at TIMESTAMP WITH TIME ZONE
);

-- 用户操作日志表 (user_activity_logs)
-- 记录重要的用户操作，用于审计和安全监控
CREATE TABLE user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 操作信息
  action_type VARCHAR(50) NOT NULL,
  action_description TEXT,
  
  -- 操作结果
  status VARCHAR(20) CHECK (status IN ('success', 'failed', 'pending')) DEFAULT 'success',
  error_message TEXT,
  
  -- 请求信息
  ip_address INET,
  user_agent TEXT,
  request_data JSONB,
  
  -- 时间信息
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_verification_codes_email ON email_verification_codes(email);
CREATE INDEX idx_verification_codes_expires_at ON email_verification_codes(expires_at);
CREATE INDEX idx_verification_codes_code_type ON email_verification_codes(code_type);
CREATE INDEX idx_verification_codes_is_used ON email_verification_codes(is_used);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);

CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON user_activity_logs(action_type);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);

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

-- 为 user_sessions 表创建自动更新 updated_at 的触发器
CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
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
    
    INSERT INTO user_activity_logs (action_type, action_description, status)
    VALUES ('system_cleanup', 'Cleaned up ' || deleted_count || ' expired verification codes', 'success');
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建清理过期会话的函数
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE user_sessions 
    SET is_active = FALSE, logout_at = NOW()
    WHERE expires_at < NOW() AND is_active = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    INSERT INTO user_activity_logs (action_type, action_description, status)
    VALUES ('system_cleanup', 'Cleaned up ' || deleted_count || ' expired sessions', 'success');
    
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
COMMENT ON COLUMN email_verification_codes.code_type IS '验证码类型：注册、密码重置、邮箱更改';
COMMENT ON COLUMN email_verification_codes.expires_at IS '验证码过期时间';

COMMENT ON TABLE user_sessions IS '用户会话表，管理用户登录状态';
COMMENT ON TABLE user_activity_logs IS '用户操作日志表，记录重要操作用于审计';
