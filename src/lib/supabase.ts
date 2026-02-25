import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 数据库类型定义
export interface PetBreed {
  id: string;
  name: string;
  name_en?: string;
  category_id: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PetCategory {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface PetDetails {
  breed_id: string;
  size?: 'small' | 'medium' | 'large';
  weight_min?: number;
  weight_max?: number;
  weight_unit?: string;
  height_min?: number;
  height_max?: number;
  height_unit?: string;
  lifespan_min?: number;
  lifespan_max?: number;
  activity_level?: 'low' | 'medium' | 'high';
  grooming_needs?: 'low' | 'medium' | 'high';
  coat_type?: string;
  description?: string;
  care_difficulty?: 'easy' | 'medium' | 'hard';
  diet_info?: string;
  feeding_frequency?: string;
  special_diet?: string;
  trainability?: 'low' | 'medium' | 'high';
  price_min?: number;
  price_max?: number;
  price_currency?: string;
  suitable_for_beginner?: boolean;
  suitable_for_children?: boolean;
  suitable_for_elderly?: boolean;
  suitable_for_apartments?: boolean;
  suitable_for_busy_owners?: boolean;
}

export interface PetTemperament {
  id: number;
  breed_id: string;
  temperament: string;
  display_order?: number;
}

export interface PetHealthTip {
  id: number;
  breed_id: string;
  tip_category: 'prevention' | 'care' | 'nutrition' | 'exercise' | 'grooming';
  tip_description: string;
  priority_level: 'low' | 'medium' | 'high';
}

export interface PetTrainingCommand {
  id: number;
  breed_id: string;
  command_name: string;
  command_type: 'basic' | 'intermediate' | 'advanced';
  difficulty_level: number;
  description?: string;
}

// 完整的宠物信息接口（包含关联数据）
export interface FullPetInfo extends PetBreed {
  category: PetCategory;
  details?: PetDetails;
  temperaments?: PetTemperament[];
  health_tips?: PetHealthTip[];
  training_commands?: PetTrainingCommand[];
}

// 用户相关类型定义
export interface User {
  id: string;
  email: string;
  password_hash: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  
  // 账户状态
  is_email_verified: boolean;
  is_active: boolean;
  
  // 系统字段
  created_at?: string;
  updated_at?: string;
}

export interface EmailVerificationCode {
  id: string;
  email: string;
  code: string;
  code_type: 'registration' | 'password_reset';
  
  // 验证状态
  is_used: boolean;
  used_at?: string;
  
  // 有效期控制
  expires_at: string;
  created_at?: string;
}

// 用户注册请求接口
export interface UserRegistrationRequest {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  verification_code: string;
}

// 用户登录请求接口
export interface UserLoginRequest {
  email: string;
  password: string;
}

// 用户宠物档案接口
export interface UserPet {
  id: string;
  user_id: string;
  name: string;                      // 宠物昵称
  breed_id?: string;                 // 品种ID（关联到pet_breeds）
  custom_breed?: string;             // 自定义品种名称
  
  // 基本信息
  gender?: 'male' | 'female' | 'unknown';
  birth_date?: string;               // 出生日期
  color?: string;                    // 毛色
  weight?: number;                   // 体重
  weight_unit?: 'kg' | 'lb';
  
  // 识别信息
  chip_number?: string;              // 芯片号码
  registration_number?: string;      // 注册号码
  photo_url?: string;                // 照片URL
  
  // 领养/购买信息
  adoption_date?: string;            // 领养日期
  source?: string;                   // 来源（如：收容所、繁殖者、朋友等）
  
  // 状态
  status: 'active' | 'archived' | 'deceased';
  is_neutered?: boolean;             // 是否已绝育
  
  // 备注
  notes?: string;
  
  // 系统字段
  created_at?: string;
  updated_at?: string;
}

// 健康记录类型
export interface HealthRecord {
  id: string;
  pet_id: string;
  record_type: 'vaccine' | 'deworming' | 'checkup' | 'illness' | 'surgery' | 'other';
  
  // 记录详情
  title: string;
  description?: string;
  date: string;                      // 记录日期
  
  // 医疗信息
  veterinarian?: string;             // 兽医
  clinic?: string;                   // 诊所/医院
  diagnosis?: string;                // 诊断
  treatment?: string;                // 治疗方案
  medication?: string;               // 用药
  
  // 疫苗/驱虫特定
  vaccine_name?: string;             // 疫苗名称
  next_due_date?: string;            // 下次接种日期
  
  // 附件
  attachments?: string[];            // 文件URL数组（如：报告、化验单等）
  
  // 费用
  cost?: number;
  cost_currency?: string;
  
  // 系统字段
  created_at?: string;
  updated_at?: string;
}

// 健康提醒接口
export interface HealthReminder {
  id: string;
  pet_id: string;
  reminder_type: 'vaccine' | 'deworming' | 'checkup' | 'medication' | 'grooming' | 'custom';
  
  // 提醒详情
  title: string;
  description?: string;
  
  // 时间设置
  remind_date: string;               // 提醒日期
  repeat_type?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  repeat_interval?: number;          // 重复间隔（配合repeat_type使用）
  
  // 提前提醒
  advance_days?: number;             // 提前几天提醒
  
  // 状态
  is_completed: boolean;
  completed_at?: string;
  is_active: boolean;                // 是否启用
  
  // 关联的健康记录
  related_record_id?: string;
  
  // 系统字段
  created_at?: string;
  updated_at?: string;
}

// 体重记录接口
export interface WeightRecord {
  id: string;
  pet_id: string;
  weight: number;
  weight_unit: 'kg' | 'lb';
  record_date: string;
  notes?: string;
  created_at?: string;
}

// 日常日志接口
export interface DailyLog {
  id: string;
  pet_id: string;
  log_date: string;
  
  // 饮食
  food_intake?: 'normal' | 'less' | 'more' | 'none';
  water_intake?: 'normal' | 'less' | 'more' | 'none';
  
  // 排泄
  urination?: 'normal' | 'less' | 'more' | 'abnormal';
  defecation?: 'normal' | 'less' | 'more' | 'abnormal';
  
  // 活动
  activity_level?: 'normal' | 'less' | 'more';
  mood?: 'happy' | 'normal' | 'sad' | 'anxious';
  
  // 异常症状
  symptoms?: string[];
  
  // 备注
  notes?: string;
  
  // 系统字段
  created_at?: string;
  updated_at?: string;
}
