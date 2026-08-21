// home.js - 首页逻辑（导航 + 数据渲染）
import { API } from '../core/api.js';

const CATEGORY_NAMES = {
    academic: '学术', art: '艺术', sports: '体育',
    'public-service': '公益服务', culture: '文化', technology: '技术', other: '其他'
};
const CATEGORY_ICONS = {
    academic: '🎓', art: '🎨', sports: '⚽',
    'public-service': '🤝', culture: '📚', technology: '💻', other: '✨'
};

document.addEventListener('DOMContentLoaded', async () => {
    initializeNavigation();
    await loadHomeData();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetPage = this.getAttribute('href');
            if (targetPage) {
                setTimeout(() => { window.location.href = targetPage; }, 150);
            }
        });
    });

    const currentPage = window.location.pathname.split('/').pop();
    const homeLink = document.querySelector('.nav-link[href="index.html"]');
    if (currentPage === '' || currentPage === 'index.html') {
        if (homeLink) homeLink.classList.add('active');
    } else {
        const activeLink = document.querySelector('.nav-link[href="' + currentPage + '"]');
        if (activeLink) activeLink.classList.add('active');
    }
}

async function loadHomeData() {
    try {
        const clubs = await fetch('./data/clubs.json').then(r => r.json());
        renderStats(clubs);
        renderLatestClubs(clubs);
        renderPopularActivities(clubs);
    } catch (error) {
        console.error('加载首页数据失败:', error);
        const el = document.getElementById('activities-loading');
        if (el) el.textContent = '数据加载失败，请刷新重试';
    }
}

// 统计数据
function renderStats(clubs) {
    const totalMembers = clubs.reduce((sum, c) => sum + (c.memberCount || 0), 0);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('total-clubs', clubs.length);
    set('total-members', totalMembers.toLocaleString());
    set('total-activities', clubs.length * 3);
    set('total-events', Math.min(clubs.length * 3, 80));
}

// 最新社团（深色卡片）
function renderLatestClubs(clubs) {
    const container = document.getElementById('latest-clubs');
    if (!container) return;

    const latest = clubs.slice(0, 6);
    container.innerHTML = latest.map(club => `
      <div class="h-club-card">
        <div class="h-club-top">
          <div class="h-club-logo">${CATEGORY_ICONS[club.category] || '✨'}</div>
          <div class="h-club-head">
            <h3 class="h-club-name">${club.name}</h3>
            <span class="h-club-cat">${CATEGORY_NAMES[club.category] || club.category}</span>
          </div>
        </div>
        <p class="h-club-desc">${club.description}</p>
        <div class="h-club-meta">
          <span>👥 成员 ${club.memberCount || 0}</span>
          <span>🗓 ${club.founded || '未知'}</span>
        </div>
        <a class="h-club-link" href="clubs.html">了解社团 →</a>
      </div>
    `).join('');

    const loading = document.getElementById('clubs-loading');
    if (loading) loading.style.display = 'none';
}

// 热门活动（深色卡片）
function renderPopularActivities(clubs) {
    const container = document.getElementById('popular-activities');
    if (!container) return;

    const activities = [];
    clubs.slice(0, 3).forEach(club => {
        for (let i = 0; i < 2; i++) {
            activities.push({
                id: 'act_' + club.id + '_' + i,
                title: club.name + ' · 主题活动' + (i + 1),
                organizer: club.name,
                startTime: '本周六 14:00',
                location: '校园活动中心',
                currentParticipants: 12 + i * 5,
                maxParticipants: 40,
                category: club.category,
                status: 'upcoming'
            });
        }
    });

    container.innerHTML = activities.map(a => `
      <div class="h-act-card">
        <div class="h-act-top">
          <span class="h-act-tag">${CATEGORY_NAMES[a.category] || a.category}</span>
          <span class="h-act-status">即将开始</span>
        </div>
        <h3 class="h-act-title">${a.title}</h3>
        <p class="h-act-organizer">主办方 · ${a.organizer}</p>
        <div class="h-act-meta">
          <span>🕐 ${a.startTime}</span>
          <span>📍 ${a.location}</span>
        </div>
        <div class="h-act-footer">
          <span class="h-act-count">${a.currentParticipants}/${a.maxParticipants} 已报名</span>
          <a class="h-act-link" href="activity-detail.html?id=${a.id}">了解详情 →</a>
        </div>
      </div>
    `).join('');

    const loading = document.getElementById('activities-loading');
    if (loading) loading.style.display = 'none';
}
