# 提醒功能数据库设计文档

## 概述

提醒功能使用现有的 `health_reminders` 表，扩展支持26种不同类型的提醒。

## 数据库表结构

### 主表：health_reminders

```sql
CREATE TABLE health_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES user_pets(id) ON DELETE CASCADE,
    
    -- 提醒类型（26种）
    reminder_type VARCHAR(20) NOT NULL,
    
    -- 提醒内容
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- 时间设置
    remind_date DATE NOT NULL,
    repeat_type VARCHAR(10) DEFAULT 'none',
    repeat_interval INTEGER DEFAULT 1,
    
    -- 提前提醒
    advance_days INTEGER DEFAULT 0,
    
    -- UI显示字段（新增）
    reminder_icon VARCHAR(50),
    reminder_color VARCHAR(20),
    
    -- 状态
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- 关联健康记录
    related_record_id UUID REFERENCES health_records(id) ON DELETE SET NULL,
    
    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 支持的26种提醒类型

### 医疗类（12种）
| 类型码 | 中文名 | 图标 | 颜色 |
|-------|--------|------|------|
| vaccine | 疫苗 | 📋 | #8b5cf6 |
| checkup | 体检 | 💉 | #f97316 |
| deworming | 驱虫 | 🐛 | #ec4899 |
| surgery | 手术 | ✖️ | #dc2626 |
| injection | 打针 | 💉 | #06b6d4 |
| medication | 吃药 | 💊 | #10b981 |
| blood_test | 血检 | 🩸 | #dc2626 |
| xray | 拍片 | 📷 | #4b5563 |
| ultrasound | B超 | 📺 | #3b82f6 |
| booster | 加强针 | 💉 | #84cc16 |
| allergy_test | 过敏测试 | ⚠️ | #a855f7 |
| recheck | 复查 | 📋 | #3b82f6 |

### 护理美容类（7种）
| 类型码 | 中文名 | 图标 | 颜色 |
|-------|--------|------|------|
| bath | 洗澡 | 💧 | #6366f1 |
| grooming | 美容 | ✂️ | #a78bfa |
| nail_trim | 剪指甲 | ✂️ | #a855f7 |
| ear_cleaning | 清洁耳朵 | 👂 | #06b6d4 |
| teeth_cleaning | 清洁牙齿 | 🦷 | #10b981 |
| dental_care | 洁牙 | 🦷 | #06b6d4 |
| grooming_appointment | 美容预约 | 📝 | #f97316 |

### 生活日常类（4种）
| 类型码 | 中文名 | 图标 | 颜色 |
|-------|--------|------|------|
| food_change | 换粮 | 🍽️ | #f97316 |
| weighing | 称重 | ⚖️ | #6b7280 |
| training | 训练 | 🎓 | #3b82f6 |
| boarding | 寄养 | 🏠 | #78716c |

### 生育类（3种）
| 类型码 | 中文名 | 图标 | 颜色 |
|-------|--------|------|------|
| breeding | 配种 | ❤️ | #ec4899 |
| prenatal_checkup | 产检 | 🤰 | #a855f7 |
| neutering | 绝育 | ➕ | #78716c |

## 部署步骤

### 1. 运行数据库迁移

在 Supabase 控制台的 SQL 编辑器中执行：

```bash
database/migrations/add_reminder_types.sql
```

此脚本会：
- 更新 `reminder_type` 字段的约束，支持26种类型
- 添加 `reminder_icon` 和 `reminder_color` 字段
- 创建 `reminder_type_mapping` 视图用于查询

### 2. 验证迁移

```sql
-- 检查视图是否创建成功
SELECT * FROM reminder_type_mapping ORDER BY type_name;

-- 检查表结构
\d health_reminders
```

### 3. 测试插入数据

```sql
-- 插入测试提醒
INSERT INTO health_reminders (
    pet_id,
    reminder_type,
    title,
    description,
    remind_date,
    reminder_icon,
    reminder_color
) VALUES (
    'YOUR_PET_ID',
    'vaccine',
    '狂犬病疫苗',
    '年度狂犬病疫苗接种',
    CURRENT_DATE + INTERVAL '7 days',
    '📋',
    '#8b5cf6'
);
```

## API 使用示例

### 创建提醒

```typescript
import { createReminder } from '@/lib/api/reminders';

