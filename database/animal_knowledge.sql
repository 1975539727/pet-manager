-- ============================================
-- 动物世界-今日小知识表
-- ============================================
-- 用于存储每日推送的动物科普知识
-- 发布时间为每天早上8点随机分钟
-- 只有到了发布时间才会显示给用户

CREATE TABLE IF NOT EXISTS animal_knowledge (
    -- 主键
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 发布时间（每天早上8点多，具体分钟随机）
    publish_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- 知识内容
    content TEXT NOT NULL,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 确保同一时间不会有重复记录
    CONSTRAINT unique_publish_datetime UNIQUE (publish_datetime)
);

-- ============================================
-- 创建索引
-- ============================================
CREATE INDEX idx_animal_knowledge_publish_datetime ON animal_knowledge(publish_datetime DESC);
CREATE INDEX idx_animal_knowledge_created_at ON animal_knowledge(created_at DESC);

-- ============================================
-- 自动更新时间戳触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_animal_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_animal_knowledge_updated_at
    BEFORE UPDATE ON animal_knowledge
    FOR EACH ROW
    EXECUTE FUNCTION update_animal_knowledge_updated_at();

-- ============================================
-- 示例数据
-- ============================================
-- 发布时间为每天早上8点多，具体分钟随机（如：08:07, 08:04, 08:02等）
INSERT INTO animal_knowledge (
    publish_datetime, 
    content
) VALUES
    -- 2026年3月26日 08:07
    (
        '2026-03-26 08:07:00+08',
        '裸狐蝠是一种生活在非洲的蝙蝠，它们翅膀大、脸部像小狗，被称为"狐面飞鼠"。裸狐蝠喜欢双群居，能形成数万只的庞大蝙蝠洞群，是夜空中令副其实的"空中大部队"！'
    ),
    -- 2026年3月25日 08:04
    (
        '2026-03-25 08:04:00+08',
        '蟹守螺是一种生活在热带海洋里的小型贝类，它们会紧紧吸附在寄主螃蟹的壳上，靠吸食螃蟹落的食物残渣为生。更有趣的是，蟹守螺常常会随螃蟹一起移动，被称为"螃蟹的小尾巴"，是海洋底世界里的"专职跟班"！'
    ),
    -- 2026年3月24日 08:02
    (
        '2026-03-24 08:02:00+08',
        '鳞蝥虾是一种生活在热带海洋里的小型甲壳动物，别看它个头不大，挥出的"拳击"速度却能超过子弹，还可瞬间击碎坚硬螺壳极破璃！科学家称它为"海底拳王"，它的复眼还能分辨人类无法察觉的极端色彩，是海洋里最力量与视觉于一身的超级英雄。'
    ),
    -- 2026年3月23日 08:09
    (
        '2026-03-23 08:09:00+08',
        '蜂鸟是世界上最小的鸟类，体重只有2克左右。它们的翅膀每秒可以扇动80次，能够在空中悬停，甚至向后飞行。蜂鸟的心跳速度惊人，每分钟可达1200次！'
    );

-- ============================================
-- 示例查询
-- ============================================

-- 1. 获取今日小知识（只显示已到发布时间的）
/*
SELECT *
FROM animal_knowledge
WHERE DATE(publish_datetime) = CURRENT_DATE
AND publish_datetime <= CURRENT_TIMESTAMP
ORDER BY publish_datetime DESC
LIMIT 1;
*/

-- 2. 获取最近7天的小知识（只显示已发布的）
/*
SELECT *
FROM animal_knowledge
WHERE publish_datetime >= CURRENT_DATE - INTERVAL '7 days'
AND publish_datetime <= CURRENT_TIMESTAMP
ORDER BY publish_datetime DESC;
*/

-- 3. 搜索内容
/*
SELECT *
FROM animal_knowledge
WHERE content ILIKE '%蜂鸟%'
AND publish_datetime <= CURRENT_TIMESTAMP
ORDER BY publish_datetime DESC;
*/

-- 4. 插入新的小知识（时间为明天早上8点随机分钟，例如：08:15）
/*
INSERT INTO animal_knowledge (
    publish_datetime,
    content
) VALUES (
    '2026-03-27 08:15:00+08',
    '树懒是世界上移动最慢的哺乳动物，它们每天只移动约40米。由于移动缓慢，树懒的毛发上常常长满藻类，这让它们在树林中拥有了天然的伪装色！'
);
*/

-- 5. 批量插入未来7天的小知识（每天8点随机分钟）
/*
INSERT INTO animal_knowledge (publish_datetime, content) VALUES
    ('2026-03-27 08:15:00+08', '树懒是世界上移动最慢的哺乳动物...'),
    ('2026-03-28 08:23:00+08', '考拉每天睡眠时间长达18-22小时...'),
    ('2026-03-29 08:07:00+08', '蓝鲸是地球上已知最大的动物...'),
    ('2026-03-30 08:41:00+08', '章鱼有三颗心脏和蓝色的血液...'),
    ('2026-03-31 08:18:00+08', '企鹅是唯一不会飞的鸟类之一...');
*/

-- ============================================
-- 表说明
-- ============================================
COMMENT ON TABLE animal_knowledge IS '动物世界-今日小知识表，每天早上8点多随机分钟发布';
COMMENT ON COLUMN animal_knowledge.publish_datetime IS '发布日期时间（每天早上8点多，具体分钟随机）';
COMMENT ON COLUMN animal_knowledge.content IS '知识内容';
