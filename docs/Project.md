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
