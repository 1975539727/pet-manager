# 宠物提醒事项功能使用指南

## 功能概述

宠物提醒事项功能用于管理宠物的各种待办事项,包括疫苗、体检、驱虫、洗澡等26种类型的提醒。

## 数据库部署

### 1. 执行建表SQL

在 Supabase 控制台的 SQL 编辑器中执行：

```bash
database/pet_reminders.sql
```

这个脚本会创建：
- `pet_reminders` 表（主表）
- `reminder_types` 表（类型配置）
- 必要的索引和触发器
- RLS 安全策略

### 2. 验证部署

```sql
-- 检查表是否创建成功
SELECT * FROM pet_reminders LIMIT 1;
SELECT * FROM reminder_types ORDER BY display_order;

-- 应该返回26条类型记录
SELECT COUNT(*) FROM reminder_types;
```

## 数据表结构

### pet_reminders（提醒主表）

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | UUID | 主键 |
| pet_id | UUID | 宠物ID（外键） |
| title | VARCHAR(200) | 记录名称，例如：狂犬病疫苗 |
| reminder_type | VARCHAR(30) | 提醒类型，26种之一 |
| scheduled_date | DATE | 计划日期 |
| notes | TEXT | 备注（可选） |
| is_completed | BOOLEAN | 是否完成 |
| completed_at | TIMESTAMP | 完成时间 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### reminder_types（类型配置表）

| 字段 | 类型 | 说明 |
|-----|------|------|
| type_code | VARCHAR(30) | 类型代码（主键）|
| type_name | VARCHAR(50) | 类型中文名 |
| icon | VARCHAR(10) | 图标 |
| color | VARCHAR(20) | 颜色 |
| display_order | INTEGER | 显示顺序 |

## 前端使用

### 导入API

```typescript
import {
  createReminder,
  getPendingReminders,
  getCompletedReminders,
  completeReminder,
  deleteReminder,
  REMINDER_TYPES
} from '@/lib/api/petReminders';
```

### 创建新提醒

```typescript
const reminder = await createReminder({
  pet_id: 'pet-uuid-here',
  title: '狂犬病疫苗',
  reminder_type: 'vaccine',
  scheduled_date: '2026-03-10',
  notes: '预约了XX宠物医院'
});
```

### 获取待办提醒

```typescript
const pending = await getPendingReminders('pet-uuid-here');
// 返回未完成的提醒，按日期升序排列
```

### 获取历史记录

```typescript
const completed = await getCompletedReminders('pet-uuid-here');
// 返回已完成的提醒，按完成时间降序排列
```

### 标记提醒完成

```typescript
const success = await completeReminder('reminder-uuid-here');
```

### 删除提醒

```typescript
const success = await deleteReminder('reminder-uuid-here');
```

### 获取所有类型配置

```typescript
import { REMINDER_TYPES } from '@/lib/api/petReminders';

// REMINDER_TYPES 是一个包含26种类型的数组
console.log(REMINDER_TYPES);
// [
//   { type_code: 'vaccine', type_name: '疫苗', icon: '📋', color: '#8b5cf6', ... },
//   ...
// ]
```

## 26种提醒类型

| 代码 | 中文名 | 图标 | 颜色 | 分类 |
|------|--------|------|------|------|
| vaccine | 疫苗 | 📋 | #8b5cf6 | 医疗 |
| checkup | 体检 | 💉 | #f97316 | 医疗 |
| deworming | 驱虫 | 🐛 | #ec4899 | 医疗 |
| bath | 洗澡 | 💧 | #6366f1 | 护理 |
| grooming | 美容 | ✂️ | #a78bfa | 护理 |
| surgery | 手术 | ✖️ | #dc2626 | 医疗 |
| nail_trim | 剪指甲 | ✂️ | #a855f7 | 护理 |
| ear_cleaning | 清洁耳朵 | 👂 | #06b6d4 | 护理 |
| teeth_cleaning | 清洁牙齿 | 🦷 | #10b981 | 护理 |
| food_change | 换粮 | 🍽️ | #f97316 | 日常 |
| breeding | 配种 | ❤️ | #ec4899 | 生育 |
| prenatal_checkup | 产检 | 🤰 | #a855f7 | 生育 |
| neutering | 绝育 | ➕ | #78716c | 生育 |
| recheck | 复查 | 📋 | #3b82f6 | 医疗 |
| injection | 打针 | 💉 | #06b6d4 | 医疗 |
| medication | 吃药 | 💊 | #10b981 | 医疗 |
| weighing | 称重 | ⚖️ | #6b7280 | 日常 |
| blood_test | 血检 | 🩸 | #dc2626 | 医疗 |
| xray | 拍片 | 📷 | #4b5563 | 医疗 |
| ultrasound | B超 | 📺 | #3b82f6 | 医疗 |
| dental_care | 洁牙 | 🦷 | #06b6d4 | 护理 |
| booster | 加强针 | 💉 | #84cc16 | 医疗 |
| allergy_test | 过敏测试 | ⚠️ | #a855f7 | 医疗 |
| grooming_appointment | 美容预约 | 📝 | #f97316 | 护理 |
| training | 训练 | 🎓 | #3b82f6 | 日常 |
| boarding | 寄养 | 🏠 | #78716c | 日常 |

