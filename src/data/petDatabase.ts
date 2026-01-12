// 宠物详细信息数据库表结构设计

export interface PetDetail {
  // 基础信息
  id: string;                    // 宠物品种唯一标识符
  name: string;                  // 宠物品种名称
  englishName?: string;          // 英文名称
  category: 'dog' | 'cat' | 'small' | 'aquatic' | 'reptile' | 'hot'; // 分类
  icon: string;                  // 图标/表情符号
  images?: string[];             // 宠物图片数组
  
  // 基本特征
  characteristics: {
    size: 'small' | 'medium' | 'large';     // 体型大小
    weight?: string;                        // 体重范围（如："2-5kg"）
    height?: string;                        // 身高范围（如："20-30cm"）
    lifespan?: string;                      // 寿命（如："12-15年"）
    temperament: string[];                  // 性格特点（如：["友好", "活泼", "聪明"]）
    activityLevel: 'low' | 'medium' | 'high'; // 活动量
    groomingNeeds: 'low' | 'medium' | 'high'; // 美容需求
  };
  
  // 外观描述
  appearance: {
    coatType?: string;           // 毛发类型（如："长毛"、"短毛"、"卷毛"）
    coatColors: string[];        // 毛色（如：["黑色", "白色", "棕色"]）
    description: string;         // 外观描述
  };
  
  // 饲养信息
  careInfo: {
    difficulty: 'easy' | 'medium' | 'hard';  // 饲养难度
    livingSpace: string[];       // 适合的居住空间（如：["公寓", "别墅", "室外"]）
    climate?: string[];          // 适合的气候（如：["温带", "热带"]）
    specialNeeds?: string[];     // 特殊需求（如：["定期修剪", "大量运动"]）
    feedingInfo: {
      diet: string;              // 饮食类型（如："商业猫粮", "活体饲料"）
      frequency: string;         // 喂食频率（如："每天2次"）
      specialDiet?: string;      // 特殊饮食要求
    };
  };
  
  // 健康信息
  health: {
    commonDiseases?: string[];   // 常见疾病
    vaccinations?: string[];     // 需要的疫苗
    healthTips: string[];        // 健康护理建议
  };
  
  // 训练信息
  training?: {
    trainability: 'low' | 'medium' | 'high'; // 可训练性
    basicCommands?: string[];    // 基础训练命令
    tips?: string[];             // 训练建议
  };
  
  // 价格信息
  pricing?: {
    priceRange: string;          // 价格范围（如："1000-3000元"）
    factors?: string[];          // 影响价格的因素
  };
  
  // 适合人群
  suitableFor: {
    beginner: boolean;           // 是否适合新手
    children: boolean;           // 是否适合有孩子的家庭
    elderly: boolean;            // 是否适合老年人
    apartments: boolean;         // 是否适合公寓生活
    busyOwners: boolean;         // 是否适合忙碌的主人
  };
  
  // 额外信息
  funFacts?: string[];           // 趣味小知识
  tips: string[];                // 饲养建议
  relatedBreeds?: string[];      // 相关品种ID
  
  // 数据元信息
  meta: {
    createdAt: string;           // 创建时间
    updatedAt: string;           // 更新时间
    dataSource?: string;         // 数据来源
    verified: boolean;           // 是否已验证
  };
}

// 宠物详情数据库
export const petDatabase: Record<string, PetDetail> = {
  // 示例：金毛寻回犬数据
  "golden": {
    id: "golden",
    name: "金毛寻回犬",
    englishName: "Golden Retriever",
    category: "dog",
    icon: "🦮",
    images: [
      "/images/pets/golden_retriever_1.jpg",
      "/images/pets/golden_retriever_2.jpg"
    ],
    
    characteristics: {
      size: "large",
      weight: "25-32kg",
      height: "51-61cm",
      lifespan: "10-12年",
      temperament: ["友好", "聪明", "忠诚", "温和", "活泼"],
      activityLevel: "high",
      groomingNeeds: "medium"
    },
    
    appearance: {
      coatType: "中长毛",
      coatColors: ["金色", "浅金色", "深金色"],
      description: "拥有美丽的金色被毛，体型匀称，表情友善，眼神充满智慧。"
    },
    
    careInfo: {
      difficulty: "easy",
      livingSpace: ["别墅", "大户型", "有院子的房屋"],
      climate: ["温带", "亚热带"],
      specialNeeds: ["每日运动", "定期梳毛", "社交训练"],
      feedingInfo: {
        diet: "高质量商业狗粮",
        frequency: "成年犬每天2次",
        specialDiet: "避免过量食物，容易肥胖"
      }
    },
    
    health: {
      commonDiseases: ["髋关节发育不良", "眼部疾病", "皮肤过敏"],
      vaccinations: ["狂犬疫苗", "六联疫苗"],
      healthTips: ["定期检查关节健康", "注意体重控制", "定期清洁耳朵"]
    },
    
    training: {
      trainability: "high",
      basicCommands: ["坐下", "等待", "过来", "握手", "躺下"],
      tips: ["正向激励训练", "从小开始社交", "保持训练的一致性"]
    },
    
    pricing: {
      priceRange: "1500-5000元",
      factors: ["血统纯正度", "父母获奖情况", "地区差异"]
    },
    
    suitableFor: {
      beginner: true,
      children: true,
      elderly: false,
      apartments: false,
      busyOwners: false
    },
    
    funFacts: [
      "金毛是最受欢迎的家庭宠物之一",
      "具有出色的游泳能力",
      "经常被训练为导盲犬和搜救犬"
    ],
    
    tips: [
      "需要大量运动和心理刺激",
      "定期梳毛可减少掉毛",
      "早期社交化非常重要",
      "适合与儿童互动"
    ],
    
    relatedBreeds: ["labrador", "border"],
    
    meta: {
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08",
      dataSource: "专业宠物百科",
      verified: true
    }
  },
  
  // 可以继续添加其他宠物的详细信息...
};

// 根据ID获取宠物详情的辅助函数
export function getPetDetail(id: string): PetDetail | undefined {
  return petDatabase[id];
}

// 根据分类获取所有宠物详情
export function getPetDetailsByCategory(category: string): PetDetail[] {
  return Object.values(petDatabase).filter(pet => pet.category === category);
}

// 搜索宠物详情
export function searchPets(query: string): PetDetail[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(petDatabase).filter(pet => 
    pet.name.toLowerCase().includes(lowerQuery) ||
    pet.englishName?.toLowerCase().includes(lowerQuery) ||
    pet.characteristics.temperament.some(trait => 
      trait.toLowerCase().includes(lowerQuery)
    )
  );
}

// 获取推荐宠物（基于适合人群）
export function getRecommendedPets(
  criteria: Partial<PetDetail['suitableFor']>
): PetDetail[] {
  return Object.values(petDatabase).filter(pet => {
    return Object.entries(criteria).every(([key, value]) => {
      return pet.suitableFor[key as keyof PetDetail['suitableFor']] === value;
    });
  });
}
