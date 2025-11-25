/**
 * 应用主入口文件
 * 负责初始化、路由分发、全局事件监听、数据加载等
 */

import * as Auth from './core/auth.js';
import * as Cache from './core/cache.js';

// 全局配置
window.APP_CONFIG = {
    apiBase: '/api',
    defaultPageSize: 10,
    version: '1.0.0',
    dataPath: './data/clubs.json' // 数据文件路径（开发阶段）
};

// 全局状态
window.APP_STATE = {
    clubs: [],
    currentView: 'home',
    currentUser: null
};

/**
 * 初始化应用
 */
async function initApp() {
    console.log('社团管理系统 v' + window.APP_CONFIG.version + ' 启动中...');

    // 检查登录状态
    if (Auth.isAuthenticated()) {
        window.APP_STATE.currentUser = Auth.getCurrentUser();
    }

    // 加载社团数据
    try {
        await loadClubsData();
        console.log(`已加载 ${window.APP_STATE.clubs.length} 个社团`);
    } catch (error) {
        console.error('加载社团数据失败:', error);
    }

    // 初始化路由
    initRouting();

    // 渲染当前视图
    renderCurrentView();
}

/**
 * 加载社团数据（预留 API 接口）
 */
async function loadClubsData() {
    // 尝试从缓存获取
    const cachedData = Cache.get('clubs');
    if (cachedData) {
        window.APP_STATE.clubs = cachedData;
        return;
    }

    // 从本地文件加载（开发阶段）
    const response = await fetch(window.APP_CONFIG.dataPath);
    if (!response.ok) throw new Error(`加载数据失败: ${response.status}`);
    const data = await response.json();

    // TODO: 替换为 API 调用
    // const response = await fetch(`${window.APP_CONFIG.apiBase}/clubs`);
    // const data = await response.json();

    window.APP_STATE.clubs = data;
    // 缓存 5 分钟
    Cache.set('clubs', data, 300);
}

/**
 * 初始化路由（预留）
 */
function initRouting() {
    // 监听浏览器前进后退
    window.addEventListener('popstate', (event) => {
        renderCurrentView();
    });

    // TODO: 更复杂的前端路由逻辑
}

/**
 * 渲染当前视图
 */
function renderCurrentView() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    switch (window.APP_STATE.currentView) {
        case 'clubs':
            mainContent.innerHTML = renderClubsPage();
            break;
        case 'profile':
            mainContent.innerHTML = renderProfilePage();
            break;
        default:
            mainContent.innerHTML = renderHomePage();
    }

    // 为新渲染的元素绑定事件
    bindEvents();
}

/**
 * 渲染首页
 */
function renderHomePage() {
    const featuredClubs = window.APP_STATE.clubs.slice(0, 6);
    return `
    <section class="home-section">
      <div class="banner">
        <h1>欢迎来到广东建设职业技术学院社团门户</h1>
        <p>发现兴趣，拓展社交，提升自我</p>
      </div>
      
      <div class="featured-clubs">
        <h2>热门社团</h2>
        <div class="clubs-grid">
          ${featuredClubs.map(club => renderClubCard(club)).join('')}
        </div>
      </div>
    </section>
  `;
}

/**
 * 渲染社团列表页
 */
function renderClubsPage() {
    return `
    <section class="clubs-section">
      <h1>所有社团</h1>
      <div class="clubs-grid">
        ${window.APP_STATE.clubs.map(club => renderClubCard(club)).join('')}
      </div>
    </section>
  `;
}

/**
 * 渲染个人中心页（预留）
 */
function renderProfilePage() {
    const user = window.APP_STATE.currentUser;
    return `
    <section class="profile-section">
      <h1>个人中心</h1>
      <div class="user-info">
        <p>欢迎, ${user ? user.name : '游客'}!</p>
        <!-- TODO: 用户详细信息、已加入社团等 -->
      </div>
    </section>
  `;
}

/**
 * 渲染社团卡片
 */
function renderClubCard(club) {
    return `
    <div class="club-card" data-id="${club.id}">
      <img src="${club.logo}" alt="${club.name}" class="club-logo">
      <div class="club-info">
        <h3>${club.name}</h3>
        <p class="club-category">${club.category}</p>
        <p class="club-description">${club.description}</p>
        <div class="club-stats">
          <span>成员: ${club.memberCount}</span>
          <span>成立: ${club.founded}</span>
        </div>
        <button class="view-details-btn" data-id="${club.id}">查看详情</button>
      </div>
    </div>
  `;
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 详情按钮点击事件
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const clubId = e.target.getAttribute('data-id');
            // TODO: 跳转到详情页
            console.log('查看社团详情:', clubId);
        });
    });

    // TODO: 其他交互事件绑定
}

/**
 * 全局错误处理
 */
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    // TODO: 上报错误日志
});

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出供其他模块使用（预留）
export { initApp, renderCurrentView, loadClubsData };