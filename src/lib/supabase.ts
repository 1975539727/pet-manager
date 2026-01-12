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
