# 广东建设职业技术学院社团门户系统

> 大一 HTML/CSS/JavaScript 期末作业 · 社团联合会信息门户

一个面向广东建设职业技术学院的社团门户系统，提供**社团展示、活动发布、用户注册登录、个人中心**等完整功能模块。纯前端实现（HTML5 + CSS3 + JavaScript ES6），数据使用本地 JSON + 模拟 API 层，可平滑接入真实后端。

## ✨ 功能特性

- **社团展示**：社团列表 + 分类筛选 + 搜索
- **活动管理**：活动发布、活动详情、状态跟踪
- **用户系统**：注册、登录（设备 ID 自动登录）、忘记密码
- **个人中心**：数据概览、已加入社团、我的活动、日程安排
- **响应式设计**：完美适配桌面端与移动端
- **模块化架构**：JavaScript 模块化组织 + CSS 组件化设计

## 📁 项目结构

```
├── index.html / activities.html / clubs.html ...
├── css/            # base + layout + components + pages
├── js/             # core（api/auth/cache/utils）+ pages + main
├── data/           # activities.json / clubs.json
├── assets/images/  # 图片资源
├── prototype/      # v1.0 原型版（独立子站点）
└── docs/           # 项目文档
```

> 详细结构说明见 [docs/README.md](docs/README.md)

## 🚀 快速开始

1. 克隆仓库或下载 ZIP
2. 用现代浏览器直接打开 `index.html`
3. 使用测试账号登录体验全部功能

**测试账号**：`testuser / 123456`、`admin / admin123`、`student / student123`

## 📚 文档

| 文档 | 说明 |
| --- | --- |
| [docs/README.md](docs/README.md) | 完整项目文档（结构、功能、开发规范） |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 版本变更日志 |
| [prototype/README.md](prototype/README.md) | v1.0 原型版说明 |

## 📦 版本信息

- 当前版本：**v2.2.0**
- 历史版本：v1.0.0 → v2.2.0（见 [CHANGELOG.md](docs/CHANGELOG.md)）

## 📄 许可证

[MIT License](LICENSE)
