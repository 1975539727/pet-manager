# 爪爪管家 - 项目结构说明

## 📁 项目文件结构

```
pet-manager/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx         # 根布局（包含导航栏）
│   │   ├── page.tsx           # 首页
│   │   ├── encyclopedia/      # 宠物百科页面
│   │   │   └── page.tsx
│   │   ├── archives/          # 宠物档案页面
│   │   │   └── page.tsx
│   │   ├── assistant/         # 智能助手页面
│   │   │   └── page.tsx
│   │   ├── login/            # 登录页面
│   │   │   └── page.tsx
│   │   └── register/         # 注册页面
│   │       └── page.tsx
│   └── components/            # 公共组件
│       └── Navbar.tsx         # 导航栏组件
├── public/                    # 静态资源
├── package.json              # 项目依赖
└── PROJECT_STRUCTURE.md      # 项目结构说明（本文件）
```

## 🎨 导航栏布局（从左到右）

1. **爪爪管家** - Logo/品牌名（链接到首页）
2. **首页** - 导航链接
3. **宠物百科** - 导航链接
4. **宠物档案** - 导航链接
5. **智能助手** - 导航链接
6. **搜索图标** - 点击展开搜索框
7. **登录 | 注册** - 用户认证入口

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Styled Components
- **图标**: Lucide React
- **UI组件**: 基于 Styled Components 的自定义组件

## 📄 已创建的页面

### 1. 首页 (`/`)
- 英雄区（Hero Section）
- 核心功能展示
- 行动号召（CTA）

### 2. 宠物百科 (`/encyclopedia`)
- 展示宠物知识和饲养指南

### 3. 宠物档案 (`/archives`)
- 宠物档案管理

### 4. 智能助手 (`/assistant`)
- AI智能助手功能

### 5. 登录页面 (`/login`)
- 用户登录表单

### 6. 注册页面 (`/register`)
- 用户注册表单

## 🎯 下一步开发建议

1. **后端集成**: 添加 API 路由和数据库连接
2. **用户认证**: 实现完整的登录/注册功能
3. **宠物档案管理**: 实现 CRUD 功能
4. **百科内容**: 添加宠物百科数据和分类
5. **智能助手**: 集成 AI 对话功能
6. **响应式优化**: 完善移动端体验

## 🚀 启动项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start
```

项目将在 http://localhost:3000 运行
