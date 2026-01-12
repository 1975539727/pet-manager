-- MySQL版本的宠物数据插入语句
-- 适配MySQL 5.7+ / MySQL 8.0+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. 插入宠物分类数据 (pet_categories)
-- ============================================
INSERT INTO `pet_categories` (`id`, `name`, `name_en`, `icon`, `display_order`, `is_active`) VALUES
('hot', '热宠导航', 'Hot Pets', '🔥', 1, 0),
('dog', '狗狗', 'Dogs', '🐕', 2, 1),
('cat', '猫咪', 'Cats', '🐱', 3, 0),
('small', '小宠', 'Small Pets', '🐹', 4, 0),
('aquatic', '水族', 'Aquatic', '🐟', 5, 0),
('reptile', '爬虫', 'Reptiles', '🦎', 6, 0);

-- ============================================
-- 2. 插入宠物品种数据 (pet_breeds)
-- ============================================

-- 狗狗品种 (17个品种)
INSERT INTO `pet_breeds` (`id`, `name`, `name_en`, `category_id`, `icon`, `display_order`) VALUES
('poodle', '贵宾犬', 'Poodle', 'dog', '🐩', 1),
('bichon', '比熊', 'Bichon Frise', 'dog', '🐕', 2),
('pomeranian', '博美', 'Pomeranian', 'dog', '🦮', 3),
('schnauzer', '雪纳瑞', 'Schnauzer', 'dog', '🐕‍🦺', 4),
('yorkshire', '约克夏梗', 'Yorkshire Terrier', 'dog', '🐶', 5),
('maltese', '马尔济斯犬', 'Maltese', 'dog', '🐕', 6),
('corgi', '威尔士柯基犬', 'Welsh Corgi', 'dog', '🦮', 7),
('shiba', '柴犬', 'Shiba Inu', 'dog', '🐕‍🦺', 8),
('border', '边牧', 'Border Collie', 'dog', '🐶', 9),
('german_shepherd', '德国牧羊犬', 'German Shepherd', 'dog', '🐕', 10),
('golden', '金毛', 'Golden Retriever', 'dog', '🦮', 11),
('chow', '松狮犬', 'Chow Chow', 'dog', '🐕‍🦺', 12),
('french_bulldog', '法国斗牛犬', 'French Bulldog', 'dog', '🐶', 13),
('samoyed', '萨摩耶犬', 'Samoyed', 'dog', '🐕', 14),
('labrador', '拉布拉多犬', 'Labrador Retriever', 'dog', '🦮', 15),
('husky', '哈士奇', 'Siberian Husky', 'dog', '🐕‍🦺', 16),
('rottweiler', '罗威纳犬', 'Rottweiler', 'dog', '🐶', 17);

-- 猫咪品种 (17个品种)  
INSERT INTO `pet_breeds` (`id`, `name`, `name_en`, `category_id`, `icon`, `display_order`) VALUES
('chinchilla_cat', '金吉拉', 'Chinchilla Cat', 'cat', '🐱', 1),
('silver_tabby', '银虎斑', 'Silver Tabby', 'cat', '🐈', 2),
('orange_cat', '橘猫', 'Orange Cat', 'cat', '🐱', 3),
('russian_blue', '俄短', 'Russian Blue', 'cat', '🐈', 4),
('american_shorthair', '美短', 'American Shorthair', 'cat', '🐱', 5),
('abyssinian', '阿比西尼亚猫', 'Abyssinian', 'cat', '🐈', 6),
('oriental_shorthair', '东方短毛猫', 'Oriental Shorthair', 'cat', '🐱', 7),
('selkirk_rex', '塞尔凯克卷毛猫', 'Selkirk Rex', 'cat', '🐈', 8),
('exotic_shorthair', '异国短毛猫', 'Exotic Shorthair', 'cat', '🐱', 9),
('lykoi', '狼猫', 'Lykoi', 'cat', '🐈', 10),
('cornish_rex', '康沃尔卷毛猫', 'Cornish Rex', 'cat', '🐱', 11),
('ragdoll', '布偶猫', 'Ragdoll', 'cat', '🐈', 12),
('devon_rex', '德文卷毛猫', 'Devon Rex', 'cat', '🐱', 13),
('exotic_longhair', '异国长毛猫', 'Exotic Longhair', 'cat', '🐈', 14),
('persian', '波斯猫', 'Persian', 'cat', '🐱', 15),
('scottish_fold', '苏格兰折耳猫', 'Scottish Fold', 'cat', '🐈', 16),
('turkish_angora', '土耳其安哥拉猫', 'Turkish Angora', 'cat', '🐱', 17);

