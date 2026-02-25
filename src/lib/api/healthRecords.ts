import { supabase, HealthRecord, HealthReminder, WeightRecord, DailyLog } from '../supabase';

// ============ 健康记录管理 ============

// 创建健康记录
export async function createHealthRecord(recordData: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>): Promise<HealthRecord | null> {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .insert([recordData])
      .select()
      .single();

    if (error) {
      console.error('创建健康记录失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('创建健康记录失败:', error);
    return null;
  }
}

// 获取宠物的所有健康记录
export async function getHealthRecords(petId: string, recordType?: string): Promise<HealthRecord[]> {
  try {
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('pet_id', petId)
      .order('date', { ascending: false });

    if (recordType) {
      query = query.eq('record_type', recordType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取健康记录失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取健康记录失败:', error);
    return [];
  }
}

// 更新健康记录
export async function updateHealthRecord(recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord | null> {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      console.error('更新健康记录失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('更新健康记录失败:', error);
    return null;
  }
}

// 删除健康记录
export async function deleteHealthRecord(recordId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      console.error('删除健康记录失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除健康记录失败:', error);
    return false;
  }
}

// ============ 健康提醒管理 ============

// 创建健康提醒
export async function createHealthReminder(reminderData: Omit<HealthReminder, 'id' | 'created_at' | 'updated_at'>): Promise<HealthReminder | null> {
  try {
    const { data, error } = await supabase
      .from('health_reminders')
      .insert([reminderData])
      .select()
      .single();

    if (error) {
      console.error('创建健康提醒失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('创建健康提醒失败:', error);
    return null;
  }
}

// 获取宠物的所有健康提醒
export async function getHealthReminders(petId: string, includeCompleted: boolean = false): Promise<HealthReminder[]> {
  try {
    let query = supabase
      .from('health_reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_active', true)
      .order('remind_date', { ascending: true });

    if (!includeCompleted) {
      query = query.eq('is_completed', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取健康提醒失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取健康提醒失败:', error);
    return [];
  }
}

// 获取即将到期的提醒
export async function getUpcomingReminders(petId: string, days: number = 7): Promise<HealthReminder[]> {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const { data, error } = await supabase
      .from('health_reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_active', true)
      .eq('is_completed', false)
      .gte('remind_date', today.toISOString().split('T')[0])
      .lte('remind_date', futureDate.toISOString().split('T')[0])
      .order('remind_date', { ascending: true });

    if (error) {
      console.error('获取即将到期的提醒失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取即将到期的提醒失败:', error);
    return [];
  }
}

// 更新健康提醒
export async function updateHealthReminder(reminderId: string, updates: Partial<HealthReminder>): Promise<HealthReminder | null> {
  try {
    const { data, error } = await supabase
      .from('health_reminders')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', reminderId)
      .select()
      .single();

    if (error) {
      console.error('更新健康提醒失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('更新健康提醒失败:', error);
    return null;
  }
}

// 完成提醒
export async function completeReminder(reminderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_reminders')
      .update({ 
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', reminderId);

    if (error) {
      console.error('完成提醒失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('完成提醒失败:', error);
    return false;
  }
}

// 删除健康提醒
export async function deleteHealthReminder(reminderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_reminders')
      .delete()
      .eq('id', reminderId);

    if (error) {
      console.error('删除健康提醒失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除健康提醒失败:', error);
    return false;
  }
}

// ============ 体重记录管理 ============

// 创建体重记录
export async function createWeightRecord(recordData: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord | null> {
  try {
    const { data, error } = await supabase
      .from('weight_records')
      .insert([recordData])
      .select()
      .single();

    if (error) {
      console.error('创建体重记录失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('创建体重记录失败:', error);
    return null;
  }
}

// 获取宠物的体重记录
export async function getWeightRecords(petId: string): Promise<WeightRecord[]> {
  try {
    const { data, error } = await supabase
      .from('weight_records')
      .select('*')
      .eq('pet_id', petId)
      .order('record_date', { ascending: false });

    if (error) {
      console.error('获取体重记录失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取体重记录失败:', error);
    return [];
  }
}

// 删除体重记录
export async function deleteWeightRecord(recordId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      console.error('删除体重记录失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除体重记录失败:', error);
    return false;
  }
}

// ============ 日常日志管理 ============

// 创建日常日志
export async function createDailyLog(logData: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>): Promise<DailyLog | null> {
  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .insert([logData])
      .select()
      .single();

    if (error) {
      console.error('创建日常日志失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('创建日常日志失败:', error);
    return null;
  }
}

// 获取宠物的日常日志
export async function getDailyLogs(petId: string, startDate?: string, endDate?: string): Promise<DailyLog[]> {
  try {
    let query = supabase
      .from('daily_logs')
      .select('*')
      .eq('pet_id', petId)
      .order('log_date', { ascending: false });

    if (startDate) {
      query = query.gte('log_date', startDate);
    }
    if (endDate) {
      query = query.lte('log_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取日常日志失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取日常日志失败:', error);
    return [];
  }
}

// 更新日常日志
export async function updateDailyLog(logId: string, updates: Partial<DailyLog>): Promise<DailyLog | null> {
  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', logId)
      .select()
      .single();

    if (error) {
      console.error('更新日常日志失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('更新日常日志失败:', error);
    return null;
  }
}

// 删除日常日志
export async function deleteDailyLog(logId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('daily_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      console.error('删除日常日志失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除日常日志失败:', error);
    return false;
  }
}

// 获取指定日期的日志
export async function getDailyLogByDate(petId: string, date: string): Promise<DailyLog | null> {
  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('pet_id', petId)
      .eq('log_date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到记录，这是正常情况
        return null;
      }
      console.error('获取日常日志失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('获取日常日志失败:', error);
    return null;
  }
}
