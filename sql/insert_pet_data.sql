-- 根据 petNavigation.ts 数据插入所有宠物信息
-- 执行顺序：先分类，再品种，最后详细信息

-- ============================================
-- 1. 插入宠物分类数据 (pet_categories)
-- ============================================
INSERT INTO pet_categories (id, name, name_en, icon, display_order, is_active) VALUES
('hot', '热宠导航', 'Hot Pets', '🔥', 1, false),
('dog', '狗狗', 'Dogs', '🐕', 2, true),
('cat', '猫咪', 'Cats', '🐱', 3, false),
('small', '小宠', 'Small Pets', '🐹', 4, false),
('aquatic', '水族', 'Aquatic', '🐟', 5, false),
('reptile', '爬虫', 'Reptiles', '🦎', 6, false);

-- ============================================
-- 2. 插入宠物品种数据 (pet_breeds)
-- ============================================

-- 狗狗品种 (18个品种)
INSERT INTO pet_breeds (id, name, name_en, category_id, icon, display_order) VALUES
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

-- 猫咪品种 (18个品种)  
INSERT INTO pet_breeds (id, name, name_en, category_id, icon, display_order) VALUES
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

-- 小宠品种 (18个品种)
INSERT INTO pet_breeds (id, name, name_en, category_id, icon, display_order) VALUES
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

-- 水族品种 (18个品种)
INSERT INTO pet_breeds (id, name, name_en, category_id, icon, display_order) VALUES
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

-- 爬虫品种 (18个品种)
INSERT INTO pet_breeds (id, name, name_en, category_id, icon, display_order) VALUES
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
INSERT INTO pet_details (
    breed_id, size, weight_min, weight_max, height_min, height_max,
    lifespan_min, lifespan_max, activity_level, grooming_needs,
    description, care_difficulty, diet_info, trainability,
    price_min, price_max, suitable_for_beginner, suitable_for_children,
    suitable_for_elderly, suitable_for_apartments, suitable_for_busy_owners
) VALUES 
-- 金毛寻回犬
('golden', 'large', 25.0, 32.0, 51, 61, 10, 12, 'high', 'medium',
 '友善温和的大型犬，非常适合家庭饲养，智商高，易训练，需要大量运动和社交。', 'easy', '高质量狗粮，注意控制体重',
 'high', 1500.0, 5000.0, true, true, false, false, false),

-- 拉布拉多犬
('labrador', 'large', 25.0, 36.0, 55, 62, 10, 14, 'high', 'medium',
 '温和友善，精力充沛，是出色的家庭伴侣犬和工作犬。', 'easy', '营养均衡的商业狗粮',
 'high', 1200.0, 4000.0, true, true, false, false, false),

-- 贵宾犬
('poodle', 'medium', 4.0, 32.0, 24, 62, 12, 15, 'medium', 'high',
 '聪明优雅，毛发卷曲不易掉毛，适合对毛发过敏的家庭。', 'medium', '优质狗粮，定期美容',
 'high', 2000.0, 8000.0, true, true, true, true, false),

-- 柯基犬
('corgi', 'small', 9.0, 15.0, 25, 30, 12, 15, 'medium', 'medium',
 '短腿长身，性格活泼，原为牧羊犬，需要适量运动。', 'easy', '控制食量，防止肥胖',
 'high', 2000.0, 6000.0, true, true, false, true, false),

-- 柴犬
('shiba', 'medium', 8.0, 11.0, 35, 43, 13, 16, 'medium', 'medium',
 '独立性强，忠诚但有主见，需要早期社交训练。', 'medium', '优质狗粮，定量喂食',
 'medium', 3000.0, 10000.0, false, true, false, true, false),

-- 比熊
('bichon', 'small', 4.0, 8.0, 23, 30, 14, 16, 'medium', 'high',
 '毛发蓬松如棉花糖，性格温顺友善，需要定期美容。', 'medium', '优质狗粮，控制食量',
 'high', 1500.0, 5000.0, true, true, true, true, false),

-- 博美
('pomeranian', 'small', 1.5, 3.5, 18, 22, 12, 16, 'medium', 'high',
 '小型玩赏犬，性格活泼机警，毛发浓密需要精心护理。', 'medium', '小型犬专用狗粮',
 'medium', 1000.0, 4000.0, false, false, true, true, false),

