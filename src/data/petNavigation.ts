export interface PetBreed {
  id: string;
  name: string;
  icon: string; // 将来用于存储图标路径或emoji
  category: string;
}

export interface PetCategory {
  id: string;
  name: string;
  isActive?: boolean;
  breeds: PetBreed[];
}

export const petCategories: PetCategory[] = [
  {
    id: 'hot',
    name: '热宠导航',
    isActive: false,
    breeds: []
  },
  {
    id: 'dog',
    name: '狗狗',
    isActive: true,
    breeds: [
      // 第一行
      { id: 'poodle', name: '贵宾犬', icon: '🐩', category: 'dog' },
      { id: 'bichon', name: '比熊', icon: '🐕', category: 'dog' },
      { id: 'pomeranian', name: '博美', icon: '🦮', category: 'dog' },
      { id: 'schnauzer', name: '雪纳瑞', icon: '🐕‍🦺', category: 'dog' },
      { id: 'yorkshire', name: '约克夏梗', icon: '🐶', category: 'dog' },
      { id: 'maltese', name: '马尔济斯犬', icon: '🐕', category: 'dog' },
      { id: 'corgi', name: '威尔士柯基犬', icon: '🦮', category: 'dog' },
      { id: 'shiba', name: '柴犬', icon: '🐕‍🦺', category: 'dog' },
      { id: 'border', name: '边牧', icon: '🐶', category: 'dog' },
      // 第二行
      { id: 'german_shepherd', name: '德国牧羊犬', icon: '🐕', category: 'dog' },
      { id: 'golden', name: '金毛', icon: '🦮', category: 'dog' },
      { id: 'chow', name: '松狮犬', icon: '🐕', category: 'dog' },
      { id: 'french_bulldog', name: '法国斗牛犬', icon: '🐶', category: 'dog' },
      { id: 'samoyed', name: '萨摩耶犬', icon: '🐕', category: 'dog' },
      { id: 'labrador', name: '拉布拉多犬', icon: '🦮', category: 'dog' },
      { id: 'husky', name: '哈士奇', icon: '🐕‍🦺', category: 'dog' },
      { id: 'rottweiler', name: '罗威纳犬', icon: '🐶', category: 'dog' }
    ]
  },
  {
    id: 'cat',
    name: '猫咪',
    isActive: false,
    breeds: [
      // 第一行
      { id: 'chinchilla_cat', name: '金吉拉', icon: '🐱', category: 'cat' },
      { id: 'silver_tabby', name: '银虎斑', icon: '🐈', category: 'cat' },
      { id: 'orange_cat', name: '橘猫', icon: '🐱', category: 'cat' },
      { id: 'russian_blue', name: '荚短', icon: '🐈', category: 'cat' },
      { id: 'american_shorthair', name: '美短', icon: '🐱', category: 'cat' },
      { id: 'abyssinian', name: '阿比西尼亚猫', icon: '🐈', category: 'cat' },
      { id: 'oriental_shorthair', name: '奇耳东短猫', icon: '🐱', category: 'cat' },
      { id: 'selkirk_rex', name: '伊罗猫', icon: '🐈', category: 'cat' },
      { id: 'exotic_shorthair', name: '异国短毛猫', icon: '🐱', category: 'cat' },
      // 第二行
      { id: 'lykoi', name: '墨文森毛猫', icon: '🐈', category: 'cat' },
      { id: 'cornish_rex', name: '康沃斯', icon: '🐈', category: 'cat' },
      { id: 'ragdoll', name: '布偶猫', icon: '🐈', category: 'cat' },
      { id: 'devon_rex', name: '德文森林猫', icon: '🐱', category: 'cat' },
      { id: 'exotic_longhair', name: '异短袖猫', icon: '🐈', category: 'cat' },
      { id: 'persian', name: '波斯猫', icon: '🐱', category: 'cat' },
      { id: 'scottish_fold', name: '苏格兰折耳猫', icon: '🐈', category: 'cat' },
      { id: 'turkish_angora', name: '土耳其安哥拉猫', icon: '🐱', category: 'cat' }
    ]
  },
  {
    id: 'small',
    name: '小宠',
    isActive: false,
    breeds: [
      // 第一行
      { id: 'hamster', name: '仓鼠', icon: '🐹', category: 'small' },
      { id: 'guinea_pig', name: '豚鼠', icon: '🐭', category: 'small' },
      { id: 'netherland_dwarf', name: '荷兰侏儒兔', icon: '🐰', category: 'small' },
      { id: 'lop_rabbit', name: '垂耳兔', icon: '🐇', category: 'small' },
      { id: 'squirrel', name: '松鼠', icon: '🐿️', category: 'small' },
      { id: 'sea_rabbit', name: '海星兔', icon: '🐰', category: 'small' },
      { id: 'angora_rabbit', name: '安哥拉兔', icon: '🐇', category: 'small' },
      { id: 'hedgehog', name: '刺猬', icon: '🦔', category: 'small' },
      { id: 'golden_hamster', name: '黄金仓鼠', icon: '🐹', category: 'small' },
      // 第二行
      { id: 'chinchilla_small', name: '毛丝鼠', icon: '🐭', category: 'small' },
      { id: 'mini_pig', name: '小雪猪', icon: '🐷', category: 'small' },
      { id: 'sugar_glider', name: '蜜袋鼯', icon: '🐨', category: 'small' },
      { id: 'djungarian_hamster', name: '仓仓鼠', icon: '🐹', category: 'small' },
      { id: 'campbell_hamster', name: '加卡利亚仓鼠', icon: '🐭', category: 'small' },
      { id: 'fancy_rat', name: '花枝鼠', icon: '🐀', category: 'small' },
      { id: 'roborovski_hamster', name: '罗伯罗夫斯基仓鼠', icon: '🐹', category: 'small' },
      { id: 'dwarf_rabbit', name: '多瓦夫兔', icon: '🐇', category: 'small' }
    ]
  },
  {
    id: 'aquatic',
    name: '水族',
    isActive: false,
    breeds: [
      // 第一行
      { id: 'koi', name: '锦鲤', icon: '🐟', category: 'aquatic' },
      { id: 'arowana', name: '龙鱼', icon: '🐠', category: 'aquatic' },
      { id: 'clownfish', name: '小丑鱼', icon: '🐠', category: 'aquatic' },
      { id: 'betta', name: '斗鱼', icon: '🐟', category: 'aquatic' },
      { id: 'flowerhorn', name: '罗汉鱼', icon: '🐠', category: 'aquatic' },
      { id: 'parrotfish', name: '鹦鹉鱼', icon: '🐟', category: 'aquatic' },
      { id: 'silver_dollar', name: '金钱鱼', icon: '🐠', category: 'aquatic' },
      { id: 'golden_crab', name: '金层蟹', icon: '🦀', category: 'aquatic' },
      { id: 'brazilian_turtle', name: '巴西彩龟', icon: '🐢', category: 'aquatic' },
      // 第二行
      { id: 'seahorse', name: '体像海马', icon: '🐠', category: 'aquatic' },
      { id: 'sea_urchin', name: '海胆', icon: '🦔', category: 'aquatic' },
      { id: 'pea_crab', name: '豌豆蟹', icon: '🦀', category: 'aquatic' },
      { id: 'ceramic_fish', name: '核体慢虾陶鱼', icon: '🐟', category: 'aquatic' },
      { id: 'crystal_shrimp', name: '戴氏琥珀虾', icon: '🦐', category: 'aquatic' },
      { id: 'razorfish', name: '剧刀鱼', icon: '🐠', category: 'aquatic' },
      { id: 'peacock_eel', name: '孔雀花鳗', icon: '🐟', category: 'aquatic' },
      { id: 'goldfish', name: '金鱼', icon: '🐠', category: 'aquatic' }
    ]
  },
  {
    id: 'reptile',
    name: '爬虫',
    isActive: false,
    breeds: [
      // 第一行
      { id: 'bearded_dragon', name: '鬃狮龙蜥', icon: '🦎', category: 'reptile' },
      { id: 'black_mamba', name: '黑曼巴蛇', icon: '🐍', category: 'reptile' },
      { id: 'chameleon', name: '变色龙', icon: '🦎', category: 'reptile' },
      { id: 'red_eye_tree_frog', name: '红眼树蛙蛤', icon: '🐸', category: 'reptile' },
      { id: 'mexican_redknee', name: '墨西哥红膝头', icon: '🕷️', category: 'reptile' },
      { id: 'bamboo_viper', name: '竹叶蛇', icon: '🐍', category: 'reptile' },
      { id: 'red_scorpion', name: '多红蝎', icon: '🦂', category: 'reptile' },
      { id: 'burmese_python', name: '洲蝉拉斯蚺蛇', icon: '🐍', category: 'reptile' },
      { id: 'leopard_gecko', name: '豹纹蛇', icon: '🦎', category: 'reptile' },
      // 第二行
      { id: 'water_monitor', name: '水巨蜥', icon: '🦎', category: 'reptile' },
      { id: 'three_line_snake', name: '三蛇晰', icon: '🐍', category: 'reptile' },
      { id: 'anaconda', name: '水蚺', icon: '🐍', category: 'reptile' },
      { id: 'pig_nose', name: '猪鼻', icon: '🐢', category: 'reptile' },
      { id: 'albino_python', name: '白化林蚺', icon: '🐍', category: 'reptile' },
      { id: 'tokay_gecko', name: '约克守宫', icon: '🦎', category: 'reptile' },
      { id: 'corn_snake', name: '玉米蛇', icon: '🐍', category: 'reptile' },
      { id: 'green_tree_python', name: '雨林蟒', icon: '🐍', category: 'reptile' }
    ]
  }
];
