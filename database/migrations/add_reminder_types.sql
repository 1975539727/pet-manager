-- 扩展健康提醒表以支持26种提醒类型
-- Migration: 添加更多提醒类型支持
-- Date: 2026-03-02

-- ============================================
-- 1. 删除旧的CHECK约束
-- ============================================
ALTER TABLE health_reminders
DROP CONSTRAINT IF EXISTS health_reminders_reminder_type_check;

-- ============================================
-- 2. 添加新的CHECK约束，包含所有26种类型
-- ============================================
ALTER TABLE health_reminders
ADD CONSTRAINT health_reminders_reminder_type_check 
CHECK (reminder_type IN (
    -- 医疗类
    'vaccine',          -- 疫苗
    'checkup',          -- 体检
    'deworming',        -- 驱虫
    'surgery',          -- 手术
    'injection',        -- 打针
    'medication',       -- 吃药
    'blood_test',       -- 血检
    'xray',             -- 拍片
    'ultrasound',       -- B超
    'booster',          -- 加强针
    'allergy_test',     -- 过敏测试
    'recheck',          -- 复查
    
    -- 护理美容类
    'bath',             -- 洗澡
    'grooming',         -- 美容
    'nail_trim',        -- 剪指甲
    'ear_cleaning',     -- 清洁耳朵
    'teeth_cleaning',   -- 清洁牙齿
    'dental_care',      -- 洁牙
    'grooming_appointment', -- 美容预约
    
    -- 生活日常类
    'food_change',      -- 换粮
    'weighing',         -- 称重
    'training',         -- 训练
    'boarding',         -- 寄养
    
    -- 生育类
    'breeding',         -- 配种
    'prenatal_checkup', -- 产检
    'neutering',        -- 绝育
    
    -- 自定义
    'custom'            -- 自定义
));

-- ============================================
-- 3. 添加图标和颜色字段（可选，用于前端显示）
-- ============================================
ALTER TABLE health_reminders
ADD COLUMN IF NOT EXISTS reminder_icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS reminder_color VARCHAR(20);

-- ============================================
-- 4. 添加备注说明
-- ============================================
COMMENT ON COLUMN health_reminders.reminder_type IS '提醒类型：疫苗、体检、驱虫等26种类型';
COMMENT ON COLUMN health_reminders.reminder_icon IS '提醒图标（Emoji或图标名称）';
COMMENT ON COLUMN health_reminders.reminder_color IS '提醒颜色（用于UI显示）';

-- ============================================
-- 5. 创建提醒类型映射视图（可选）
-- ============================================
CREATE OR REPLACE VIEW reminder_type_mapping AS
SELECT 
    'vaccine' AS type_code, 
    '疫苗' AS type_name, 
    '📋' AS icon, 
    '#8b5cf6' AS color
UNION ALL SELECT 'checkup', '体检', '💉', '#f97316'
UNION ALL SELECT 'deworming', '驱虫', '🐛', '#ec4899'
UNION ALL SELECT 'bath', '洗澡', '💧', '#6366f1'
UNION ALL SELECT 'grooming', '美容', '✂️', '#a78bfa'
UNION ALL SELECT 'surgery', '手术', '✖️', '#dc2626'
UNION ALL SELECT 'nail_trim', '剪指甲', '✂️', '#a855f7'
UNION ALL SELECT 'ear_cleaning', '清洁耳朵', '👂', '#06b6d4'
UNION ALL SELECT 'teeth_cleaning', '清洁牙齿', '🦷', '#10b981'
UNION ALL SELECT 'food_change', '换粮', '🍽️', '#f97316'
UNION ALL SELECT 'breeding', '配种', '❤️', '#ec4899'
UNION ALL SELECT 'prenatal_checkup', '产检', '🤰', '#a855f7'
UNION ALL SELECT 'neutering', '绝育', '➕', '#78716c'
UNION ALL SELECT 'recheck', '复查', '📋', '#3b82f6'
UNION ALL SELECT 'injection', '打针', '💉', '#06b6d4'
UNION ALL SELECT 'medication', '吃药', '💊', '#10b981'
UNION ALL SELECT 'weighing', '称重', '⚖️', '#6b7280'
UNION ALL SELECT 'blood_test', '血检', '🩸', '#dc2626'
UNION ALL SELECT 'xray', '拍片', '📷', '#4b5563'
UNION ALL SELECT 'ultrasound', 'B超', '📺', '#3b82f6'
UNION ALL SELECT 'dental_care', '洁牙', '🦷', '#06b6d4'
UNION ALL SELECT 'booster', '加强针', '💉', '#84cc16'
UNION ALL SELECT 'allergy_test', '过敏测试', '⚠️', '#a855f7'
UNION ALL SELECT 'grooming_appointment', '美容预约', '📝', '#f97316'
UNION ALL SELECT 'training', '训练', '🎓', '#3b82f6'
UNION ALL SELECT 'boarding', '寄养', '🏠', '#78716c';

-- ============================================
-- 6. 添加示例数据（可选）
-- ============================================

-- 取消注释以下代码来添加示例提醒数据
/*
INSERT INTO health_reminders (
    pet_id,
    reminder_type,
    title,
    description,
    remind_date,
    reminder_icon,
    reminder_color,
    is_completed,
    is_active
) VALUES (
    'YOUR_PET_ID_HERE',
    'vaccine',
    '狂犬病疫苗',
    '一年一次的狂犬病疫苗接种',
    CURRENT_DATE + INTERVAL '7 days',
    '📋',
    '#8b5cf6',
    false,
    true
);
*/

-- ============================================
-- 验证脚本
-- ============================================

-- 查看所有提醒类型
-- SELECT * FROM reminder_type_mapping ORDER BY type_name;

-- 查询特定宠物的提醒
-- SELECT 
--     hr.*,
--     rtm.type_name,
--     rtm.icon,
--     rtm.color
-- FROM health_reminders hr
-- LEFT JOIN reminder_type_mapping rtm ON hr.reminder_type = rtm.type_code
-- WHERE hr.pet_id = 'YOUR_PET_ID'
-- ORDER BY hr.remind_date;