-- 小宠品种 (17个品种)
INSERT INTO `pet_breeds` (`id`, `name`, `name_en`, `category_id`, `icon`, `display_order`) VALUES
('hamster', '仓鼠', 'Hamster', 'small', '🐹', 1),
('guinea_pig', '豚鼠', 'Guinea Pig', 'small', '🐭', 2),
('netherland_dwarf', '荷兰侏儒兔', 'Netherland Dwarf', 'small', '🐰', 3),
('lop_rabbit', '垂耳兔', 'Lop Rabbit', 'small', '🐇', 4),
('squirrel', '松鼠', 'Squirrel', 'small', '🐿️', 5),
('sea_rabbit', '海兔', 'Sea Rabbit', 'small', '🐰', 6),
('angora_rabbit', '安哥拉兔', 'Angora Rabbit', 'small', '🐇', 7),
('hedgehog', '刺猬', 'Hedgehog', 'small', '🦔', 8),
('golden_hamster', '黄金仓鼠', 'Golden Hamster', 'small', '🐹', 9),
('chinchilla_small', '毛丝鼠', 'Chinchilla', 'small', '🐭', 10),
('mini_pig', '迷你猪', 'Mini Pig', 'small', '🐷', 11),
('sugar_glider', '蜜袋鼯', 'Sugar Glider', 'small', '🐨', 12),
('djungarian_hamster', '三线仓鼠', 'Djungarian Hamster', 'small', '🐹', 13),
('campbell_hamster', '坎贝尔仓鼠', 'Campbell Hamster', 'small', '🐭', 14),
('fancy_rat', '花枝鼠', 'Fancy Rat', 'small', '🐀', 15),
('roborovski_hamster', '罗伯罗夫斯基仓鼠', 'Roborovski Hamster', 'small', '🐹', 16),
('dwarf_rabbit', '侏儒兔', 'Dwarf Rabbit', 'small', '🐰', 17);

-- 水族品种 (17个品种)
INSERT INTO `pet_breeds` (`id`, `name`, `name_en`, `category_id`, `icon`, `display_order`) VALUES
('koi', '锦鲤', 'Koi', 'aquatic', '🐟', 1),
('arowana', '龙鱼', 'Arowana', 'aquatic', '🐠', 2),
('clownfish', '小丑鱼', 'Clownfish', 'aquatic', '🐠', 3),
('betta', '斗鱼', 'Betta', 'aquatic', '🐟', 4),
('flowerhorn', '罗汉鱼', 'Flowerhorn', 'aquatic', '🐠', 5),
('parrotfish', '鹦鹉鱼', 'Parrotfish', 'aquatic', '🐟', 6),
('silver_dollar', '银板鱼', 'Silver Dollar', 'aquatic', '🐠', 7),
('golden_crab', '黄金蟹', 'Golden Crab', 'aquatic', '🦀', 8),
('brazilian_turtle', '巴西龟', 'Brazilian Turtle', 'aquatic', '🐢', 9),
('seahorse', '海马', 'Seahorse', 'aquatic', '🐠', 10),
('sea_urchin', '海胆', 'Sea Urchin', 'aquatic', '🦔', 11),
('pea_crab', '豌豆蟹', 'Pea Crab', 'aquatic', '🦀', 12),
('ceramic_fish', '陶瓷鱼', 'Ceramic Fish', 'aquatic', '🐟', 13),
('crystal_shrimp', '水晶虾', 'Crystal Shrimp', 'aquatic', '🦐', 14),
('razorfish', '剃刀鱼', 'Razorfish', 'aquatic', '🐠', 15),
('peacock_eel', '孔雀鳗', 'Peacock Eel', 'aquatic', '🐟', 16),
('goldfish', '金鱼', 'Goldfish', 'aquatic', '🐟', 17);