-- 雪纳瑞
('schnauzer', 'medium', 5.0, 23.0, 30, 50, 13, 16, 'high', 'medium',
 '精力充沛，警觉性高，是优秀的看门犬，需要大量运动。', 'medium', '营养均衡的狗粮',
 'high', 1800.0, 6000.0, false, true, false, false, false),

-- 约克夏梗
('yorkshire', 'small', 1.5, 3.5, 18, 23, 13, 16, 'medium', 'high',
 '勇敢机警的小型犬，毛发如丝需要精心打理，性格倔强。', 'medium', '小型犬狗粮',
 'medium', 2000.0, 8000.0, false, false, true, true, false),

-- 马尔济斯犬
('maltese', 'small', 1.5, 4.0, 20, 25, 12, 15, 'low', 'high',
 '优雅的小型伴侣犬，毛发洁白如雪，性格温和友善。', 'medium', '高质量小型犬粮',
 'medium', 2500.0, 8000.0, true, true, true, true, false),

-- 边牧
('border', 'medium', 14.0, 20.0, 46, 56, 12, 15, 'high', 'medium',
 '智商极高的牧羊犬，精力旺盛，需要大量运动和智力刺激。', 'hard', '高蛋白狗粮',
 'high', 1500.0, 4000.0, false, false, false, false, false),

-- 德国牧羊犬
('german_shepherd', 'large', 22.0, 40.0, 55, 65, 9, 13, 'high', 'medium',
 '勇敢忠诚的大型工作犬，智商高，是优秀的警犬和伴侣犬。', 'medium', '大型犬专用狗粮',
 'high', 2000.0, 8000.0, false, false, false, false, false),

-- 松狮犬
('chow', 'medium', 18.0, 32.0, 43, 51, 8, 12, 'low', 'high',
 '独立高贵的中型犬，毛发浓密，对陌生人较为冷淡。', 'medium', '优质狗粮，控制体重',
 'low', 2500.0, 10000.0, false, false, false, true, false),

-- 法国斗牛犬
('french_bulldog', 'medium', 8.0, 14.0, 28, 33, 10, 14, 'low', 'low',
 '扁脸短毛，性格友善安静，适合城市公寓生活。', 'medium', '易消化狗粮',
 'medium', 8000.0, 25000.0, true, true, true, true, true),

-- 萨摩耶犬
('samoyed', 'large', 16.0, 30.0, 48, 60, 12, 14, 'high', 'high',
 '微笑天使，毛发洁白浓密，性格温和友善，需要大量运动。', 'medium', '大型犬狗粮',
 'high', 2000.0, 8000.0, true, true, false, false, false),

-- 哈士奇
('husky', 'large', 16.0, 28.0, 50, 60, 12, 15, 'high', 'medium',
 '精力充沛的雪橇犬，性格友善但破坏力强，需要大量运动。', 'hard', '高能量狗粮',
 'medium', 1500.0, 5000.0, false, false, false, false, false),

-- 罗威纳犬
('rottweiler', 'large', 35.0, 60.0, 56, 69, 8, 10, 'medium', 'low',
 '强壮有力的护卫犬，需要严格训练和社交化。', 'hard', '大型犬高蛋白粮',
 'medium', 3000.0, 10000.0, false, false, false, false, false);

-- 猫咪详细信息
INSERT INTO pet_details (
    breed_id, size, weight_min, weight_max, lifespan_min, lifespan_max,
    activity_level, grooming_needs, description, care_difficulty,
    diet_info, price_min, price_max, suitable_for_beginner,
    suitable_for_children, suitable_for_elderly, suitable_for_apartments, suitable_for_busy_owners
) VALUES
-- 布偶猫
('ragdoll', 'large', 4.5, 9.0, 13, 17, 'low', 'high',
 '性格温顺如布偶，毛发长而柔软，需要定期梳理，适合室内饲养。', 'easy',
 '高质量猫粮，充足饮水', 3000.0, 15000.0, true, true, true, true, true),

-- 波斯猫  
('persian', 'medium', 3.0, 5.5, 12, 17, 'low', 'high',
 '优雅高贵，面部扁平，毛发浓密，需要每日梳理和眼部护理。', 'medium',
 '优质猫粮，注意毛球问题', 2000.0, 8000.0, false, true, true, true, false),

