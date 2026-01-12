-- 修正版：宠物管理系统数据库表结构
-- 解决查询逻辑问题

-- 1. 宠物分类表
CREATE TABLE pet_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    description TEXT,
    icon VARCHAR(10),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 宠物品种基础信息表 (对应 petNavigation.ts 中的数据)
CREATE TABLE pet_breeds (
    id VARCHAR(50) PRIMARY KEY, -- 对应 petNavigation.ts 中的 breed.id，如 'golden', 'poodle'
    name VARCHAR(100) NOT NULL, -- 对应 petNavigation.ts 中的 breed.name，如 '金毛', '贵宾犬'
    name_en VARCHAR(100),
    category_id VARCHAR(50) NOT NULL,
    icon VARCHAR(10), -- 对应 petNavigation.ts 中的 breed.icon
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES pet_categories(id) ON DELETE CASCADE
);

-- 3. 宠物详细信息表 (一对一关系，直接用breed_id作为主键)
CREATE TABLE pet_details (
    breed_id VARCHAR(50) PRIMARY KEY, -- 直接对应 pet_breeds.id，一对一关系
    
    -- 基本特征
    size ENUM('small', 'medium', 'large'),
    weight_min DECIMAL(5,2),
    weight_max DECIMAL(5,2),
    weight_unit VARCHAR(10) DEFAULT 'kg',
    height_min DECIMAL(5,2),
    height_max DECIMAL(5,2),
    height_unit VARCHAR(10) DEFAULT 'cm',
    lifespan_min INT,
    lifespan_max INT,
    activity_level ENUM('low', 'medium', 'high'),
    grooming_needs ENUM('low', 'medium', 'high'),
    
    -- 外观描述
    coat_type VARCHAR(100),
    description TEXT,
    
    -- 饲养信息
    care_difficulty ENUM('easy', 'medium', 'hard'),
    diet_info TEXT,
    feeding_frequency VARCHAR(100),
    special_diet TEXT,
    
    -- 训练信息
    trainability ENUM('low', 'medium', 'high'),
    
    -- 价格信息
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    price_currency VARCHAR(10) DEFAULT 'CNY',
    
    -- 适合人群标识
    suitable_for_beginner BOOLEAN DEFAULT false,
    suitable_for_children BOOLEAN DEFAULT false,
    suitable_for_elderly BOOLEAN DEFAULT false,
    suitable_for_apartments BOOLEAN DEFAULT false,
    suitable_for_busy_owners BOOLEAN DEFAULT false,
    
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 4. 宠物性格特点表 (关联到 breed_id)
CREATE TABLE pet_temperaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL, -- 直接关联到品种ID
    temperament VARCHAR(50) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 5. 宠物毛色表 (关联到 breed_id)
CREATE TABLE pet_coat_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    color_code VARCHAR(10),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 6. 居住空间适应性表
CREATE TABLE pet_living_spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL,
    living_space VARCHAR(100) NOT NULL,
    suitability_score INT CHECK (suitability_score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 7. 常见疾病表
CREATE TABLE pet_common_diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    prevalence ENUM('rare', 'uncommon', 'common', 'very_common'),
    prevention_tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 8. 健康建议表
CREATE TABLE pet_health_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL,
    tip_category ENUM('prevention', 'care', 'nutrition', 'exercise', 'grooming'),
    tip_description TEXT NOT NULL,
    priority_level ENUM('low', 'medium', 'high'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 9. 训练命令表
CREATE TABLE pet_training_commands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL,
    command_name VARCHAR(50) NOT NULL,
    command_type ENUM('basic', 'intermediate', 'advanced'),
    difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 10. 宠物图片表
CREATE TABLE pet_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breed_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'gallery', 'avatar'),
    alt_text VARCHAR(200),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES pet_breeds(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_pet_breeds_category ON pet_breeds(category_id);
CREATE INDEX idx_temperaments_breed ON pet_temperaments(breed_id);
CREATE INDEX idx_coat_colors_breed ON pet_coat_colors(breed_id);
CREATE INDEX idx_images_breed ON pet_images(breed_id);

-- 插入基础数据
INSERT INTO pet_categories (id, name, name_en, icon, display_order) VALUES
('hot', '热宠导航', 'Hot Pets', '🔥', 1),
('dog', '狗狗', 'Dogs', '🐕', 2),
('cat', '猫咪', 'Cats', '🐱', 3),
('small', '小宠', 'Small Pets', '🐹', 4),
('aquatic', '水族', 'Aquatic', '🐟', 5),
('reptile', '爬虫', 'Reptiles', '🦎', 6);

-- 插入品种数据（对应 petNavigation.ts）
INSERT INTO pet_breeds (id, name, name_en, category_id, icon) VALUES
-- 狗狗品种
('golden', '金毛', 'Golden Retriever', 'dog', '🦮'),
('labrador', '拉布拉多犬', 'Labrador Retriever', 'dog', '🦮'),
('poodle', '贵宾犬', 'Poodle', 'dog', '🐩'),
('bichon', '比熊', 'Bichon Frise', 'dog', '🐕'),
('corgi', '威尔士柯基犬', 'Welsh Corgi', 'dog', '🦮'),
('shiba', '柴犬', 'Shiba Inu', 'dog', '🐕‍🦺'),
-- 猫咪品种
('persian', '波斯猫', 'Persian Cat', 'cat', '🐱'),
('ragdoll', '布偶猫', 'Ragdoll', 'cat', '🐈'),
('chinchilla', '金吉拉', 'Chinchilla', 'cat', '🐱');

-- 插入详细信息示例
INSERT INTO pet_details (
    breed_id, size, weight_min, weight_max, height_min, height_max,
    lifespan_min, lifespan_max, activity_level, grooming_needs,
    description, care_difficulty, diet_info, trainability,
    price_min, price_max, suitable_for_beginner, suitable_for_children
) VALUES 
('golden', 'large', 25.0, 32.0, 51, 61, 10, 12, 'high', 'medium',
 '友善温和的大型犬，适合家庭饲养，需要大量运动和社交。', 'easy', '高质量狗粮，避免过量',
 'high', 1500.0, 5000.0, true, true);

-- 插入性格特点
INSERT INTO pet_temperaments (breed_id, temperament, display_order) VALUES
('golden', '友好', 1),
('golden', '聪明', 2),
('golden', '忠诚', 3),
('golden', '温和', 4),
('golden', '活泼', 5);

-- 查询示例：根据品种ID获取完整信息
-- 当用户点击 '金毛' 时，使用 breed_id = 'golden'
/*
SELECT 
    b.id,
    b.name,
    b.name_en,
    b.icon,
    c.name as category_name,
    d.*,
    GROUP_CONCAT(t.temperament) as temperaments
FROM pet_breeds b
JOIN pet_categories c ON b.category_id = c.id
LEFT JOIN pet_details d ON b.id = d.breed_id
LEFT JOIN pet_temperaments t ON b.id = t.breed_id
WHERE b.id = 'golden'
GROUP BY b.id;
*/
