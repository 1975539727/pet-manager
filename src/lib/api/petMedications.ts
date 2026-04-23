import { supabase } from '@/lib/supabase';

// ============================================
// 类型定义
// ============================================

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface PetMedication {
  id: string;
  pet_id: string;
  medication_name: string;       // 用药名称
  dosage?: number;               // 剂量（可选）
  dosage_unit?: string;          // 剂量单位（可选）
  start_date: string;            // 开始日期
  reminder_time?: string;        // 提醒时间
  repeat_type: RepeatType;       // 重复设置
  notes?: string;                // 备注（可选）
  is_completed: boolean;         // 是否完成
  completed_at?: string;         // 完成时间
  created_at?: string;
  updated_at?: string;
}

// 新增用药计划的请求参数
export interface CreateMedicationRequest {
  pet_id: string;
  medication_name: string;
  dosage?: number;
  dosage_unit?: string;
  start_date: string;
  reminder_time?: string;
  repeat_type: RepeatType;
  notes?: string;
}

// ============================================
// API 函数
// ============================================

/**
 * 创建新用药计划
 */
export async function createMedication(data: CreateMedicationRequest): Promise<PetMedication | null> {
  try {
    const { data: medication, error } = await supabase
      .from('pet_medications')
      .insert({
        pet_id: data.pet_id,
        medication_name: data.medication_name,
        dosage: data.dosage || null,
        dosage_unit: data.dosage_unit || null,
        start_date: data.start_date,
        reminder_time: data.reminder_time || null,
        repeat_type: data.repeat_type || 'none',
        notes: data.notes || null,
        is_completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('创建用药计划失败:', error);
      return null;
    }

    return medication;
  } catch (error) {
    console.error('创建用药计划异常:', error);
    return null;
  }
}

/**
 * 获取宠物的待办用药计划
 */
export async function getPendingMedications(petId: string): Promise<PetMedication[]> {
  try {
    const { data, error } = await supabase
      .from('pet_medications')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_completed', false)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('获取待办用药计划失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取待办用药计划异常:', error);
    return [];
  }
}

/**
 * 获取宠物的历史用药记录
 */
export async function getCompletedMedications(petId: string): Promise<PetMedication[]> {
  try {
    const { data, error } = await supabase
      .from('pet_medications')
      .select('*')
      .eq('pet_id', petId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('获取历史用药记录失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取历史用药记录异常:', error);
    return [];
  }
}

/**
 * 获取所有用药计划（待办 + 历史）
 */
export async function getAllMedications(petId: string): Promise<PetMedication[]> {
  try {
    const { data, error } = await supabase
      .from('pet_medications')
      .select('*')
      .eq('pet_id', petId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('获取用药列表失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取用药列表异常:', error);
    return [];
  }
}

/**
 * 标记用药计划为已完成
 */
export async function completeMedication(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pet_medications')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('标记用药完成失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('标记用药完成异常:', error);
    return false;
  }
}

/**
 * 删除用药计划
 */
export async function deleteMedication(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pet_medications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除用药计划失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除用药计划异常:', error);
    return false;
  }
}
