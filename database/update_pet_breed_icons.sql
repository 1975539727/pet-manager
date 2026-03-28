-- ============================================
-- 更新宠物品种图标为真实图片路径
-- ============================================
-- 将emoji图标替换为实际的图片文件路径

-- 狗狗类
UPDATE pet_breeds SET icon = '/images/pets/poodle.jpg' WHERE id = 'poodle';
UPDATE pet_breeds SET icon = '/images/pets/bichon.jpg' WHERE id = 'bichon';
UPDATE pet_breeds SET icon = '/images/pets/pomeranian.jpg' WHERE id = 'pomeranian';
UPDATE pet_breeds SET icon = '/images/pets/schnauzer.jpg' WHERE id = 'schnauzer';
UPDATE pet_breeds SET icon = '/images/pets/yorkshire.jpg' WHERE id = 'yorkshire';
UPDATE pet_breeds SET icon = '/images/pets/maltese.jpg' WHERE id = 'maltese';
UPDATE pet_breeds SET icon = '/images/pets/corgi.jpg' WHERE id = 'corgi';
UPDATE pet_breeds SET icon = '/images/pets/shiba.jpg' WHERE id = 'shiba';
UPDATE pet_breeds SET icon = '/images/pets/border.jpg' WHERE id = 'border';
UPDATE pet_breeds SET icon = '/images/pets/german_shepherd.jpg' WHERE id = 'german_shepherd';
UPDATE pet_breeds SET icon = '/images/pets/golden.jpg' WHERE id = 'golden';
UPDATE pet_breeds SET icon = '/images/pets/chow.jpg' WHERE id = 'chow';
UPDATE pet_breeds SET icon = '/images/pets/french_bulldog.jpg' WHERE id = 'french_bulldog';
UPDATE pet_breeds SET icon = '/images/pets/samoyed.jpg' WHERE id = 'samoyed';
UPDATE pet_breeds SET icon = '/images/pets/labrador.jpg' WHERE id = 'labrador';
UPDATE pet_breeds SET icon = '/images/pets/husky.jpg' WHERE id = 'husky';
UPDATE pet_breeds SET icon = '/images/pets/rottweiler.jpg' WHERE id = 'rottweiler';

-- 猫咪类
UPDATE pet_breeds SET icon = '/images/pets/chinchilla_cat.jpg' WHERE id = 'chinchilla_cat';
UPDATE pet_breeds SET icon = '/images/pets/silver_tabby.jpg' WHERE id = 'silver_tabby';
UPDATE pet_breeds SET icon = '/images/pets/orange_cat.jpg' WHERE id = 'orange_cat';
UPDATE pet_breeds SET icon = '/images/pets/russian_blue.jpg' WHERE id = 'russian_blue';
UPDATE pet_breeds SET icon = '/images/pets/american_shorthair.jpg' WHERE id = 'american_shorthair';
UPDATE pet_breeds SET icon = '/images/pets/abyssinian.jpg' WHERE id = 'abyssinian';
UPDATE pet_breeds SET icon = '/images/pets/oriental_shorthair.jpg' WHERE id = 'oriental_shorthair';
UPDATE pet_breeds SET icon = '/images/pets/selkirk_rex.jpg' WHERE id = 'selkirk_rex';
UPDATE pet_breeds SET icon = '/images/pets/exotic_shorthair.jpg' WHERE id = 'exotic_shorthair';
UPDATE pet_breeds SET icon = '/images/pets/lykoi.jpg' WHERE id = 'lykoi';
UPDATE pet_breeds SET icon = '/images/pets/cornish_rex.jpg' WHERE id = 'cornish_rex';
UPDATE pet_breeds SET icon = '/images/pets/ragdoll.jpg' WHERE id = 'ragdoll';
UPDATE pet_breeds SET icon = '/images/pets/devon_rex.jpg' WHERE id = 'devon_rex';
UPDATE pet_breeds SET icon = '/images/pets/exotic_longhair.jpg' WHERE id = 'exotic_longhair';
UPDATE pet_breeds SET icon = '/images/pets/persian.jpg' WHERE id = 'persian';
UPDATE pet_breeds SET icon = '/images/pets/scottish_fold.jpg' WHERE id = 'scottish_fold';
UPDATE pet_breeds SET icon = '/images/pets/turkish_angora.jpg' WHERE id = 'turkish_angora';

-- 小宠类
UPDATE pet_breeds SET icon = '/images/pets/hamster.jpg' WHERE id = 'hamster';
UPDATE pet_breeds SET icon = '/images/pets/guinea_pig.jpg' WHERE id = 'guinea_pig';
UPDATE pet_breeds SET icon = '/images/pets/netherland_dwarf.jpg' WHERE id = 'netherland_dwarf';
UPDATE pet_breeds SET icon = '/images/pets/lop_rabbit.jpg' WHERE id = 'lop_rabbit';
UPDATE pet_breeds SET icon = '/images/pets/squirrel.jpg' WHERE id = 'squirrel';
UPDATE pet_breeds SET icon = '/images/pets/angora_rabbit.jpeg' WHERE id = 'angora_rabbit';
UPDATE pet_breeds SET icon = '/images/pets/hedgehog.jpg' WHERE id = 'hedgehog';
UPDATE pet_breeds SET icon = '/images/pets/golden_hamster.jpg' WHERE id = 'golden_hamster';
UPDATE pet_breeds SET icon = '/images/pets/chinchilla_small.jpg' WHERE id = 'chinchilla_small';
UPDATE pet_breeds SET icon = '/images/pets/mini_pig.png' WHERE id = 'mini_pig';
UPDATE pet_breeds SET icon = '/images/pets/sugar_glider.jpg' WHERE id = 'sugar_glider';
UPDATE pet_breeds SET icon = '/images/pets/djungarian_hamster.jpg' WHERE id = 'djungarian_hamster';
UPDATE pet_breeds SET icon = '/images/pets/campbell_hamster.jpeg' WHERE id = 'campbell_hamster';
UPDATE pet_breeds SET icon = '/images/pets/fancy_rat.jpg' WHERE id = 'fancy_rat';
UPDATE pet_breeds SET icon = '/images/pets/roborovski_hamster.jpg' WHERE id = 'roborovski_hamster';
UPDATE pet_breeds SET icon = '/images/pets/dwarf_rabbit.jpg' WHERE id = 'dwarf_rabbit';