-- 美国短毛猫
('american_shorthair', 'medium', 3.0, 7.0, 13, 17, 'medium', 'low',
 '健康强壮，性格友善，易于照料，是理想的家庭宠物。', 'easy',
 '均衡营养的商业猫粮', 1000.0, 3000.0, true, true, true, true, true),

-- 金吉拉猫
('chinchilla_cat', 'medium', 3.0, 6.0, 12, 17, 'low', 'high',
 '优雅的长毛猫，毛色银白，性格温和，需要精心护理。', 'medium',
 '优质猫粮，定期梳毛', 2000.0, 8000.0, false, true, true, true, false),

-- 银虎斑猫
('silver_tabby', 'medium', 3.5, 6.5, 13, 17, 'medium', 'low',
 '经典的虎斑花纹，银色底色，性格活泼友善。', 'easy',
 '营养均衡的猫粮', 800.0, 2500.0, true, true, true, true, true),

-- 橘猫
('orange_cat', 'medium', 4.0, 8.0, 12, 16, 'medium', 'low',
 '性格温和亲人，毛色橙黄，食量较大，容易发胖。', 'easy',
 '控制食量的优质猫粮', 200.0, 1000.0, true, true, true, true, true),

-- 俄罗斯蓝猫
('russian_blue', 'medium', 3.0, 5.5, 15, 20, 'medium', 'low',
 '短毛蓝灰色，性格安静优雅，对主人忠诚但较为害羞。', 'easy',
 '高质量猫粮', 1500.0, 5000.0, true, false, true, true, false),

-- 阿比西尼亚猫
('abyssinian', 'medium', 3.0, 5.0, 12, 15, 'high', 'low',
 '古老品种，毛发短而有光泽，性格活泼好奇，喜欢攀爬。', 'medium',
 '高蛋白猫粮', 2000.0, 6000.0, false, true, false, false, false),

-- 东方短毛猫
('oriental_shorthair', 'medium', 3.0, 6.0, 12, 15, 'high', 'low',
 '体型修长优雅，毛发短而紧贴，性格外向活泼。', 'medium',
 '均衡营养猫粮', 1500.0, 4000.0, false, true, false, true, false),

-- 塞尔凯克卷毛猫
('selkirk_rex', 'medium', 3.5, 6.5, 13, 17, 'medium', 'medium',
 '毛发卷曲蓬松，性格温和友善，是较新的品种。', 'medium',
 '优质猫粮，定期护理', 3000.0, 8000.0, true, true, true, true, false),

-- 异国短毛猫
('exotic_shorthair', 'medium', 3.0, 6.0, 12, 15, 'low', 'medium',
 '扁脸短毛，性格温顺安静，被称为短毛版波斯猫。', 'medium',
 '易消化猫粮', 2500.0, 8000.0, true, true, true, true, true),

-- 狼猫
('lykoi', 'medium', 2.5, 4.5, 12, 15, 'medium', 'low',
 '毛发稀疏独特，外形似狼，性格友善好奇。', 'medium',
 '高质量猫粮', 5000.0, 15000.0, false, false, false, true, false),

-- 康沃尔卷毛猫
('cornish_rex', 'medium', 2.5, 4.5, 12, 16, 'high', 'low',
 '毛发卷曲短密，体型修长，性格活泼爱玩。', 'medium',
 '营养丰富猫粮', 2000.0, 6000.0, false, true, false, true, false),

-- 德文卷毛猫
('devon_rex', 'medium', 2.5, 4.0, 12, 16, 'high', 'low',
 '毛发卷曲柔软，耳朵特别大，性格顽皮活泼。', 'medium',
 '高质量猫粮', 2500.0, 7000.0, false, true, false, true, false),

-- 异国长毛猫
('exotic_longhair', 'medium', 3.5, 6.0, 12, 15, 'low', 'high',
 '长毛版异短，毛发浓密，性格温顺安静。', 'medium',
 '优质猫粮，每日梳理', 3000.0, 10000.0, false, true, true, true, false),

