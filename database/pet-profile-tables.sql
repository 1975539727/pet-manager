-- 宠物档案管理和健康日志数据库表结构
-- 用于 Supabase PostgreSQL 数据库

-- ============================================
-- 1. 用户宠物档案表
-- ============================================
CREATE TABLE IF NOT EXISTS user_pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 基本信息
    name VARCHAR(100) NOT NULL,
    breed_id UUID REFERENCES pet_breeds(id),
    custom_breed VARCHAR(100),
    
    -- 基本特征
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
    birth_date DATE,
    color VARCHAR(50),
    weight DECIMAL(10, 2),
    weight_unit VARCHAR(5) DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
    
    -- 识别信息
    chip_number VARCHAR(50),
    registration_number VARCHAR(50),
    photo_url TEXT,
    
    -- 领养信息
    adoption_date DATE,
    source VARCHAR(200),
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deceased')),
    is_neutered BOOLEAN DEFAULT FALSE,
    
    -- 备注
    notes TEXT,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_user_pets_user_id ON user_pets(user_id);
CREATE INDEX idx_user_pets_status ON user_pets(status);
CREATE INDEX idx_user_pets_breed_id ON user_pets(breed_id);

-- ============================================
-- 2. 健康记录表
-- ============================================
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    
    -- 记录类型
    record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('vaccine', 'deworming', 'checkup', 'illness', 'surgery', 'other')),
    
    -- 基本信息
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    
    -- 医疗信息
    veterinarian VARCHAR(100),
    clinic VARCHAR(200),
    diagnosis TEXT,
    treatment TEXT,
    medication TEXT,
    
    -- 疫苗/驱虫特定信息
    vaccine_name VARCHAR(100),
    next_due_date DATE,
    
    -- 附件
    attachments JSONB,
    
    -- 费用
    cost DECIMAL(10, 2),
    cost_currency VARCHAR(10),
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX idx_health_records_date ON health_records(date DESC);
CREATE INDEX idx_health_records_type ON health_records(record_type);

-- ============================================
-- 3. 健康提醒表
-- ============================================
CREATE TABLE IF NOT EXISTS health_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    
    -- 提醒类型
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('vaccine', 'deworming', 'checkup', 'medication', 'grooming', 'custom')),
    
    -- 提醒内容
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- 时间设置
    remind_date DATE NOT NULL,
    repeat_type VARCHAR(10) DEFAULT 'none' CHECK (repeat_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
    repeat_interval INTEGER DEFAULT 1,
    
    -- 提前提醒
    advance_days INTEGER DEFAULT 0,
    
    -- 状态
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- 关联健康记录
    related_record_id UUID REFERENCES health_records(id) ON DELETE SET NULL,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_health_reminders_pet_id ON health_reminders(pet_id);
CREATE INDEX idx_health_reminders_date ON health_reminders(remind_date);
CREATE INDEX idx_health_reminders_completed ON health_reminders(is_completed);
CREATE INDEX idx_health_reminders_active ON health_reminders(is_active);

-- ============================================
-- 4. 体重记录表
-- ============================================
CREATE TABLE IF NOT EXISTS weight_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    
    weight DECIMAL(10, 2) NOT NULL,
    weight_unit VARCHAR(5) DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
    record_date DATE NOT NULL,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_weight_records_pet_id ON weight_records(pet_id);
CREATE INDEX idx_weight_records_date ON weight_records(record_date DESC);

-- ============================================
-- 5. 日常日志表
-- ============================================
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    
    -- 饮食
    food_intake VARCHAR(20) CHECK (food_intake IN ('normal', 'less', 'more', 'none')),
    water_intake VARCHAR(20) CHECK (water_intake IN ('normal', 'less', 'more', 'none')),
    
    -- 排泄
    urination VARCHAR(20) CHECK (urination IN ('normal', 'less', 'more', 'abnormal')),
    defecation VARCHAR(20) CHECK (defecation IN ('normal', 'less', 'more', 'abnormal')),
    
    -- 活动与情绪
    activity_level VARCHAR(20) CHECK (activity_level IN ('normal', 'less', 'more')),
    mood VARCHAR(20) CHECK (mood IN ('happy', 'normal', 'sad', 'anxious')),
    
    -- 异常症状
    symptoms JSONB,
    
    -- 备注
    notes TEXT,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 确保每天每只宠物只有一条日志
    UNIQUE(pet_id, log_date)
);

-- 索引
CREATE INDEX idx_daily_logs_pet_id ON daily_logs(pet_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date DESC);

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

-- 为各表创建触发器
CREATE TRIGGER update_user_pets_updated_at BEFORE UPDATE ON user_pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_reminders_updated_at BEFORE UPDATE ON health_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE user_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- user_pets 策略
CREATE POLICY "Users can view their own pets"
    ON user_pets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets"
    ON user_pets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
    ON user_pets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
    ON user_pets FOR DELETE
    USING (auth.uid() = user_id);

-- health_records 策略 (通过 pet_id 关联到用户)
CREATE POLICY "Users can view health records of their pets"
    ON health_records FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_pets 
        WHERE user_pets.id = health_records.pet_id 
        AND user_pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert health records for their pets"
    ON health_records FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_pets 
        WHERE user_pets.id = health_records.pet_id 
        AND user_pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update health records of their pets"
    ON health_records FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_pets 
        WHERE user_pets.id = health_records.pet_id 
        AND user_pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete health records of their pets"
    ON health_records FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM user_pets 
        WHERE user_pets.id = health_records.pet_id 
        AND user_pets.user_id = auth.uid()
    ));

-- 类似的策略应用于其他表
-- (health_reminders, weight_records, daily_logs 使用相同的模式)

-- ============================================
-- 示例查询
-- ============================================

-- 获取用户的所有活跃宠物
-- SELECT * FROM user_pets WHERE user_id = 'xxx' AND status = 'active';

-- 获取宠物的健康记录(按日期倒序)
-- SELECT * FROM health_records WHERE pet_id = 'xxx' ORDER BY date DESC;

-- 获取即将到期的提醒(未来7天内)
-- SELECT * FROM health_reminders 
-- WHERE pet_id = 'xxx' 
-- AND is_active = true 
-- AND is_completed = false 
-- AND remind_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
-- ORDER BY remind_date;

-- 获取宠物的体重趋势
-- SELECT record_date, weight, weight_unit 
-- FROM weight_records 
-- WHERE pet_id = 'xxx' 
-- ORDER BY record_date DESC;