## 常见SQL查询

### 获取某宠物今天的提醒

```sql
SELECT * FROM pet_reminders
WHERE pet_id = 'xxx'
AND is_completed = false
AND scheduled_date = CURRENT_DATE;
```

### 获取过期未完成的提醒

```sql
SELECT * FROM pet_reminders
WHERE pet_id = 'xxx'
AND is_completed = false
AND scheduled_date < CURRENT_DATE
ORDER BY scheduled_date ASC;
```

### 获取本月的提醒统计

```sql
SELECT 
    reminder_type,
    COUNT(*) as total,
    SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) as completed
FROM pet_reminders
WHERE pet_id = 'xxx'
AND scheduled_date >= DATE_TRUNC('month', CURRENT_DATE)
AND scheduled_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY reminder_type
ORDER BY total DESC;
```

## 安全性

- 使用 Row Level Security (RLS) 确保用户只能访问自己宠物的提醒
- 所有操作都会自动验证用户权限
- 删除宠物时会级联删除所有相关提醒

## 索引说明

数据库创建了4个索引来优化查询性能：

```sql
CREATE INDEX idx_pet_reminders_pet_id ON pet_reminders(pet_id);
-- 用途：快速查询某个宠物的所有提醒
-- 场景：SELECT * FROM pet_reminders WHERE pet_id = 'xxx'

CREATE INDEX idx_pet_reminders_date ON pet_reminders(scheduled_date DESC);
-- 用途：快速按日期排序
-- 场景：ORDER BY scheduled_date DESC

CREATE INDEX idx_pet_reminders_type ON pet_reminders(reminder_type);
-- 用途：快速筛选特定类型的提醒
-- 场景：SELECT * FROM pet_reminders WHERE reminder_type = 'vaccine'

CREATE INDEX idx_pet_reminders_completed ON pet_reminders(is_completed);
-- 用途：快速区分待办和已完成
-- 场景：SELECT * FROM pet_reminders WHERE is_completed = false
```

**性能对比**：
- 无索引：查询100万条记录可能需要1秒
- 有索引：同样查询只需0.01秒

## 注意事项

1. **日期格式**：scheduled_date 使用 DATE 类型，格式为 'YYYY-MM-DD'
2. **时区处理**：completed_at 使用 TIMESTAMP WITH TIME ZONE
3. **类型验证**：reminder_type 必须是26种预定义类型之一
4. **软删除**：建议使用 is_completed 标记而不是直接删除
5. **图标和颜色**：从 reminder_types 表JOIN获取，避免数据冗余

## 页面路由

- 提醒列表页：`/reminders`
- 功能：
  - 查看待办/历史提醒
  - 创建新提醒
  - 标记完成
  - 删除提醒

## 故障排查

### 创建提醒失败

1. 检查宠物ID是否正确
2. 验证日期格式是否为 'YYYY-MM-DD'
3. 确认类型代码是否在26种之内
4. 查看浏览器控制台错误信息

### 提醒不显示

1. 检查RLS策略是否启用
2. 确认用户已登录
3. 验证宠物归属于当前用户
4. 查看 Supabase 日志

### 数据库错误

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('pet_reminders', 'reminder_types');

-- 检查RLS是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'pet_reminders';

-- 查看策略
SELECT * FROM pg_policies WHERE tablename = 'pet_reminders';
```

## 后续扩展建议

1. 添加提醒推送通知功能
2. 实现重复提醒（每日/每周/每月）
3. 添加提醒模板快速创建
4. 导出提醒到日历
5. 提醒分享功能
