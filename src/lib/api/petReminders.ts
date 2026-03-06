import { supabase } from '@/lib/supabase';

// ============================================
// 类型定义
// ============================================

export type ReminderType = 
  | 'vaccine'              // 疫苗
  | 'checkup'              // 体检
  | 'deworming'            // 驱虫
  | 'bath'                 // 洗澡
  | 'grooming'             // 美容
  | 'surgery'              // 手术
  | 'nail_trim'            // 剪指甲
  | 'ear_cleaning'         // 清洁耳朵
  | 'teeth_cleaning'       // 清洁牙齿
  | 'food_change'          // 换粮
  | 'breeding'             // 配种
  | 'prenatal_checkup'     // 产检
  | 'neutering'            // 绝育
  | 'recheck'              // 复查
  | 'injection'            // 打针
  | 'medication'           // 吃药
  | 'weighing'             // 称重
  | 'blood_test'           // 血检
  | 'xray'                 // 拍片
  | 'ultrasound'           // B超
  | 'dental_care'          // 洁牙
  | 'booster'              // 加强针
  | 'allergy_test'         // 过敏测试
  | 'grooming_appointment' // 美容预约
  | 'training'             // 训练
  | 'boarding';            // 寄养

export interface PetReminder {
  id: string;
  pet_id: string;
  title: string;                // 记录名称
  reminder_type: ReminderType;  // 类型
  scheduled_date: string;       // 计划日期
  notes?: string;               // 备注
  is_completed: boolean;        // 是否完成
  completed_at?: string;        // 完成时间
  created_at?: string;
  updated_at?: string;
}

export interface ReminderTypeConfig {
  type_code: string;
  type_name: string;
  icon: string;
  color: string;
  display_order: number;
}

// ============================================
// 提醒类型配置
// ============================================

export const REMINDER_TYPES: ReminderTypeConfig[] = [
  { type_code: 'vaccine', type_name: '疫苗', icon: '📋', color: '#8b5cf6', display_order: 1 },
  { type_code: 'checkup', type_name: '体检', icon: '💉', color: '#f97316', display_order: 2 },
  { type_code: 'deworming', type_name: '驱虫', icon: '🐛', color: '#ec4899', display_order: 3 },
  { type_code: 'bath', type_name: '洗澡', icon: '💧', color: '#6366f1', display_order: 4 },
  { type_code: 'grooming', type_name: '美容', icon: '✂️', color: '#a78bfa', display_order: 5 },
  { type_code: 'surgery', type_name: '手术', icon: '✖️', color: '#dc2626', display_order: 6 },
  { type_code: 'nail_trim', type_name: '剪指甲', icon: '✂️', color: '#a855f7', display_order: 7 },
  { type_code: 'ear_cleaning', type_name: '清洁耳朵', icon: '👂', color: '#06b6d4', display_order: 8 },
  { type_code: 'teeth_cleaning', type_name: '清洁牙齿', icon: '🦷', color: '#10b981', display_order: 9 },
  { type_code: 'food_change', type_name: '换粮', icon: '🍽️', color: '#f97316', display_order: 10 },
  { type_code: 'breeding', type_name: '配种', icon: '❤️', color: '#ec4899', display_order: 11 },
  { type_code: 'prenatal_checkup', type_name: '产检', icon: '🤰', color: '#a855f7', display_order: 12 },
  { type_code: 'neutering', type_name: '绝育', icon: '➕', color: '#78716c', display_order: 13 },
  { type_code: 'recheck', type_name: '复查', icon: '📋', color: '#3b82f6', display_order: 14 },
  { type_code: 'injection', type_name: '打针', icon: '💉', color: '#06b6d4', display_order: 15 },
  { type_code: 'medication', type_name: '吃药', icon: '💊', color: '#10b981', display_order: 16 },
  { type_code: 'weighing', type_name: '称重', icon: '⚖️', color: '#6b7280', display_order: 17 },
  { type_code: 'blood_test', type_name: '血检', icon: '🩸', color: '#dc2626', display_order: 18 },
  { type_code: 'xray', type_name: '拍片', icon: '📷', color: '#4b5563', display_order: 19 },
  { type_code: 'ultrasound', type_name: 'B超', icon: '📺', color: '#3b82f6', display_order: 20 },
  { type_code: 'dental_care', type_name: '洁牙', icon: '🦷', color: '#06b6d4', display_order: 21 },
  { type_code: 'booster', type_name: '加强针', icon: '💉', color: '#84cc16', display_order: 22 },
  { type_code: 'allergy_test', type_name: '过敏测试', icon: '⚠️', color: '#a855f7', display_order: 23 },
  { type_code: 'grooming_appointment', type_name: '美容预约', icon: '📝', color: '#f97316', display_order: 24 },
  { type_code: 'training', type_name: '训练', icon: '🎓', color: '#3b82f6', display_order: 25 },
  { type_code: 'boarding', type_name: '寄养', icon: '🏠', color: '#78716c', display_order: 26 }
];

