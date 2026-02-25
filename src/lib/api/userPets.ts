import { supabase, UserPet } from '../supabase';

// 创建宠物档案
export async function createUserPet(petData: Omit<UserPet, 'id' | 'created_at' | 'updated_at'>): Promise<UserPet | null> {
  try {
    const { data, error } = await supabase
      .from('user_pets')
      .insert([petData])
      .select()
      .single();

    if (error) {
      console.error('创建宠物档案失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('创建宠物档案失败:', error);
    return null;
  }
}

// 获取用户的所有宠物档案
export async function getUserPets(userId: string, includeArchived: boolean = false): Promise<UserPet[]> {
  try {
    let query = supabase
      .from('user_pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!includeArchived) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取宠物档案失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取宠物档案失败:', error);
    return [];
  }
}

// 获取单个宠物档案详情
export async function getUserPetById(petId: string): Promise<UserPet | null> {
  try {
    const { data, error } = await supabase
      .from('user_pets')
      .select('*')
      .eq('id', petId)
      .single();

    if (error) {
      console.error('获取宠物详情失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('获取宠物详情失败:', error);
    return null;
  }
}

// 更新宠物档案
export async function updateUserPet(petId: string, updates: Partial<UserPet>): Promise<UserPet | null> {
  try {
    const { data, error } = await supabase
      .from('user_pets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', petId)
      .select()
      .single();

    if (error) {
      console.error('更新宠物档案失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('更新宠物档案失败:', error);
    return null;
  }
}

// 归档宠物档案
export async function archiveUserPet(petId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_pets')
      .update({ 
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', petId);

    if (error) {
      console.error('归档宠物档案失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('归档宠物档案失败:', error);
    return false;
  }
}

// 删除宠物档案（物理删除）
export async function deleteUserPet(petId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_pets')
      .delete()
      .eq('id', petId);

    if (error) {
      console.error('删除宠物档案失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除宠物档案失败:', error);
    return false;
  }
}

// 搜索用户的宠物
export async function searchUserPets(userId: string, query: string): Promise<UserPet[]> {
  try {
    const { data, error } = await supabase
      .from('user_pets')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,custom_breed.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('搜索宠物失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('搜索宠物失败:', error);
    return [];
  }
}

// 恢复归档的宠物
export async function restoreUserPet(petId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_pets')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', petId);

    if (error) {
      console.error('恢复宠物档案失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('恢复宠物档案失败:', error);
    return false;
  }
}