-- 苏格兰折耳猫
('scottish_fold', 'medium', 3.0, 6.0, 11, 15, 'low', 'medium',
 '耳朵向前折叠，性格温和安静，但存在遗传疾病风险。', 'medium',
 '优质猫粮，注意关节保健', 2000.0, 8000.0, false, true, true, true, true),

-- 土耳其安哥拉猫
('turkish_angora', 'medium', 2.5, 5.0, 13, 18, 'medium', 'high',
 '优雅的长毛猫，毛发丝滑，性格聪明活泼。', 'medium',
 '高质量猫粮，定期美容', 3000.0, 12000.0, false, true, false, true, false);

-- 小宠详细信息  
INSERT INTO pet_details (
    breed_id, size, weight_min, weight_max, lifespan_min, lifespan_max,
    activity_level, grooming_needs, description, care_difficulty,
    diet_info, price_min, price_max, suitable_for_beginner,
    suitable_for_children, suitable_for_apartments, suitable_for_busy_owners
) VALUES
-- 仓鼠
('hamster', 'small', 0.02, 0.15, 2, 3, 'high', 'low',
 '小巧可爱，夜行性动物，容易饲养，适合初学者。', 'easy',
 '仓鼠专用粮食和新鲜蔬果', 10.0, 50.0, true, true, true, true),

-- 荷兰侏儒兔
('netherland_dwarf', 'small', 0.5, 1.2, 8, 12, 'medium', 'medium',
 '体型迷你，耳朵短小，性格活泼，需要适当的运动空间。', 'medium',
 '兔粮配合干草和蔬菜', 200.0, 800.0, true, true, true, false),

-- 豚鼠
('guinea_pig', 'small', 0.7, 1.2, 4, 8, 'medium', 'medium',
 '社群动物，叫声丰富，性格温和，需要维生素C补充。', 'easy',
 '豚鼠专用粮配新鲜蔬菜', 50.0, 300.0, true, true, true, true),

-- 垂耳兔
('lop_rabbit', 'small', 1.0, 2.5, 8, 12, 'medium', 'medium',
 '耳朵下垂，性格温顺，需要定期清理耳道。', 'medium',
 '兔粮配干草和蔬菜', 300.0, 1000.0, true, true, true, false),

-- 松鼠
('squirrel', 'small', 0.3, 0.7, 6, 10, 'high', 'medium',
 '活泼好动，喜欢攀爬，需要大量活动空间和树枝。', 'hard',
 '坚果、种子和新鲜水果', 500.0, 2000.0, false, false, false, false),

-- 海兔
('sea_rabbit', 'small', 0.8, 1.5, 6, 10, 'low', 'low',
 '温顺安静的小型宠物，需要适宜的温湿度环境。', 'medium',
 '专用海兔粮食', 100.0, 500.0, true, true, true, true),

-- 安哥拉兔
('angora_rabbit', 'medium', 2.0, 4.0, 7, 12, 'low', 'high',
 '毛发极长柔软，需要每日梳理，定期修剪。', 'hard',
 '高纤维兔粮配干草', 500.0, 2000.0, false, false, false, false),

-- 刺猬
('hedgehog', 'small', 0.3, 0.8, 3, 8, 'medium', 'low',
 '夜行性动物，背部有刺，性格较为胆小。', 'medium',
 '刺猬专用粮和昆虫', 200.0, 1000.0, false, false, true, false),

-- 黄金仓鼠
('golden_hamster', 'small', 0.08, 0.15, 2, 3, 'high', 'low',
 '比普通仓鼠稍大，性格温顺，适合独居。', 'easy',
 '仓鼠粮配新鲜蔬果', 20.0, 80.0, true, true, true, true),

-- 毛丝鼠
('chinchilla_small', 'small', 0.4, 0.8, 10, 20, 'high', 'high',
 '毛发极密柔软，需要沙浴清洁，怕湿怕热。', 'medium',
 '毛丝鼠专用粮和干草', 300.0, 1500.0, false, false, true, false),

-- 迷你猪
('mini_pig', 'medium', 13.0, 45.0, 12, 18, 'medium', 'medium',
 '聪明可训练，但成年后体型可能超出预期。', 'hard',
 '猪用饲料配蔬菜水果', 2000.0, 10000.0, false, false, false, false),