-- 水族类
UPDATE pet_breeds SET icon = '/images/pets/koi.jpg' WHERE id = 'koi';
UPDATE pet_breeds SET icon = '/images/pets/arowana.jpg' WHERE id = 'arowana';
UPDATE pet_breeds SET icon = '/images/pets/clownfish.jpg' WHERE id = 'clownfish';
UPDATE pet_breeds SET icon = '/images/pets/betta.jpg' WHERE id = 'betta';
UPDATE pet_breeds SET icon = '/images/pets/flowerhorn.jpg' WHERE id = 'flowerhorn';
UPDATE pet_breeds SET icon = '/images/pets/parrotfish.jpg' WHERE id = 'parrotfish';
UPDATE pet_breeds SET icon = '/images/pets/silver_dollar.jpg' WHERE id = 'silver_dollar';
UPDATE pet_breeds SET icon = '/images/pets/golden_crab.jpg' WHERE id = 'golden_crab';
UPDATE pet_breeds SET icon = '/images/pets/brazilian_turtle.png' WHERE id = 'brazilian_turtle';
UPDATE pet_breeds SET icon = '/images/pets/seahorse.jpg' WHERE id = 'seahorse';
UPDATE pet_breeds SET icon = '/images/pets/sea_urchin.jpg' WHERE id = 'sea_urchin';
UPDATE pet_breeds SET icon = '/images/pets/pea_crab.jpg' WHERE id = 'pea_crab';
UPDATE pet_breeds SET icon = '/images/pets/ceramic_fish.jpg' WHERE id = 'ceramic_fish';
UPDATE pet_breeds SET icon = '/images/pets/crystal_shrimp.jpg' WHERE id = 'crystal_shrimp';
UPDATE pet_breeds SET icon = '/images/pets/razorfish.jpg' WHERE id = 'razorfish';
UPDATE pet_breeds SET icon = '/images/pets/peacock_eel.png' WHERE id = 'peacock_eel';
UPDATE pet_breeds SET icon = '/images/pets/goldfish.jpg' WHERE id = 'goldfish';

-- 爬虫类
UPDATE pet_breeds SET icon = '/images/pets/bearded_dragon.jpg' WHERE id = 'bearded_dragon';
UPDATE pet_breeds SET icon = '/images/pets/black_mamba.jpg' WHERE id = 'black_mamba';
UPDATE pet_breeds SET icon = '/images/pets/chameleon.jpg' WHERE id = 'chameleon';
UPDATE pet_breeds SET icon = '/images/pets/red_eye_tree_frog.png' WHERE id = 'red_eye_tree_frog';
UPDATE pet_breeds SET icon = '/images/pets/mexican_redknee.jpg' WHERE id = 'mexican_redknee';
UPDATE pet_breeds SET icon = '/images/pets/bamboo_viper.jpg' WHERE id = 'bamboo_viper';
UPDATE pet_breeds SET icon = '/images/pets/red_scorpion.jpg' WHERE id = 'red_scorpion';
UPDATE pet_breeds SET icon = '/images/pets/burmese_python.jpg' WHERE id = 'burmese_python';
UPDATE pet_breeds SET icon = '/images/pets/leopard_gecko.jpg' WHERE id = 'leopard_gecko';
UPDATE pet_breeds SET icon = '/images/pets/water_monitor.jpg' WHERE id = 'water_monitor';
UPDATE pet_breeds SET icon = '/images/pets/three_line_snake.jpg' WHERE id = 'three_line_snake';
UPDATE pet_breeds SET icon = '/images/pets/anaconda.jpg' WHERE id = 'anaconda';
UPDATE pet_breeds SET icon = '/images/pets/pig_nose.jpg' WHERE id = 'pig_nose';
UPDATE pet_breeds SET icon = '/images/pets/albino_python.jpeg' WHERE id = 'albino_python';
UPDATE pet_breeds SET icon = '/images/pets/tokay_gecko.jpeg' WHERE id = 'tokay_gecko';
UPDATE pet_breeds SET icon = '/images/pets/corn_snake.jpg' WHERE id = 'corn_snake';
UPDATE pet_breeds SET icon = '/images/pets/green_tree_python.jpeg' WHERE id = 'green_tree_python';

-- 验证更新结果
-- 查询所有使用图片路径的品种
SELECT id, name, icon, category_id 
FROM pet_breeds 
WHERE icon LIKE '/images/pets/%'
ORDER BY category_id, name;

-- 查询所有仍使用emoji的品种
SELECT id, name, icon, category_id 
FROM pet_breeds 
WHERE icon NOT LIKE '/images/pets/%'
ORDER BY category_id, name;