// ============================================
// 工具函数
// ============================================

export function getReminderTypeConfig(typeCode: string): ReminderTypeConfig | undefined {
  return REMINDER_TYPES.find(t => t.type_code === typeCode);
}

export function getReminderTypeByName(name: string): string | undefined {
  return REMINDER_TYPES.find(t => t.type_name === name)?.type_code;
}

// ============================================
// API 函数
// ============================================

/**
 * 创建新提醒
 */
export async function createReminder(data: {
  pet_id: string;
  title: string;
  reminder_type: ReminderType;
  scheduled_date: string;
  notes?: string;
}): Promise<PetReminder | null> {
  try {
    const { data: reminder, error } = await supabase
      .from('pet_reminders')
      .insert({
        pet_id: data.pet_id,
        title: data.title,
        reminder_type: data.reminder_type,
        scheduled_date: data.scheduled_date,
        notes: data.notes || null,
        is_completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('创建提醒失败:', error);
      return null;
    }

    return reminder;
  } catch (error) {
    console.error('创建提醒异常:', error);
    return null;
  }
}

/**
 * 获取宠物的待办提醒
 */
export async function getPendingReminders(petId: string): Promise<PetReminder[]> {
  try {
    const { data, error } = await supabase
      .from('pet_reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_completed', false)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('获取待办提醒失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取待办提醒异常:', error);
    return [];
  }
}

/**
 * 获取宠物的历史记录
 */
export async function getCompletedReminders(petId: string): Promise<PetReminder[]> {
  try {
    const { data, error } = await supabase
      .from('pet_reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('获取历史记录失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取历史记录异常:', error);
    return [];
  }
}

/**
 * 获取所有提醒（待办 + 历史）
 */
export async function getAllReminders(petId: string): Promise<PetReminder[]> {
  try {
    const { data, error } = await supabase
      .from('pet_reminders')
      .select('*')
      .eq('pet_id', petId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('获取提醒列表失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取提醒列表异常:', error);
    return [];
  }
}

/**
 * 更新提醒
 */
export async function updateReminder(
  id: string,
  updates: Partial<PetReminder>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pet_reminders')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('更新提醒失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('更新提醒异常:', error);
    return false;
  }
}

/**
 * 标记提醒为已完成
 */
export async function completeReminder(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pet_reminders')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('标记完成失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('标记完成异常:', error);
    return false;
  }
}

/**
 * 删除提醒
 */
export async function deleteReminder(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pet_reminders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除提醒失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除提醒异常:', error);
    return false;
  }
}

/**
 * 获取即将到来的提醒（未来N天内）
 */
export async function getUpcomingReminders(
  petId: string,
  daysAhead: number = 7
): Promise<PetReminder[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('pet_reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_completed', false)
      .gte('scheduled_date', today)
      .lte('scheduled_date', futureDateStr)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('获取即将到来的提醒失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取即将到来的提醒异常:', error);
    return [];
  }
}