-- 蜜袋鼯
('sugar_glider', 'small', 0.08, 0.16, 10, 15, 'high', 'medium',
 '夜行性滑翔动物，社群性强，需要成对饲养。', 'hard',
 '专用粮配昆虫和水果', 800.0, 3000.0, false, false, false, false),

-- 三线仓鼠
('djungarian_hamster', 'small', 0.03, 0.08, 2, 3, 'high', 'low',
 '体型较小，背部有三条黑线，性格活泼。', 'easy',
 '仓鼠粮和蔬菜', 15.0, 60.0, true, true, true, true),

-- 坎贝尔仓鼠
('campbell_hamster', 'small', 0.04, 0.09, 2, 3, 'high', 'low',
 '毛色多样，性格活跃，容易饲养。', 'easy',
 '仓鼠专用粮食', 15.0, 60.0, true, true, true, true),

-- 花枝鼠
('fancy_rat', 'small', 0.2, 0.6, 2, 3, 'high', 'low',
 '聪明亲人，社群性强，可以训练简单动作。', 'easy',
 '老鼠粮配蔬菜水果', 30.0, 150.0, true, true, true, true),

-- 罗伯罗夫斯基仓鼠
('roborovski_hamster', 'small', 0.02, 0.04, 2, 4, 'high', 'low',
 '最小的仓鼠品种，极其活跃，不适合把玩。', 'medium',
 '小粒仓鼠粮', 20.0, 80.0, false, false, true, true),

-- 侏儒兔
('dwarf_rabbit', 'small', 0.8, 1.8, 7, 12, 'medium', 'medium',
 '体型小巧，性格温顺，适合室内饲养。', 'medium',
 '兔粮配干草', 250.0, 800.0, true, true, true, false);

-- 水族详细信息
INSERT INTO pet_details (
    breed_id, size, lifespan_min, lifespan_max, activity_level,
    grooming_needs, description, care_difficulty, diet_info,
    price_min, price_max, suitable_for_beginner, suitable_for_apartments, suitable_for_busy_owners
) VALUES
-- 金鱼
('goldfish', 'small', 5, 20, 'low', 'low',
 '最常见的观赏鱼，易于饲养，对水质要求不高。', 'easy',
 '鱼粮，定期换水', 5.0, 100.0, true, true, true),

-- 斗鱼
('betta', 'small', 2, 5, 'medium', 'low',
 '色彩艳丽，但具有攻击性，不能与其他斗鱼混养。', 'easy',
 '斗鱼专用饲料', 20.0, 200.0, true, true, true),

-- 锦鲤
('koi', 'large', 15, 30, 'medium', 'medium',
 '观赏价值极高的鱼类，需要大型池塘，对水质要求较高。', 'medium',
 '锦鲤专用饲料', 100.0, 10000.0, false, false, false),

-- 龙鱼
('arowana', 'large', 10, 20, 'medium', 'medium',
 '名贵观赏鱼，体态优美，需要大型水族箱和优质水质。', 'hard',
 '活食和高档鱼粮', 500.0, 50000.0, false, true, false),

-- 小丑鱼
('clownfish', 'small', 3, 10, 'medium', 'low',
 '色彩鲜艳，与海葵共生，需要海水环境。', 'medium',
 '海水鱼专用饲料', 50.0, 300.0, false, true, false),

-- 罗汉鱼
('flowerhorn', 'medium', 8, 12, 'medium', 'medium',
 '头部隆起，色彩艳丽，人工培育品种，性格活泼。', 'medium',
 '罗汉鱼专用饲料', 100.0, 2000.0, false, true, false),

-- 鹦鹉鱼
('parrotfish', 'medium', 5, 8, 'medium', 'low',
 '色彩鲜艳的人工杂交鱼，嘴型特殊，性格温和。', 'easy',
 '鹦鹉鱼专用饲料', 30.0, 200.0, true, true, true),

-- 银板鱼
('silver_dollar', 'medium', 5, 10, 'medium', 'low',
 '银色圆形身体，群游性鱼类，性格温和。', 'easy',
 '热带鱼综合饲料', 20.0, 100.0, true, true, true),

-- 黄金蟹
('golden_crab', 'small', 2, 4, 'low', 'medium',
 '淡水蟹类，颜色金黄，需要陆地和水域环境。', 'medium',
 '蟹类专用饲料', 30.0, 150.0, false, true, false),

