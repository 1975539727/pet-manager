import { supabase, HealthReminder, ReminderType, ReminderTypeConfig } from '@/lib/supabase';

// 提醒类型配置数据
export const REMINDER_TYPE_CONFIGS: ReminderTypeConfig[] = [
  // 医疗类
  { type: 'vaccine', name: '疫苗', icon: '📋', color: '#8b5cf6' },
  { type: 'checkup', name: '体检', icon: '💉', color: '#f97316' },
  { type: 'deworming', name: '驱虫', icon: '🐛', color: '#ec4899' },
  { type: 'surgery', name: '手术', icon: '✖️', color: '#dc2626' },
  { type: 'injection', name: '打针', icon: '💉', color: '#06b6d4' },
  { type: 'medication', name: '吃药', icon: '💊', color: '#10b981' },
  { type: 'blood_test', name: '血检', icon: '🩸', color: '#dc2626' },
  { type: 'xray', name: '拍片', icon: '📷', color: '#4b5563' },
  { type: 'ultrasound', name: 'B超', icon: '📺', color: '#3b82f6' },
  { type: 'booster', name: '加强针', icon: '💉', color: '#84cc16' },
  { type: 'allergy_test', name: '过敏测试', icon: '⚠️', color: '#a855f7' },
  { type: 'recheck', name: '复查', icon: '📋', color: '#3b82f6' },
  
  // 护理美容类
  { type: 'bath', name: '洗澡', icon: '💧', color: '#6366f1' },
  { type: 'grooming', name: '美容', icon: '✂️', color: '#a78bfa' },
  { type: 'nail_trim', name: '剪指甲', icon: '✂️', color: '#a855f7' },
  { type: 'ear_cleaning', name: '清洁耳朵', icon: '👂', color: '#06b6d4' },
  { type: 'teeth_cleaning', name: '清洁牙齿', icon: '🦷', color: '#10b981' },
  { type: 'dental_care', name: '洁牙', icon: '🦷', color: '#06b6d4' },
  { type: 'grooming_appointment', name: '美容预约', icon: '📝', color: '#f97316' },
  
  // 生活日常类
  { type: 'food_change', name: '换粮', icon: '🍽️', color: '#f97316' },
  { type: 'weighing', name: '称重', icon: '⚖️', color: '#6b7280' },
  { type: 'training', name: '训练', icon: '🎓', color: '#3b82f6' },
  { type: 'boarding', name: '寄养', icon: '🏠', color: '#78716c' },
  
  // 生育类
  { type: 'breeding', name: '配种', icon: '❤️', color: '#ec4899' },
  { type: 'prenatal_checkup', name: '产检', icon: '🤰', color: '#a855f7' },
  { type: 'neutering', name: '绝育', icon: '➕', color: '#78716c' }
];

// 根据类型码获取配置
export function getReminderTypeConfig(type: ReminderType): ReminderTypeConfig | undefined {
  return REMINDER_TYPE_CONFIGS.find(config => config.type === type);
}

// 根据中文名称获取类型码
export function getReminderTypeByName(name: string): ReminderType | undefined {
  return REMINDER_TYPE_CONFIGS.find(config => config.name === name)?.type;
}

// 创建提醒
export async function createReminder(
  petId: string,
  data: {
    reminder_type: ReminderType;
    title: string;
    description?: string;
    remind_date: string;
    repeat_type?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    advance_days?: number;
  }
): Promise<HealthReminder | null> {
  try {
    const config = getReminderTypeConfig(data.reminder_type);
    
    const { data: reminder, error } = await supabase
      .from('health_reminders')
      .insert({
        pet_id: petId,
        reminder_type: data.reminder_type,
        title: data.title,
        description: data.description || '',
        remind_date: data.remind_date,
        repeat_type: data.repeat_type || 'none',
        advance_days: data.advance_days || 0,
        reminder_icon: config?.icon,
        reminder_color: config?.color,
        is_completed: false,
        is_active: true
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

// 获取宠物的所有提醒
export async function getPetReminders(
  petId: string,
  filters?: {
    completed?: boolean;
    active?: boolean;
    startDate?: string;
    endDate?: string;
  }
): Promise<HealthReminder[]> {
  try {
    let query = supabase
      .from('health_reminders')
      .select('*')
      .eq('pet_id', petId);

    if (filters?.completed !== undefined) {
      query = query.eq('is_completed', filters.completed);
    }

    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    if (filters?.startDate) {
      query = query.gte('remind_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('remind_date', filters.endDate);
    }

    const { data, error } = await query.order('remind_date', { ascending: true });

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

// 更新提醒
export async function updateReminder(
  reminderId: string,
  updates: Partial<HealthReminder>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_reminders')
      .update(updates)
      .eq('id', reminderId);

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

// 标记提醒为已完成
export async function completeReminder(reminderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_reminders')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', reminderId);

    if (error) {
      console.error('标记提醒完成失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('标记提醒完成异常:', error);
    return false;
  }
}

// 删除提醒
export async function deleteReminder(reminderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_reminders')
      .delete()
      .eq('id', reminderId);

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

// 获取即将到来的提醒（未来N天内）
export async function getUpcomingReminders(
  petId: string,
  daysAhead: number = 7
): Promise<HealthReminder[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('health_reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_active', true)
      .eq('is_completed', false)
      .gte('remind_date', today)
      .lte('remind_date', futureDateStr)
      .order('remind_date', { ascending: true });

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
