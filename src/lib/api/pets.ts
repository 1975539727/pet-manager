import { supabase, FullPetInfo } from '../supabase';

// 获取完整的宠物信息（包含所有关联数据）
export async function getPetFullInfo(breedId: string): Promise<FullPetInfo | null> {
  try {
    // 获取基本宠物信息和分类
    const { data: petData, error: petError } = await supabase
      .from('pet_breeds')
      .select(`
        *,
        category:pet_categories(*)
      `)
      .eq('id', breedId)
      .single();

    if (petError || !petData) {
      console.error('获取宠物基本信息失败:', petError);
      return null;
    }

    // 获取详细信息
    const { data: detailsData, error: detailsError } = await supabase
      .from('pet_details')
      .select('*')
      .eq('breed_id', breedId)
      .single();

    // 获取性格特点
    const { data: temperamentsData, error: temperamentsError } = await supabase
      .from('pet_temperaments')
      .select('*')
      .eq('breed_id', breedId)
      .order('display_order');

    // 获取健康建议
    const { data: healthTipsData, error: healthTipsError } = await supabase
      .from('pet_health_tips')
      .select('*')
      .eq('breed_id', breedId)
      .order('priority_level', { ascending: false });

    // 获取训练命令
    const { data: trainingCommandsData, error: trainingCommandsError } = await supabase
      .from('pet_training_commands')
      .select('*')
      .eq('breed_id', breedId)
      .order('difficulty_level');

    // 组装完整信息
    const fullPetInfo: FullPetInfo = {
      ...petData,
      details: detailsData || undefined,
      temperaments: temperamentsData || [],
      health_tips: healthTipsData || [],
      training_commands: trainingCommandsData || []
    };

    return fullPetInfo;

  } catch (error) {
    console.error('获取宠物完整信息失败:', error);
    return null;
  }
}

// 获取所有宠物品种（用于主页导航）
export async function getAllPetBreeds() {
  try {
    const { data, error } = await supabase
      .from('pet_breeds')
      .select(`
        *,
        category:pet_categories(*)
      `)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('获取宠物品种失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取宠物品种失败:', error);
    return [];
  }
}

// 根据分类获取宠物品种
export async function getPetsByCategory(categoryId: string) {
  try {
    const { data, error } = await supabase
      .from('pet_breeds')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('获取分类宠物失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取分类宠物失败:', error);
    return [];
  }
}

// 获取所有分类
export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('pet_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('获取分类失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}