-- 巴西龟
('brazilian_turtle', 'medium', 15, 30, 'medium', 'medium',
 '半水栖龟类，适应性强，需要晒背灯和过滤系统。', 'easy',
 '龟粮配蔬菜', 20.0, 200.0, true, true, false),

-- 海马
('seahorse', 'small', 1, 5, 'low', 'high',
 '独特的海洋生物，需要专业的海水环境和细心照料。', 'hard',
 '活体或冷冻丰年虾', 200.0, 1000.0, false, false, false),

-- 海胆
('sea_urchin', 'small', 2, 6, 'low', 'medium',
 '海洋底栖动物，需要稳定的海水环境。', 'hard',
 '海藻和有机碎屑', 50.0, 300.0, false, false, false),

-- 豌豆蟹
('pea_crab', 'small', 1, 3, 'low', 'low',
 '小型淡水蟹，体型迷你，适合小型缸体。', 'medium',
 '小粒蟹粮', 15.0, 80.0, false, true, true),

-- 陶瓷鱼
('ceramic_fish', 'small', 2, 5, 'low', 'low',
 '身体透明如陶瓷，观赏价值高，对水质敏感。', 'medium',
 '细粒鱼粮', 100.0, 500.0, false, true, false),

-- 水晶虾
('crystal_shrimp', 'small', 1, 2, 'low', 'high',
 '透明如水晶的观赏虾，对水质要求极高。', 'hard',
 '虾粮和藻类', 20.0, 200.0, false, true, false),

-- 剃刀鱼
('razorfish', 'medium', 3, 8, 'high', 'low',
 '身形修长，游速极快，需要大型水族箱。', 'medium',
 '活食和肉类饲料', 80.0, 400.0, false, true, false),

-- 孔雀鳗
('peacock_eel', 'medium', 5, 15, 'medium', 'medium',
 '色彩斑斓的鳗鱼，性格温和，喜欢钻沙。', 'medium',
 '活食和冷冻饲料', 150.0, 800.0, false, true, false);

-- 爬虫详细信息
INSERT INTO pet_details (
    breed_id, size, weight_min, weight_max, lifespan_min, lifespan_max,
    activity_level, grooming_needs, description, care_difficulty,
    diet_info, price_min, price_max, suitable_for_beginner,
    suitable_for_apartments, suitable_for_busy_owners
) VALUES
-- 鬃狮蜥
('bearded_dragon', 'medium', 0.3, 0.6, 8, 15, 'medium', 'low',
 '温顺的大型蜥蜴，需要UVB灯和加热设备，容易驯化。', 'medium',
 '昆虫、蔬菜和专用饲料', 300.0, 1500.0, true, true, false),

-- 黑曼巴蛇
('black_mamba', 'large', 1.2, 1.6, 11, 20, 'high', 'low',
 '剧毒蛇类，极其危险，仅供专业人士饲养。', 'hard',
 '小型哺乳动物', 5000.0, 20000.0, false, false, false),

-- 变色龙
('chameleon', 'small', 0.05, 0.2, 3, 8, 'low', 'high',
 '能变色的独特蜥蜴，对环境要求严格，需要专业设备。', 'hard',
 '活昆虫', 500.0, 3000.0, false, false, false),

-- 红眼树蛙
('red_eye_tree_frog', 'small', 0.01, 0.02, 5, 8, 'medium', 'high',
 '色彩鲜艳的树栖蛙类，需要高湿度环境。', 'medium',
 '小型昆虫', 100.0, 500.0, false, true, false),

-- 墨西哥红膝蜘蛛
('mexican_redknee', 'small', 0.03, 0.08, 20, 30, 'low', 'low',
 '温顺的大型蜘蛛，寿命很长，适合蜘蛛爱好者。', 'medium',
 '蟋蟀和其他昆虫', 200.0, 800.0, false, true, true),

-- 竹叶青蛇
('bamboo_viper', 'medium', 0.1, 0.3, 8, 15, 'low', 'low',
 '有毒蛇类，需要专业许可和防护措施。', 'hard',
 '小型哺乳动物和鸟类', 1000.0, 5000.0, false, false, false),

