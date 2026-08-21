// home.js - 首页逻辑（导航 + 数据渲染）
import { API } from '../core/api.js';

const CATEGORY_NAMES = {
    academic: '学术', art: '艺术', sports: '体育',
    'public-service': '公益服务', culture: '文化', technology: '技术', other: '其他'
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

    // 高亮当前页
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

// 最新社团（取前 6 个）
function renderLatestClubs(clubs) {
    const container = document.getElementById('latest-clubs');
    if (!container) return;

    const latest = clubs.slice(0, 6);
    container.innerHTML = latest.map(club => `
      <div class="club-card" data-id="${club.id}">
        <img src="${club.logo || ''}" alt="${club.name}" class="club-logo" onerror="this.style.display='none'">
        <div class="club-info">
          <h3 class="club-name">${club.name}</h3>
          <p class="club-category">${CATEGORY_NAMES[club.category] || club.category}</p>
          <p class="club-description">${club.description}</p>
          <div class="club-stats">
            <span class="member-count">成员: ${club.memberCount || 0}</span>
            <span class="founded-date">成立: ${club.founded || '未知'}</span>
          </div>
          <div class="club-actions">
            <button class="btn-primary" onclick="location.href='clubs.html'">了解详情</button>
          </div>
        </div>
      </div>
    `).join('');

    const loading = document.getElementById('clubs-loading');
    if (loading) loading.style.display = 'none';
}

// 热门活动（取前 6 个）
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
      <div class="activity-card" data-id="${a.id}">
        <div class="activity-image">
          <div class="activity-status status-upcoming">即将开始</div>
        </div>
        <div class="activity-info">
          <h3 class="activity-title">${a.title}</h3>
          <p class="activity-organizer">主办方: ${a.organizer}</p>
          <div class="activity-meta">
            <span class="activity-time">时间: ${a.startTime}</span>
            <span class="activity-location">地点: ${a.location}</span>
          </div>
          <div class="activity-stats">
            <span class="participants">报名: ${a.currentParticipants}/${a.maxParticipants}</span>
            <span class="category">${CATEGORY_NAMES[a.category] || a.category}</span>
          </div>
        </div>
      </div>
    `).join('');

    const loading = document.getElementById('activities-loading');
    if (loading) loading.style.display = 'none';
}