-- 爬虫品种 (17个品种)
INSERT INTO `pet_breeds` (`id`, `name`, `name_en`, `category_id`, `icon`, `display_order`) VALUES
('bearded_dragon', '鬃狮蜥', 'Bearded Dragon', 'reptile', '🦎', 1),
('black_mamba', '黑曼巴蛇', 'Black Mamba', 'reptile', '🐍', 2),
('chameleon', '变色龙', 'Chameleon', 'reptile', '🦎', 3),
('red_eye_tree_frog', '红眼树蛙', 'Red Eye Tree Frog', 'reptile', '🐸', 4),
('mexican_redknee', '墨西哥红膝蜘蛛', 'Mexican Redknee', 'reptile', '🕷️', 5),
('bamboo_viper', '竹叶青蛇', 'Bamboo Viper', 'reptile', '🐍', 6),
('red_scorpion', '红蝎', 'Red Scorpion', 'reptile', '🦂', 7),
('burmese_python', '缅甸蟒', 'Burmese Python', 'reptile', '🐍', 8),
('leopard_gecko', '豹纹守宫', 'Leopard Gecko', 'reptile', '🦎', 9),
('water_monitor', '水巨蜥', 'Water Monitor', 'reptile', '🦎', 10),
('three_line_snake', '三线蛇', 'Three Line Snake', 'reptile', '🐍', 11),
('anaconda', '森蚺', 'Anaconda', 'reptile', '🐍', 12),
('pig_nose', '猪鼻龟', 'Pig Nose Turtle', 'reptile', '🐢', 13),
('albino_python', '白化蟒', 'Albino Python', 'reptile', '🐍', 14),
('tokay_gecko', '大壁虎', 'Tokay Gecko', 'reptile', '🦎', 15),
('corn_snake', '玉米蛇', 'Corn Snake', 'reptile', '🐍', 16),
('green_tree_python', '绿树蟒', 'Green Tree Python', 'reptile', '🐍', 17);

-- ============================================
-- 3. 插入热门宠物详细信息 (pet_details)
-- ============================================

-- 狗狗详细信息
INSERT INTO `pet_details` (
    `breed_id`, `size`, `weight_min`, `weight_max`, `height_min`, `height_max`,
    `lifespan_min`, `lifespan_max`, `activity_level`, `grooming_needs`,
    `description`, `care_difficulty`, `diet_info`, `trainability`,
    `price_min`, `price_max`, `suitable_for_beginner`, `suitable_for_children`,
    `suitable_for_elderly`, `suitable_for_apartments`, `suitable_for_busy_owners`,
    `data_source`, `is_verified`
) VALUES 
-- 金毛寻回犬
('golden', 'large', 25.0, 32.0, 51, 61, 10, 12, 'high', 'medium',
 '友善温和的大型犬，非常适合家庭饲养，智商高，易训练，需要大量运动和社交。', 'easy', '高质量狗粮，注意控制体重',
 'high', 1500.0, 5000.0, 1, 1, 0, 0, 0, '专业宠物百科', 1),

-- 拉布拉多犬
('labrador', 'large', 25.0, 36.0, 55, 62, 10, 14, 'high', 'medium',
 '温和友善，精力充沛，是出色的家庭伴侣犬和工作犬。', 'easy', '营养均衡的商业狗粮',
 'high', 1200.0, 4000.0, 1, 1, 0, 0, 0, '专业宠物百科', 1),

-- 贵宾犬
('poodle', 'medium', 4.0, 32.0, 24, 62, 12, 15, 'medium', 'high',
 '聪明优雅，毛发卷曲不易掉毛，适合对毛发过敏的家庭。', 'medium', '优质狗粮，定期美容',
 'high', 2000.0, 8000.0, 1, 1, 1, 1, 0, '专业宠物百科', 1),

-- 柯基犬
('corgi', 'medium', 9.0, 15.0, 25, 30, 12, 15, 'medium', 'medium',
 '短腿长身，性格活泼，原为牧羊犬，需要适量运动。', 'easy', '控制食量，防止肥胖',
 'high', 2000.0, 6000.0, 1, 1, 0, 1, 0, '专业宠物百科', 1),

