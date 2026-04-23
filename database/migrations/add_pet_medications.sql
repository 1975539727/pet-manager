-- ============================================
-- 宠物用药计划表
-- ============================================
-- 用于管理宠物的用药计划和提醒
-- 字段来源于前端新增用药计划表单

CREATE TABLE IF NOT EXISTS pet_medications (
    -- 主键
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 关联宠物（外键）
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    
    -- 用药名称（必填，例如：驱虫药、消炎药）
    medication_name VARCHAR(200) NOT NULL,
    
    -- 剂量（可选）
    dosage DECIMAL(10, 2),
    
    -- 剂量单位（可选，例如：mg、ml、片等）
    dosage_unit VARCHAR(20),
    
    -- 开始日期
    start_date DATE NOT NULL,
    
    -- 提醒时间（时:分）
    reminder_time TIME,
    
    -- 重复设置：不重复、每天、每周、每月
    repeat_type VARCHAR(10) NOT NULL DEFAULT 'none' CHECK (repeat_type IN (
        'none',     -- 不重复
        'daily',    -- 每天
        'weekly',   -- 每周
        'monthly'   -- 每月
    )),
    
    -- 备注（可选，例如：空腹服用或搭配食物）
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
CREATE INDEX idx_pet_medications_pet_id ON pet_medications(pet_id);
CREATE INDEX idx_pet_medications_start_date ON pet_medications(start_date DESC);
CREATE INDEX idx_pet_medications_completed ON pet_medications(is_completed);
CREATE INDEX idx_pet_medications_repeat ON pet_medications(repeat_type);

-- ============================================
-- 自动更新时间戳触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_pet_medications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_pet_medications_updated_at
    BEFORE UPDATE ON pet_medications
    FOR EACH ROW
    EXECUTE FUNCTION update_pet_medications_updated_at();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================
ALTER TABLE pet_medications ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己宠物的用药计划
CREATE POLICY "Users can view their pets medications"
    ON pet_medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_medications.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- 用户只能为自己的宠物创建用药计划
CREATE POLICY "Users can create medications for their pets"
    ON pet_medications FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_medications.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- 用户只能更新自己宠物的用药计划
CREATE POLICY "Users can update their pets medications"
    ON pet_medications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_medications.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- 用户只能删除自己宠物的用药计划
CREATE POLICY "Users can delete their pets medications"
    ON pet_medications FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_pets
            WHERE user_pets.id = pet_medications.pet_id
            AND user_pets.user_id = auth.uid()
        )
    );

-- ============================================
-- 示例查询
-- ============================================

-- 1. 获取某个宠物的待办用药计划
/*
SELECT * FROM pet_medications
WHERE pet_id = 'YOUR_PET_ID'
AND is_completed = false
ORDER BY start_date ASC, reminder_time ASC;
*/

-- 2. 获取某个宠物的历史用药记录
/*
SELECT * FROM pet_medications
WHERE pet_id = 'YOUR_PET_ID'
AND is_completed = true
ORDER BY completed_at DESC;
*/

-- 3. 插入新用药计划
/*
INSERT INTO pet_medications (
    pet_id,
    medication_name,
    dosage,
    dosage_unit,
    start_date,
    reminder_time,
    repeat_type,
    notes
) VALUES (
    'YOUR_PET_ID',
    '驱虫药',
    5,
    'ml',
    '2026-04-18',
    '19:27',
    'none',
    '空腹服用或搭配食物'
);
*/

-- 4. 标记用药计划为已完成
/*
UPDATE pet_medications
SET 
    is_completed = true,
    completed_at = CURRENT_TIMESTAMP
WHERE id = 'YOUR_MEDICATION_ID';
*/

-- ============================================
-- 表说明
-- ============================================
COMMENT ON TABLE pet_medications IS '宠物用药计划表';
COMMENT ON COLUMN pet_medications.medication_name IS '用药名称，例如：驱虫药、消炎药';
COMMENT ON COLUMN pet_medications.dosage IS '剂量数值（可选）';
COMMENT ON COLUMN pet_medications.dosage_unit IS '剂量单位（可选），如：mg、ml、片';
COMMENT ON COLUMN pet_medications.start_date IS '开始日期';
COMMENT ON COLUMN pet_medications.reminder_time IS '提醒时间';
COMMENT ON COLUMN pet_medications.repeat_type IS '重复设置：none不重复、daily每天、weekly每周、monthly每月';
COMMENT ON COLUMN pet_medications.notes IS '备注（可选），例如：空腹服用或搭配食物';
COMMENT ON COLUMN pet_medications.is_completed IS '是否已完成';
COMMENT ON COLUMN pet_medications.completed_at IS '完成时间';
