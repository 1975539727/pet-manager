-- ============================================
-- 宠物提醒事项表
-- ============================================
-- 用于管理宠物的各种待办事项和提醒
-- 支持26种提醒类型：疫苗、体检、驱虫、洗澡等

CREATE TABLE IF NOT EXISTS pet_reminders (
    -- 主键
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 关联宠物（外键）
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    
    -- 记录名称（例如：狂犬病疫苗）
    title VARCHAR(200) NOT NULL,
    
    -- 类型（26种预定义类型）
    reminder_type VARCHAR(30) NOT NULL CHECK (reminder_type IN (
        'vaccine',              -- 疫苗
        'checkup',              -- 体检
        'deworming',            -- 驱虫
        'bath',                 -- 洗澡
        'grooming',             -- 美容
        'surgery',              -- 手术
        'nail_trim',            -- 剪指甲
        'ear_cleaning',         -- 清洁耳朵
        'teeth_cleaning',       -- 清洁牙齿
        'food_change',          -- 换粮
        'breeding',             -- 配种
        'prenatal_checkup',     -- 产检
        'neutering',            -- 绝育
        'recheck',              -- 复查
        'injection',            -- 打针
        'medication',           -- 吃药
        'weighing',             -- 称重
        'blood_test',           -- 血检
        'xray',                 -- 拍片
        'ultrasound',           -- B超
        'dental_care',          -- 洁牙
        'booster',              -- 加强针
        'allergy_test',         -- 过敏测试
        'grooming_appointment', -- 美容预约
        'training',             -- 训练
        'boarding'              -- 寄养
    )),
    
    -- 计划日期
    scheduled_date DATE NOT NULL,
    
    -- 备注（可选）：预约医院、注意事项等
    notes TEXT,
    
    -- 完成状态
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 创建索引
-- ============================================
CREATE INDEX idx_pet_reminders_pet_id ON pet_reminders(pet_id);
CREATE INDEX idx_pet_reminders_date ON pet_reminders(scheduled_date DESC);
CREATE INDEX idx_pet_reminders_type ON pet_reminders(reminder_type);
CREATE INDEX idx_pet_reminders_completed ON pet_reminders(is_completed);

-- ============================================
-- 自动更新时间戳触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_pet_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_pet_reminders_updated_at
    BEFORE UPDATE ON pet_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_pet_reminders_updated_at();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================
ALTER TABLE pet_reminders ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己宠物的提醒
CREATE POLICY "Users can view their pets' reminders"
    ON pet_reminders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_reminders.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- 用户只能为自己的宠物创建提醒
CREATE POLICY "Users can create reminders for their pets"
    ON pet_reminders FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_reminders.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- 用户只能更新自己宠物的提醒
CREATE POLICY "Users can update their pets' reminders"
    ON pet_reminders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_reminders.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- 用户只能删除自己宠物的提醒
CREATE POLICY "Users can delete their pets' reminders"
    ON pet_reminders FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_reminders.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- ============================================
-- 提醒类型配置数据（用于前端显示）
-- ============================================
CREATE TABLE IF NOT EXISTS reminder_types (
    type_code VARCHAR(30) PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(20) NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 插入26种提醒类型配置
INSERT INTO reminder_types (type_code, type_name, icon, color, display_order) VALUES
    ('vaccine', '疫苗', '📋', '#8b5cf6', 1),
    ('checkup', '体检', '💉', '#f97316', 2),
    ('deworming', '驱虫', '🐛', '#ec4899', 3),
    ('bath', '洗澡', '💧', '#6366f1', 4),
    ('grooming', '美容', '✂️', '#a78bfa', 5),
    ('surgery', '手术', '✖️', '#dc2626', 6),
    ('nail_trim', '剪指甲', '✂️', '#a855f7', 7),
    ('ear_cleaning', '清洁耳朵', '👂', '#06b6d4', 8),
    ('teeth_cleaning', '清洁牙齿', '🦷', '#10b981', 9),
    ('food_change', '换粮', '🍽️', '#f97316', 10),
    ('breeding', '配种', '❤️', '#ec4899', 11),
    ('prenatal_checkup', '产检', '🤰', '#a855f7', 12),
    ('neutering', '绝育', '➕', '#78716c', 13),
    ('recheck', '复查', '📋', '#3b82f6', 14),
    ('injection', '打针', '💉', '#06b6d4', 15),
    ('medication', '吃药', '💊', '#10b981', 16),
    ('weighing', '称重', '⚖️', '#6b7280', 17),
    ('blood_test', '血检', '🩸', '#dc2626', 18),
    ('xray', '拍片', '📷', '#4b5563', 19),
    ('ultrasound', 'B超', '📺', '#3b82f6', 20),
    ('dental_care', '洁牙', '🦷', '#06b6d4', 21),
    ('booster', '加强针', '💉', '#84cc16', 22),
    ('allergy_test', '过敏测试', '⚠️', '#a855f7', 23),
    ('grooming_appointment', '美容预约', '📝', '#f97316', 24),
    ('training', '训练', '🎓', '#3b82f6', 25),
    ('boarding', '寄养', '🏠', '#78716c', 26)
ON CONFLICT (type_code) DO NOTHING;

-- ============================================
-- 示例查询
-- ============================================

-- 1. 获取某个宠物的待办提醒
/*
SELECT 
    r.*,
    t.type_name,
    t.icon,
    t.color
FROM pet_reminders r
LEFT JOIN reminder_types t ON r.reminder_type = t.type_code
WHERE r.pet_id = 'YOUR_PET_ID'
AND r.is_completed = false
ORDER BY r.scheduled_date ASC;
*/

-- 2. 获取某个宠物的历史记录
/*
SELECT 
    r.*,
    t.type_name,
    t.icon,
    t.color
FROM pet_reminders r
LEFT JOIN reminder_types t ON r.reminder_type = t.type_code
WHERE r.pet_id = 'YOUR_PET_ID'
AND r.is_completed = true
ORDER BY r.completed_at DESC;
*/

-- 3. 获取即将到来的提醒（未来7天）
/*
SELECT 
    r.*,
    t.type_name,
    t.icon,
    t.color
FROM pet_reminders r
LEFT JOIN reminder_types t ON r.reminder_type = t.type_code
WHERE r.pet_id = 'YOUR_PET_ID'
AND r.is_completed = false
AND r.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY r.scheduled_date ASC;
*/

-- 4. 插入新提醒
/*
INSERT INTO pet_reminders (
    pet_id,
    title,
    reminder_type,
    scheduled_date,
    notes
) VALUES (
    'YOUR_PET_ID',
    '狂犬病疫苗',
    'vaccine',
    '2026-03-10',
    '预约了XX宠物医院'
);
*/

-- 5. 标记提醒为已完成
/*
UPDATE pet_reminders
SET 
    is_completed = true,
    completed_at = CURRENT_TIMESTAMP
WHERE id = 'YOUR_REMINDER_ID';
*/

-- ============================================
-- 表说明
-- ============================================
COMMENT ON TABLE pet_reminders IS '宠物提醒事项表';
COMMENT ON COLUMN pet_reminders.title IS '记录名称，例如：狂犬病疫苗';
COMMENT ON COLUMN pet_reminders.reminder_type IS '提醒类型：疫苗、体检、驱虫等26种';
COMMENT ON COLUMN pet_reminders.scheduled_date IS '计划日期';
COMMENT ON COLUMN pet_reminders.notes IS '备注：预约医院、注意事项等';
COMMENT ON COLUMN pet_reminders.is_completed IS '是否已完成';
COMMENT ON COLUMN pet_reminders.completed_at IS '完成时间';
