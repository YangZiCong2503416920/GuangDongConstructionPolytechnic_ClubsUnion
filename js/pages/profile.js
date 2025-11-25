// profile.js - 个人中心页面逻辑
import { API } from '../core/api.js';
import { Auth } from '../core/auth.js';
import { Utils } from '../core/utils.js';

class ProfilePage {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            // 检查登录状态
            if (!Auth.isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }

            this.currentUser = Auth.getCurrentUser();
            this.renderUserInfo();
            this.bindEvents();
            this.initTabs();
            this.loadUserData();
        } catch (error) {
            console.error('初始化个人中心失败:', error);
            Utils.showMessage('加载个人中心失败', 'error');
        }
    }

    renderUserInfo() {
        const { name, username, email, id } = this.currentUser;

        document.getElementById('userName').textContent = name || username || '未设置';
        document.getElementById('userId').textContent = `ID: ${id || '未知'}`;
        document.getElementById('userEmail').textContent = email || '未设置';

        // 设置头像
        const firstChar = (name || username || 'U').charAt(0).toUpperCase();
        document.getElementById('userAvatar').textContent = firstChar;
        document.getElementById('profileAvatar').textContent = firstChar;
    }

    bindEvents() {
        // 退出登录
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
            window.location.href = 'index.html';
        });

        // 更换头像
        document.getElementById('changeAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });

        // 头像上传
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('currentAvatar').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // 保存设置
        document.getElementById('profileSettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // 取消设置
        document.getElementById('cancelSettings').addEventListener('click', () => {
            this.loadSettingsData();
        });
    }

    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // 移除所有激活状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // 激活当前标签
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');

        // 根据标签加载数据
        switch (tabId) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'joined':
                this.loadJoinedClubs();
                break;
            case 'activities':
                this.loadMyActivities();
                break;
            case 'calendar':
                this.initCalendar();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    async loadUserData() {
        try {
            // 加载概览数据
            await this.loadOverviewData();

            // 加载已加入社团
            await this.loadJoinedClubs();

            // 加载我的活动
            await this.loadMyActivities();

            // 初始化日历
            this.initCalendar();

            // 加载设置数据
            this.loadSettingsData();
        } catch (error) {
            console.error('加载用户数据失败:', error);
        }
    }

    async loadOverviewData() {
        try {
            // 模拟统计数据
            document.getElementById('joinedClubsCount').textContent = '3';
            document.getElementById('participatedActivities').textContent = '5';
            document.getElementById('earnedPoints').textContent = '120';
            document.getElementById('badgesCount').textContent = '2';

            // 加载最近活动
            const recentActivities = [
                { title: '编程社团技术分享会', date: '2024-01-15', status: 'completed' },
                { title: '摄影社户外拍摄活动', date: '2024-01-12', status: 'completed' },
                { title: '辩论社内部训练', date: '2024-01-10', status: 'upcoming' }
            ];

            const activitiesList = document.getElementById('recentActivitiesList');
            activitiesList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-meta">
            <span class="activity-date">${activity.date}</span>
            <span class="activity-status status-${activity.status}">
              ${activity.status === 'completed' ? '已完成' : '待参加'}
            </span>
          </div>
        </div>
      `).join('');
        } catch (error) {
            console.error('加载概览数据失败:', error);
        }
    }

    async loadJoinedClubs() {
        try {
            // 模拟已加入社团数据
            const joinedClubs = [
                {
                    id: 'club_1',
                    name: '编程爱好者协会',
                    logo: 'https://via.placeholder.com/100x100/667eea/ffffff?text=编程',
                    category: 'technology',
                    description: '热爱编程，共同学习技术',
                    memberCount: 45,
                    joinedDate: '2024-01-01'
                },
                {
                    id: 'club_2',
                    name: '摄影社',
                    logo: 'https://via.placeholder.com/100x100/f093fb/ffffff?text=摄影',
                    category: 'art',
                    description: '用镜头记录美好瞬间',
                    memberCount: 28,
                    joinedDate: '2024-01-05'
                },
                {
                    id: 'club_3',
                    name: '辩论社',
                    logo: 'https://via.placeholder.com/100x100/4facfe/ffffff?text=辩论',
                    category: 'academic',
                    description: '思辨明理，口才训练',
                    memberCount: 32,
                    joinedDate: '2024-01-10'
                }
            ];

            const clubsList = document.getElementById('joinedClubsList');
            clubsList.innerHTML = joinedClubs.map(club => `
        <div class="club-card">
          <img src="${club.logo}" alt="${club.name}" class="club-logo" 
               onerror="this.src='https://via.placeholder.com/100x100/cccccc/ffffff?text=社团'">
          <div class="club-info">
            <h3 class="club-name">${club.name}</h3>
            <p class="club-category">${this.getCategoryName(club.category)}</p>
            <p class="club-description">${club.description}</p>
            <div class="club-stats">
              <span class="member-count">成员: ${club.memberCount}</span>
              <span class="joined-date">加入: ${club.joinedDate}</span>
            </div>
            <div class="club-actions">
              <button class="btn-primary" onclick="location.href='clubs/${club.id}'">查看详情</button>
            </div>
          </div>
        </div>
      `).join('');
        } catch (error) {
            console.error('加载已加入社团失败:', error);
        }
    }

    async loadMyActivities() {
        try {
            // 模拟我的活动数据
            const myActivities = [
                {
                    id: 'act_1',
                    title: '编程社团技术分享会',
                    image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=活动',
                    organizer: '编程爱好者协会',
                    startTime: '2024-01-15',
                    endTime: '2024-01-15',
                    status: 'completed',
                    location: '教学楼A101'
                },
                {
                    id: 'act_2',
                    title: '摄影社户外拍摄活动',
                    image: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=活动',
                    organizer: '摄影社',
                    startTime: '2024-01-12',
                    endTime: '2024-01-12',
                    status: 'completed',
                    location: '校园内'
                },
                {
                    id: 'act_3',
                    title: '辩论社内部训练',
                    image: 'https://via.placeholder.com/300x200/4facfe/ffffff?text=活动',
                    organizer: '辩论社',
                    startTime: '2024-01-20',
                    endTime: '2024-01-20',
                    status: 'upcoming',
                    location: '图书馆会议室'
                }
            ];

            const activitiesList = document.getElementById('myActivitiesList');
            activitiesList.innerHTML = myActivities.map(activity => `
        <div class="activity-card">
          <div class="activity-image">
            <img src="${activity.image}" alt="${activity.title}" 
                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=活动'">
            <div class="activity-status status-${activity.status}">
              ${activity.status === 'completed' ? '已完成' : activity.status === 'upcoming' ? '待参加' : '进行中'}
            </div>
          </div>
          <div class="activity-info">
            <h3 class="activity-title">${activity.title}</h3>
            <p class="activity-organizer">主办方: ${activity.organizer}</p>
            <div class="activity-meta">
              <span class="activity-time">时间: ${activity.startTime} 至 ${activity.endTime}</span>
              <span class="activity-location">地点: ${activity.location}</span>
            </div>
            <div class="activity-actions">
              <button class="btn-primary" onclick="location.href='activities/${activity.id}'">查看详情</button>
            </div>
          </div>
        </div>
      `).join('');
        } catch (error) {
            console.error('加载我的活动失败:', error);
        }
    }

    initCalendar() {
        // 简单的日历实现
        const calendarEl = document.getElementById('userCalendar');
        if (!calendarEl) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        let calendarHTML = `
      <div class="calendar-header">
        <h3>${year}年${month + 1}月</h3>
      </div>
      <div class="calendar-weekdays">
        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
      </div>
      <div class="calendar-grid">
    `;

        // 添加空白天
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // 添加日期
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === now.getDate();
            const hasEvent = [10, 15, 20, 25].includes(day); // 模拟有活动的日期
            calendarHTML += `
        <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
          ${day}
          ${hasEvent ? '<div class="event-indicator"></div>' : ''}
        </div>
      `;
        }

        calendarHTML += '</div>';
        calendarEl.innerHTML = calendarHTML;
    }

    loadSettingsData() {
        // 模拟加载设置数据
        document.getElementById('settingName').value = this.currentUser.name || this.currentUser.username || '';
        document.getElementById('settingEmail').value = this.currentUser.email || '';
        document.getElementById('settingPhone').value = this.currentUser.phone || '';
        document.getElementById('settingStudentId').value = this.currentUser.studentId || '';
        document.getElementById('settingBio').value = this.currentUser.bio || '';

        // 设置头像
        const firstChar = (this.currentUser.name || this.currentUser.username || 'U').charAt(0).toUpperCase();
        document.getElementById('currentAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstChar)}&background=667eea&color=fff`;
    }

    async saveSettings() {
        try {
            const formData = {
                name: document.getElementById('settingName').value,
                email: document.getElementById('settingEmail').value,
                phone: document.getElementById('settingPhone').value,
                studentId: document.getElementById('settingStudentId').value,
                bio: document.getElementById('settingBio').value
            };

            // 模拟保存设置
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 更新用户信息
            this.currentUser = { ...this.currentUser, ...formData };
            localStorage.setItem('user_info', JSON.stringify(this.currentUser));

            Utils.showMessage('设置保存成功', 'success');
        } catch (error) {
            console.error('保存设置失败:', error);
            Utils.showMessage('保存设置失败', 'error');
        }
    }

    getCategoryName(category) {
        const categories = {
            'academic': '学术',
            'art': '艺术',
            'sports': '体育',
            'public-service': '公益服务',
            'culture': '文化',
            'technology': '技术',
            'other': '其他'
        };
        return categories[category] || category;
    }
}

// 初始化页面
window.profilePage = new ProfilePage();