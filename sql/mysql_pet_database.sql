-- MySQL版本的宠物管理系统数据库表结构
-- 适配MySQL 5.7+ / MySQL 8.0+

-- 设置字符集和存储引擎
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库（可选）
-- CREATE DATABASE pet_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE pet_manager;

-- 1. 宠物分类表
DROP TABLE IF EXISTS `pet_categories`;
CREATE TABLE `pet_categories` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `name_en` VARCHAR(100) DEFAULT NULL,
    `description` TEXT,
    `icon` VARCHAR(10) DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 宠物品种基础信息表
DROP TABLE IF EXISTS `pet_breeds`;
CREATE TABLE `pet_breeds` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT '对应petNavigation.ts中的breed.id',
    `name` VARCHAR(100) NOT NULL COMMENT '宠物品种名称',
    `name_en` VARCHAR(100) DEFAULT NULL,
    `category_id` VARCHAR(50) NOT NULL,
    `icon` VARCHAR(10) DEFAULT NULL COMMENT '对应petNavigation.ts中的icon',
    `display_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_pet_breeds_category` (`category_id`),
    CONSTRAINT `fk_breeds_category` FOREIGN KEY (`category_id`) REFERENCES `pet_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 宠物详细信息表
DROP TABLE IF EXISTS `pet_details`;
CREATE TABLE `pet_details` (
    `breed_id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT '直接对应pet_breeds.id，一对一关系',
    
    -- 基本特征
    `size` ENUM('small', 'medium', 'large') DEFAULT NULL,
    `weight_min` DECIMAL(5,2) DEFAULT NULL,
    `weight_max` DECIMAL(5,2) DEFAULT NULL,
    `weight_unit` VARCHAR(10) DEFAULT 'kg',
    `height_min` DECIMAL(5,2) DEFAULT NULL,
    `height_max` DECIMAL(5,2) DEFAULT NULL,
    `height_unit` VARCHAR(10) DEFAULT 'cm',
    `lifespan_min` INT DEFAULT NULL,
    `lifespan_max` INT DEFAULT NULL,
    `activity_level` ENUM('low', 'medium', 'high') DEFAULT NULL,
    `grooming_needs` ENUM('low', 'medium', 'high') DEFAULT NULL,
    
    -- 外观描述
    `coat_type` VARCHAR(100) DEFAULT NULL,
    `description` TEXT,
    
    -- 饲养信息
    `care_difficulty` ENUM('easy', 'medium', 'hard') DEFAULT NULL,
    `diet_info` TEXT,
    `feeding_frequency` VARCHAR(100) DEFAULT NULL,
    `special_diet` TEXT,
    
    -- 训练信息
    `trainability` ENUM('low', 'medium', 'high') DEFAULT NULL,
    
    -- 价格信息
    `price_min` DECIMAL(10,2) DEFAULT NULL,
    `price_max` DECIMAL(10,2) DEFAULT NULL,
    `price_currency` VARCHAR(10) DEFAULT 'CNY',
    
    -- 适合人群标识
    `suitable_for_beginner` TINYINT(1) DEFAULT 0,
    `suitable_for_children` TINYINT(1) DEFAULT 0,
    `suitable_for_elderly` TINYINT(1) DEFAULT 0,
    `suitable_for_apartments` TINYINT(1) DEFAULT 0,
    `suitable_for_busy_owners` TINYINT(1) DEFAULT 0,
    
    -- 数据源信息
    `data_source` VARCHAR(200) DEFAULT NULL,
    `is_verified` TINYINT(1) DEFAULT 0,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_details_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 宠物性格特点表
DROP TABLE IF EXISTS `pet_temperaments`;
CREATE TABLE `pet_temperaments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `temperament` VARCHAR(50) NOT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_temperaments_breed` (`breed_id`),
    CONSTRAINT `fk_temperaments_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 宠物毛色表
DROP TABLE IF EXISTS `pet_coat_colors`;
CREATE TABLE `pet_coat_colors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `color_code` VARCHAR(10) DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_coat_colors_breed` (`breed_id`),
    CONSTRAINT `fk_coat_colors_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 居住空间适应性表
DROP TABLE IF EXISTS `pet_living_spaces`;
CREATE TABLE `pet_living_spaces` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `living_space` VARCHAR(100) NOT NULL,
    `suitability_score` TINYINT CHECK (`suitability_score` BETWEEN 1 AND 5),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_living_spaces_breed` (`breed_id`),
    CONSTRAINT `fk_living_spaces_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 常见疾病表
DROP TABLE IF EXISTS `pet_common_diseases`;
CREATE TABLE `pet_common_diseases` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `disease_name` VARCHAR(100) NOT NULL,
    `prevalence` ENUM('rare', 'uncommon', 'common', 'very_common') DEFAULT NULL,
    `prevention_tips` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_diseases_breed` (`breed_id`),
    CONSTRAINT `fk_diseases_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. 健康建议表
DROP TABLE IF EXISTS `pet_health_tips`;
CREATE TABLE `pet_health_tips` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `tip_category` ENUM('prevention', 'care', 'nutrition', 'exercise', 'grooming') DEFAULT NULL,
    `tip_description` TEXT NOT NULL,
    `priority_level` ENUM('low', 'medium', 'high') DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_health_tips_breed` (`breed_id`),
    CONSTRAINT `fk_health_tips_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. 训练命令表
DROP TABLE IF EXISTS `pet_training_commands`;
CREATE TABLE `pet_training_commands` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `command_name` VARCHAR(50) NOT NULL,
    `command_type` ENUM('basic', 'intermediate', 'advanced') DEFAULT NULL,
    `difficulty_level` TINYINT CHECK (`difficulty_level` BETWEEN 1 AND 5),
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_training_commands_breed` (`breed_id`),
    CONSTRAINT `fk_training_commands_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. 宠物图片表
DROP TABLE IF EXISTS `pet_images`;
CREATE TABLE `pet_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `image_type` ENUM('main', 'gallery', 'avatar') DEFAULT NULL,
    `alt_text` VARCHAR(200) DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_images_breed` (`breed_id`),
    CONSTRAINT `fk_images_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. 宠物照护建议表
DROP TABLE IF EXISTS `pet_care_tips`;
CREATE TABLE `pet_care_tips` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `tip_category` ENUM('feeding', 'exercise', 'grooming', 'socialization', 'environment') DEFAULT NULL,
    `tip_description` TEXT NOT NULL,
    `importance` ENUM('optional', 'recommended', 'essential') DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_care_tips_breed` (`breed_id`),
    CONSTRAINT `fk_care_tips_breed` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. 相关品种关系表
DROP TABLE IF EXISTS `pet_related_breeds`;
CREATE TABLE `pet_related_breeds` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `breed_id` VARCHAR(50) NOT NULL,
    `related_breed_id` VARCHAR(50) NOT NULL,
    `relationship_type` ENUM('similar', 'parent', 'variant', 'crossbreed') DEFAULT NULL,
    `similarity_score` TINYINT CHECK (`similarity_score` BETWEEN 1 AND 10),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_related_breeds_main` (`breed_id`),
    INDEX `idx_related_breeds_related` (`related_breed_id`),
    CONSTRAINT `fk_related_breeds_main` FOREIGN KEY (`breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_related_breeds_related` FOREIGN KEY (`related_breed_id`) REFERENCES `pet_breeds`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