-- 柴犬
('shiba', 'medium', 8.0, 11.0, 35, 43, 13, 16, 'medium', 'medium',
 '独立性强，忠诚但有主见，需要早期社交训练。', 'medium', '优质狗粮，定量喂食',
 'medium', 3000.0, 10000.0, 0, 1, 0, 1, 0, '专业宠物百科', 1),

-- 比熊犬
('bichon', 'small', 5.0, 10.0, 23, 30, 14, 15, 'medium', 'high',
 '毛发白色蓬松，性格活泼友善，适合家庭饲养。', 'medium', '优质小型犬粮',
 'medium', 1500.0, 4000.0, 1, 1, 1, 1, 0, '专业宠物百科', 1);

-- 猫咪详细信息
INSERT INTO `pet_details` (
    `breed_id`, `size`, `weight_min`, `weight_max`, `lifespan_min`, `lifespan_max`,
    `activity_level`, `grooming_needs`, `description`, `care_difficulty`,
    `diet_info`, `price_min`, `price_max`, `suitable_for_beginner`,
    `suitable_for_children`, `suitable_for_elderly`, `suitable_for_apartments`, 
    `suitable_for_busy_owners`, `data_source`, `is_verified`
) VALUES
-- 布偶猫
('ragdoll', 'large', 4.5, 9.0, 13, 17, 'low', 'high',
 '性格温顺如布偶，毛发长而柔软，需要定期梳理，适合室内饲养。', 'easy',
 '高质量猫粮，充足饮水', 3000.0, 15000.0, 1, 1, 1, 1, 1, '专业宠物百科', 1),

-- 波斯猫  
('persian', 'medium', 3.0, 5.5, 12, 17, 'low', 'high',
 '优雅高贵，面部扁平，毛发浓密，需要每日梳理和眼部护理。', 'medium',
 '优质猫粮，注意毛球问题', 2000.0, 8000.0, 0, 1, 1, 1, 0, '专业宠物百科', 1),

-- 美国短毛猫
('american_shorthair', 'medium', 3.0, 7.0, 13, 17, 'medium', 'low',
 '健康强壮，性格友善，易于照料，是理想的家庭宠物。', 'easy',
 '均衡营养的商业猫粮', 1000.0, 3000.0, 1, 1, 1, 1, 1, '专业宠物百科', 1),

-- 英国短毛猫
('russian_blue', 'medium', 3.0, 6.0, 12, 16, 'medium', 'low',
 '性格安静，毛色呈蓝灰色，眼睛为绿色，比较独立。', 'easy',
 '高质量猫粮', 2000.0, 6000.0, 1, 0, 1, 1, 1, '专业宠物百科', 1);

-- 小宠详细信息  
INSERT INTO `pet_details` (
    `breed_id`, `size`, `weight_min`, `weight_max`, `lifespan_min`, `lifespan_max`,
    `activity_level`, `grooming_needs`, `description`, `care_difficulty`,
    `diet_info`, `price_min`, `price_max`, `suitable_for_beginner`,
    `suitable_for_children`, `suitable_for_apartments`, `suitable_for_busy_owners`,
    `data_source`, `is_verified`
) VALUES
-- 仓鼠
('hamster', 'small', 0.02, 0.15, 2, 3, 'high', 'low',
 '小巧可爱，夜行性动物，容易饲养，适合初学者。', 'easy',
 '仓鼠专用粮食和新鲜蔬果', 10.0, 50.0, 1, 1, 1, 1, '专业宠物百科', 1),

-- 荷兰侏儒兔
('netherland_dwarf', 'small', 0.5, 1.2, 8, 12, 'medium', 'medium',
 '体型迷你，耳朵短小，性格活泼，需要适当的运动空间。', 'medium',
 '兔粮配合干草和蔬菜', 200.0, 800.0, 1, 1, 1, 0, '专业宠物百科', 1),

-- 刺猬
('hedgehog', 'small', 0.3, 0.8, 3, 8, 'medium', 'low',
 '夜行性动物，可爱独特，需要保持温度，比较安静。', 'medium',
 '刺猬专用饲料配合昆虫', 300.0, 1000.0, 0, 0, 1, 1, '专业宠物百科', 1);

