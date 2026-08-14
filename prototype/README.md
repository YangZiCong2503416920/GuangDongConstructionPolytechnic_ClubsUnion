# 广建社联 - 原型版（v1.0）

> 广东建设职业技术学院（清远校区）社团联合会信息门户 · **v1.0 原型演示版**

本目录是主项目（社团门户系统）的早期原型版本，现已作为子站点并入主仓库，保留完整的独立运行能力。

## 📱 在线演示

启用 GitHub Pages 后可直接访问：

- 原型站：`https://yangzicong2503416920.github.io/GuangDongConstructionPolytechnic_ClubsUnion/prototype/`
- 主站：`https://yangzicong2503416920.github.io/GuangDongConstructionPolytechnic_ClubsUnion/`

## ✨ 功能特性

- **社团概览**：首页展示精选社团信息
- **社团列表**：全部 58 个社团，支持 **4 大分类筛选** 与 **名称实时搜索**
- **社团详情**：点击"了解详情"弹出**详情模态框**（含社团图片、分类、简介）
- **精选轮播**：轮播图支持 **暂停/播放控制**，鼠标悬停自动暂停
- **社团专题页**：华襟汉服社、摄影协会、音乐/文学/环保类等独立专题页
- **媒体中心**：社团图片与音频素材（yinyue.html 内嵌试听）
- **响应式设计**：适配桌面端和移动端浏览

## 🛠️ 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6)
- **部署**：GitHub Pages / Nginx / 任意静态托管

## 📁 项目结构

```
prototype/
├── index.html              # 首页
├── list.html               # 所有社团列表页（分类筛选 + 搜索 + 详情模态框）
├── featured-carousel.html  # 精选社团轮播页（暂停/播放控制）
├── about.html              # 关于我们
├── featured/               # 社团专题页
│   ├── huafu.html          # 华襟汉服社
│   ├── sheying.html        # 摄影协会
│   ├── yinyue.html         # 炫乐协会 & 吉他协会（含音频试听）
│   ├── huanbao.html        # 绿科环保协会
│   └── renwen.html         # 叮咚文学社 & 呦呦读书会
├── css/
│   └── style.css           # 全局样式
├── images/                 # 社团图片资源
├── media/
│   └── demo_music.mp3      # 音频素材
└── README.md               # 本文档
```

## 🚀 快速开始

1. 克隆主仓库：

```bash
git clone https://github.com/YangZiCong2503416920/GuangDongConstructionPolytechnic_ClubsUnion.git
cd GuangDongConstructionPolytechnic_ClubsUnion/prototype
```

2. 本地预览（建议用 HTTP 服务器，避免浏览器跨域限制）：

```bash
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/
```

3. 或部署到 GitHub Pages：仓库 Settings → Pages → 选择 `master` 分支，站点即位于 `/prototype/` 路径下。

## 📝 历史说明

本目录源自独立的 `HTML_FinalAssignment` 仓库（v1.0 原型），整理时已并入主项目仓库统一管理。原仓库中的"待完善"项（社团详情、轮播暂停控制、筛选功能）均已在本次整理中完成。

## 👤 贡献者

- 杨子聪 - 初始开发与设计 - YangZC2503416920@163.com

## 📄 许可证

MIT License（详见主仓库 LICENSE）