const reminder = await createReminder('pet-id-here', {
  reminder_type: 'vaccine',
  title: '狂犬病疫苗',
  description: '年度疫苗接种',
  remind_date: '2026-03-10',
  repeat_type: 'yearly',
  advance_days: 7
});
```

### 获取宠物的所有待办提醒

```typescript
import { getPetReminders } from '@/lib/api/reminders';

const reminders = await getPetReminders('pet-id-here', {
  completed: false,
  active: true
});
```

### 获取即将到来的提醒（未来7天）

```typescript
import { getUpcomingReminders } from '@/lib/api/reminders';

const upcomingReminders = await getUpcomingReminders('pet-id-here', 7);
```

### 标记提醒为已完成

```typescript
import { completeReminder } from '@/lib/api/reminders';

await completeReminder('reminder-id-here');
```

### 删除提醒

```typescript
import { deleteReminder } from '@/lib/api/reminders';

await deleteReminder('reminder-id-here');
```

## 类型定义

所有类型定义在 `src/lib/supabase.ts` 中：

```typescript
// 提醒类型
export type ReminderType = 
  | 'vaccine' | 'checkup' | 'deworming' 
  | ... // 共26种

// 提醒接口
export interface HealthReminder {
  id: string;
  pet_id: string;
  reminder_type: ReminderType;
  title: string;
  description?: string;
  remind_date: string;
  reminder_icon?: string;
  reminder_color?: string;
  is_completed: boolean;
  is_active: boolean;
  // ... 其他字段
}
```

## 前端组件

提醒类型配置在 `src/lib/api/reminders.ts` 中：

```typescript
import { REMINDER_TYPE_CONFIGS, getReminderTypeConfig } from '@/lib/api/reminders';

// 获取所有类型配置
const allTypes = REMINDER_TYPE_CONFIGS;

// 根据类型码获取配置
const config = getReminderTypeConfig('vaccine');
// { type: 'vaccine', name: '疫苗', icon: '📋', color: '#8b5cf6' }
```

## 安全性

- 使用 Row Level Security (RLS) 确保用户只能访问自己宠物的提醒
- 所有 API 调用都通过 Supabase 客户端，自动应用 RLS 策略

## 索引优化

表中已创建以下索引：
- `idx_health_reminders_pet_id` - 宠物ID索引
- `idx_health_reminders_date` - 日期索引
- `idx_health_reminders_completed` - 完成状态索引
- `idx_health_reminders_active` - 激活状态索引

## 常见查询

### 获取今天需要提醒的事项

```sql
SELECT * FROM health_reminders
WHERE pet_id = 'xxx'
AND is_active = true
AND is_completed = false
AND remind_date = CURRENT_DATE;
```

### 获取过期未完成的提醒

```sql
SELECT * FROM health_reminders
WHERE pet_id = 'xxx'
AND is_active = true
AND is_completed = false
AND remind_date < CURRENT_DATE
ORDER BY remind_date DESC;
```

### 统计各类型提醒数量

```sql
SELECT 
    reminder_type,
    COUNT(*) as count
FROM health_reminders
WHERE pet_id = 'xxx'
AND is_completed = false
GROUP BY reminder_type
ORDER BY count DESC;
```

## 注意事项

1. **日期格式**：remind_date 使用 DATE 类型，格式为 'YYYY-MM-DD'
2. **时区**：created_at 和 updated_at 使用 TIMESTAMP WITH TIME ZONE
3. **重复提醒**：repeat_type 和 repeat_interval 配合使用实现定期提醒
4. **软删除**：建议使用 is_active = false 而不是直接删除记录
5. **级联删除**：删除宠物时会自动删除所有相关提醒

## 未来扩展

可以考虑添加：
- 提醒推送通知功能
- 提醒模板系统
- 批量创建提醒
- 提醒统计分析
- 导出提醒日历
