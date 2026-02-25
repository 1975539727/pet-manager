-- 简化版用户宠物档案表
-- 用于 Supabase PostgreSQL 数据库
-- 基于前端表单的实际需求

-- ============================================
-- 用户宠物档案表（简化版）
-- ============================================
CREATE TABLE IF NOT EXISTS user_pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 基本信息
    name VARCHAR(100) NOT NULL,
    custom_breed VARCHAR(100),  -- 品种名称（如：中华田园犬、金毛等）
    
    -- 基本特征
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
    birth_date DATE,
    weight DECIMAL(10, 2),
    weight_unit VARCHAR(5) DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deceased')),
    is_neutered BOOLEAN DEFAULT FALSE,
    
    -- 备注（存储 JSON 格式数据，包含 category 等扩展信息）
    notes TEXT,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_user_pets_user_id ON user_pets(user_id);
CREATE INDEX idx_user_pets_status ON user_pets(status);

-- ============================================
-- 触发器: 自动更新 updated_at 字段
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_pets_updated_at BEFORE UPDATE ON user_pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE user_pets ENABLE ROW LEVEL SECURITY;

-- 查询策略
CREATE POLICY "Users can view their own pets"
    ON user_pets FOR SELECT
    USING (auth.uid() = user_id);

-- 插入策略
CREATE POLICY "Users can insert their own pets"
    ON user_pets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 更新策略
CREATE POLICY "Users can update their own pets"
    ON user_pets FOR UPDATE
    USING (auth.uid() = user_id);

-- 删除策略
CREATE POLICY "Users can delete their own pets"
    ON user_pets FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 示例查询
-- ============================================

-- 获取用户的所有活跃宠物
-- SELECT * FROM user_pets WHERE user_id = 'xxx' AND status = 'active';

-- 插入新宠物
-- INSERT INTO user_pets (user_id, name, custom_breed, gender, birth_date, weight, weight_unit, is_neutered, notes)
-- VALUES ('user-uuid', '旺财', '中华田园犬', 'male', '2020-01-01', 15.5, 'kg', false, '{"category": "dog"}');

-- 更新宠物信息
-- UPDATE user_pets 
-- SET weight = 16.0, is_neutered = true, updated_at = CURRENT_TIMESTAMP
-- WHERE id = 'pet-uuid' AND user_id = 'user-uuid';
