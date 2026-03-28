import { supabase, AnimalKnowledge } from '../supabase';

/**
 * 获取所有已发布的动物小知识（只显示已到发布时间的）
 * 按发布时间倒序排列
 */
export async function getPublishedAnimalKnowledge(): Promise<AnimalKnowledge[]> {
  try {
    const { data, error } = await supabase
      .from('animal_knowledge')
      .select('*')
      .lte('publish_datetime', new Date().toISOString())  // 只获取已到发布时间的
      .order('publish_datetime', { ascending: false });    // 按时间倒序

    if (error) {
      console.error('获取动物小知识失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取动物小知识失败:', error);
    return [];
  }
}

/**
 * 获取今日的动物小知识
 */
export async function getTodayAnimalKnowledge(): Promise<AnimalKnowledge | null> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const { data, error } = await supabase
      .from('animal_knowledge')
      .select('*')
      .gte('publish_datetime', startOfDay.toISOString())
      .lt('publish_datetime', endOfDay.toISOString())
      .lte('publish_datetime', new Date().toISOString())  // 只获取已到发布时间的
      .order('publish_datetime', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到数据，这不算错误
        return null;
      }
      console.error('获取今日动物小知识失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('获取今日动物小知识失败:', error);
    return null;
  }
}

/**
 * 获取最近N天的动物小知识
 * @param days 天数，默认7天
 */
export async function getRecentAnimalKnowledge(days: number = 7): Promise<AnimalKnowledge[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('animal_knowledge')
      .select('*')
      .gte('publish_datetime', startDate.toISOString())
      .lte('publish_datetime', new Date().toISOString())  // 只获取已到发布时间的
      .order('publish_datetime', { ascending: false });

    if (error) {
      console.error('获取最近动物小知识失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取最近动物小知识失败:', error);
    return [];
  }
}

/**
 * 根据ID获取动物小知识
 * @param id 小知识ID
 */
export async function getAnimalKnowledgeById(id: string): Promise<AnimalKnowledge | null> {
  try {
    const { data, error } = await supabase
      .from('animal_knowledge')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取动物小知识详情失败:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('获取动物小知识详情失败:', error);
    return null;
  }
}

/**
 * 搜索动物小知识（按内容搜索）
 * @param keyword 搜索关键词
 */
export async function searchAnimalKnowledge(keyword: string): Promise<AnimalKnowledge[]> {
  try {
    const { data, error } = await supabase
      .from('animal_knowledge')
      .select('*')
      .ilike('content', `%${keyword}%`)
      .lte('publish_datetime', new Date().toISOString())  // 只获取已到发布时间的
      .order('publish_datetime', { ascending: false });

    if (error) {
      console.error('搜索动物小知识失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('搜索动物小知识失败:', error);
    return [];
  }
}
