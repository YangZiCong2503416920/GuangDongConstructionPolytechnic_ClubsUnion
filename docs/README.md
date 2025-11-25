# 广东建设职业技术学院社团门户系统

## 项目简介

这是一个专为广东建设职业技术学院开发的社团门户系统，旨在为校园社团活动提供统一的展示和管理平台。系统包含社团展示、活动发布、用户管理、个人中心等功能模块。

### 主要功能

- **社团展示**：展示所有社团信息，支持分类筛选和搜索
- **活动管理**：发布和管理校园活动，支持状态跟踪
- **用户系统**：用户注册、登录、个人信息管理
- **个人中心**：用户个人数据展示、已加入社团、参与活动等
- **响应式设计**：支持桌面端和移动端访问

### 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **架构**：模块化 JavaScript，组件化 CSS
- **兼容性**：现代浏览器 (Chrome, Firefox, Safari, Edge)

## 项目结构

```bash
project/
├── index.html                 # 首页
├── activities.html            # 活动列表页
├── activity-detail.html       # 新增：活动详情页
├── login.html                 # 新增：登录页（设备ID自动登录）
├── profile.html               # 新增：个人中心
├── about.html
│
├── css/
│   ├── base.css               # 重置 + 全局变量
│   ├── layout.css             # 响应式布局（Grid/Flex）
│   ├── components/            # 按组件拆分
│   │   ├── navbar.css
│   │   ├── banner.css
│   │   ├── activity-card.css
│   │   ├── modal.css
│   │   ├── calendar.css       # 新增
│   │   └── form.css           # 表单统一样式
│   └── pages/
│       ├── home.css
│       ├── activities.css
│       ├── activity-detail.css
│       ├── login.css
│       └── profile.css
│
├── js/
│   ├── core/
│   │   ├── api.js             # 【关键】模拟 API 层（v3.0 替换点）
│   │   ├── cache.js           # 数据缓存机制
│   │   ├── auth.js            # 用户身份管理
│   │   └── utils.js           # 工具函数（防抖、日期格式等）
│   ├── pages/
│   │   ├── home.js
│   │   ├── activities.js      # 活动列表逻辑
│   │   ├── activity-detail.js # 活动详情逻辑
│   │   ├── login.js           # 登录逻辑
│   │   └── profile.js         # 个人中心逻辑
│   └── main.js                # 全局初始化（路由感知）
│
├── data/
│   ├── activities.json        # 活动数据（含日期、描述、报名字段）
│   ├── clubs.json             # 社团数据（保持不变）
│   └── mock-responses/        # 可选：预置模拟响应
│
├── assets/
│   ├── images/
│   └── icons/
│
└── docs/
    └── api-spec-v3.md         # 【新增】v3.0 API 接口文档草案
    └──CHANGELOG.md
    └──README.md

```

## 快速开始

### 本地运行

1. 克隆或下载项目文件
2. 使用现代浏览器打开 `index.html`
3. 访问各功能页面

### 测试账号

系统预设了测试账号，可直接登录使用：

- **账号1**：`testuser` / `123456`
- **账号2**：`admin` / `admin123`
- **账号3**：`student` / `student123`

## 功能特性

### 响应式设计
- 适配各种屏幕尺寸
- 移动端友好的交互体验

### 模块化架构
- JavaScript 模块化组织
- CSS 组件化设计
- 易于维护和扩展

### 数据驱动
- 本地 JSON 数据存储
- 模拟 API 接口
- 支持后续后端集成

## 开发说明

### CSS 命名规范
- 使用 BEM 方法论
- 组件样式独立封装
- 保持样式的一致性

### JavaScript 架构
- 使用 ES6 模块系统
- 核心功能模块化
- 页面逻辑分离

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 版本信息

- **当前版本**: v2.2.0
- **更新日期**: 2025-11-25
- **主要更新**:
  - 添加了完整的个人中心功能，包括概览、已加入社团、我的活动、日程安排和设置标签页
  - 实现个人中心多标签页切换功能
  - 完善用户登录、登出、权限验证功能
  - 提供预设测试账号，方便功能测试
  - 修复了 framework.css 和 framework.js 404 错误
  - 修复了 Auth 模块导入问题
  - 修复了个人中心设置页面布局错乱问题
  - 修复了社团和活动页面加载问题
  - 优化了数据加载和渲染性能
  - 改进了所有页面的视觉效果和用户体验
  - 重构了 API 模块，支持本地数据加载

## 许可证

[MIT License](./LICENSE)

## 联系方式

如有问题或建议，请通过项目仓库提交 Issue。

## 更新日志

请查看 [CHANGELOG.md](CHANGELOG.md) 文件了解详细的版本更新记录。