-- 水族详细信息
INSERT INTO `pet_details` (
    `breed_id`, `size`, `lifespan_min`, `lifespan_max`, `activity_level`,
    `grooming_needs`, `description`, `care_difficulty`, `diet_info`,
    `price_min`, `price_max`, `suitable_for_beginner`, `suitable_for_apartments`, 
    `suitable_for_busy_owners`, `data_source`, `is_verified`
) VALUES
-- 金鱼
('goldfish', 'small', 5, 20, 'low', 'low',
 '最常见的观赏鱼，易于饲养，对水质要求不高。', 'easy',
 '鱼粮，定期换水', 5.0, 100.0, 1, 1, 1, '专业宠物百科', 1),

-- 斗鱼
('betta', 'small', 2, 5, 'medium', 'low',
 '色彩艳丽，但具有攻击性，不能与其他斗鱼混养。', 'easy',
 '斗鱼专用饲料', 20.0, 200.0, 1, 1, 1, '专业宠物百科', 1),

-- 锦鲤
('koi', 'large', 20, 70, 'medium', 'medium',
 '观赏价值极高的大型鱼类，寓意吉祥，需要大型鱼池。', 'hard',
 '专业锦鲤饲料', 100.0, 10000.0, 0, 0, 0, '专业宠物百科', 1);

-- ============================================
-- 4. 插入性格特点数据示例
-- ============================================
INSERT INTO `pet_temperaments` (`breed_id`, `temperament`, `display_order`) VALUES
-- 金毛性格
('golden', '友好', 1),
('golden', '聪明', 2),
('golden', '忠诚', 3),
('golden', '温和', 4),
('golden', '活泼', 5),
-- 布偶猫性格  
('ragdoll', '温顺', 1),
('ragdoll', '亲人', 2),
('ragdoll', '安静', 3),
('ragdoll', '友善', 4),
-- 柯基犬性格
('corgi', '活泼', 1),
('corgi', '聪明', 2),
('corgi', '忠诚', 3),
('corgi', '警觉', 4),
-- 柴犬性格
('shiba', '独立', 1),
('shiba', '忠诚', 2),
('shiba', '警觉', 3),
('shiba', '干净', 4);

-- ============================================
-- 5. 插入毛色数据示例
-- ============================================
INSERT INTO `pet_coat_colors` (`breed_id`, `color`, `display_order`) VALUES
-- 金毛毛色
('golden', '浅金色', 1),
('golden', '金色', 2),
('golden', '深金色', 3),
-- 拉布拉多毛色
('labrador', '黄色', 1),
('labrador', '黑色', 2),
('labrador', '巧克力色', 3),
-- 柯基毛色
('corgi', '红色', 1),
('corgi', '三色', 2),
('corgi', '黑白', 3);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 6. 查询验证语句
-- ============================================

-- 验证数据插入数量
/*
SELECT 
    (SELECT COUNT(*) FROM `pet_categories`) as `categories_count`,
    (SELECT COUNT(*) FROM `pet_breeds`) as `breeds_count`, 
    (SELECT COUNT(*) FROM `pet_details`) as `details_count`,
    (SELECT COUNT(*) FROM `pet_temperaments`) as `temperaments_count`;

-- 查询金毛的完整信息
SELECT 
    b.`id`,
    b.`name`,
    b.`name_en`,
    b.`icon`,
    c.`name` as `category_name`,
    d.`description`,
    d.`care_difficulty`,
    d.`price_min`,
    d.`price_max`,
    GROUP_CONCAT(t.`temperament` ORDER BY t.`display_order`) as `temperaments`
FROM `pet_breeds` b
JOIN `pet_categories` c ON b.`category_id` = c.`id`
LEFT JOIN `pet_details` d ON b.`id` = d.`breed_id`  
LEFT JOIN `pet_temperaments` t ON b.`id` = t.`breed_id`
WHERE b.`id` = 'golden'
GROUP BY b.`id`;

-- 查询每个分类的品种数量
SELECT 
    c.`name` as `category_name`,
    COUNT(b.`id`) as `breed_count`,
    COUNT(d.`breed_id`) as `details_count`
FROM `pet_categories` c
LEFT JOIN `pet_breeds` b ON c.`id` = b.`category_id`
LEFT JOIN `pet_details` d ON b.`id` = d.`breed_id`
GROUP BY c.`id`, c.`name`
ORDER BY c.`display_order`;
*/