-- 红蝎
('red_scorpion', 'small', 0.02, 0.05, 5, 8, 'low', 'low',
 '有毒节肢动物，需要特殊的饲养环境。', 'hard',
 '小型昆虫', 150.0, 600.0, false, false, false),

-- 缅甸蟒
('burmese_python', 'large', 30.0, 90.0, 15, 25, 'low', 'low',
 '大型无毒蛇类，成体巨大，需要大型饲养空间。', 'hard',
 '大型哺乳动物', 500.0, 3000.0, false, false, false),

-- 豹纹守宫
('leopard_gecko', 'small', 0.04, 0.08, 10, 20, 'medium', 'low',
 '温顺易养的小型蜥蜴，适合爬虫初学者。', 'easy',
 '昆虫和专用饲料', 100.0, 500.0, true, true, true),

-- 水巨蜥
('water_monitor', 'large', 8.0, 25.0, 12, 20, 'high', 'medium',
 '大型半水栖蜥蜴，智商较高但攻击性强。', 'hard',
 '鱼类、肉类和蛋类', 1000.0, 5000.0, false, false, false),

-- 三线蛇
('three_line_snake', 'medium', 0.2, 0.5, 8, 15, 'low', 'low',
 '温顺的中型蛇类，适合蛇类爱好者。', 'medium',
 '小型哺乳动物', 300.0, 1000.0, false, true, false),

-- 森蚺
('anaconda', 'large', 30.0, 70.0, 10, 15, 'medium', 'low',
 '世界上最大的蛇类之一，需要大型水陆环境。', 'hard',
 '大型哺乳动物和鱼类', 2000.0, 10000.0, false, false, false),

-- 猪鼻龟
('pig_nose', 'medium', 5.0, 15.0, 30, 50, 'medium', 'medium',
 '独特的淡水龟，鼻部突出，需要大型水族环境。', 'medium',
 '鱼类、水草和龟粮', 500.0, 2000.0, false, true, false),

-- 白化蟒
('albino_python', 'large', 20.0, 40.0, 15, 25, 'low', 'low',
 '白化基因的蟒蛇，观赏价值高，需要专业饲养。', 'hard',
 '哺乳动物', 1000.0, 8000.0, false, false, false),

-- 大壁虎
('tokay_gecko', 'medium', 0.15, 0.3, 8, 15, 'medium', 'low',
 '大型壁虎，叫声响亮，性格较为凶猛。', 'medium',
 '昆虫和小型脊椎动物', 200.0, 800.0, false, true, false),

-- 玉米蛇
('corn_snake', 'medium', 0.2, 0.9, 15, 20, 'low', 'low',
 '温顺易养的蛇类，色彩丰富，是理想的宠物蛇。', 'easy',
 '小型哺乳动物', 150.0, 800.0, true, true, true),

-- 绿树蟒
('green_tree_python', 'medium', 1.0, 2.0, 15, 25, 'low', 'low',
 '美丽的树栖蟒蛇，需要高湿度和适宜的温度。', 'medium',
 '鸟类和小型哺乳动物', 800.0, 3000.0, false, true, false);

-- ============================================
-- 4. 插入性格特点数据示例
-- ============================================
INSERT INTO pet_temperaments (breed_id, temperament, display_order) VALUES
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
('ragdoll', '友善', 4);

-- 查询验证数据
-- 验证插入的数据数量
/*
SELECT 
    (SELECT COUNT(*) FROM pet_categories) as categories_count,
    (SELECT COUNT(*) FROM pet_breeds) as breeds_count, 
    (SELECT COUNT(*) FROM pet_details) as details_count,
    (SELECT COUNT(*) FROM pet_temperaments) as temperaments_count;

-- 查询特定品种的完整信息
SELECT 
    b.id,
    b.name,
    b.name_en,
    b.icon,
    c.name as category_name,
    d.description,
    d.care_difficulty,
    GROUP_CONCAT(t.temperament ORDER BY t.display_order) as temperaments
FROM pet_breeds b
JOIN pet_categories c ON b.category_id = c.id
LEFT JOIN pet_details d ON b.id = d.breed_id  
LEFT JOIN pet_temperaments t ON b.id = t.breed_id
WHERE b.id = 'golden'
GROUP BY b.id;
*/
