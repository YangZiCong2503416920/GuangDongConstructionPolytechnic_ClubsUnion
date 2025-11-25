// activities.js - 活动列表页面逻辑
import { API } from '../core/api.js';
import { isAuthenticated, getCurrentUser } from '../core/auth.js';
import { Utils } from '../core/utils.js';

class ActivitiesPage {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 12;
        this.allActivities = [];
        this.filteredActivities = [];
        this.init();
    }

    async init() {
        try {
            // 从本地数据加载（v2.2.0 版本）
            this.allActivities = await this.loadActivitiesFromLocal();
            this.filteredActivities = [...this.allActivities];
            this.renderActivities();
            this.bindEvents();
        } catch (error) {
            console.error('加载活动数据失败:', error);
            this.showError('加载活动列表失败，请稍后重试');
        }
    }

    async loadActivitiesFromLocal() {
        // 模拟 API 调用，从本地 JSON 文件加载
        // 这里我们生成一些模拟活动数据，因为原数据中没有活动信息
        const clubs = await fetch('/data/clubs.json').then(r => r.json());

        // 为每个社团生成一些模拟活动
        const activities = [];
        clubs.forEach(club => {
            for (let i = 0; i < 3; i++) {
                const activity = {
                    id: `act_${club.id}_${i}`,
                    title: `${club.name} - 模拟活动${i + 1}`,
                    description: `这是${club.name}社团组织的第${i + 1}个模拟活动，欢迎参与！`,
                    category: club.category,
                    organizer: club.name,
                    startTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    endTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 + 3600000).toISOString().split('T')[0],
                    location: '模拟地点',
                    maxParticipants: 50,
                    currentParticipants: Math.floor(Math.random() * 50),
                    status: Math.random() > 0.3 ? 'upcoming' : 'ongoing',
                    image: club.logo || 'https://via.placeholder.com/300x200/cccccc/ffffff?text=活动',
                    createdAt: new Date().toISOString().split('T')[0]
                };
                activities.push(activity);
            }
        });

        return activities;
    }

    renderActivities() {
        const activitiesList = document.getElementById('activities-list');
        if (!activitiesList) return;

        if (this.filteredActivities.length === 0) {
            activitiesList.innerHTML = '<div class="no-results">没有找到符合条件的活动</div>';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const currentActivities = this.filteredActivities.slice(startIndex, endIndex);

        activitiesList.innerHTML = currentActivities.map(activity => this.renderActivityCard(activity)).join('');

        // 隐藏加载提示
        const loading = document.getElementById('activities-loading');
        if (loading) loading.style.display = 'none';

        // 渲染分页
        this.renderPagination();
    }

    renderActivityCard(activity) {
        const statusClass = `status-${activity.status}`;
        const statusText = {
            'upcoming': '即将开始',
            'ongoing': '进行中',
            'completed': '已结束'
        }[activity.status] || activity.status;

        return `
      <div class="activity-card" data-id="${activity.id}">
        <div class="activity-image">
          <img src="${activity.image}" 
               alt="${activity.title}" 
               onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=活动'">
          <div class="activity-status ${statusClass}">${statusText}</div>
        </div>
        <div class="activity-info">
          <h3 class="activity-title">${activity.title}</h3>
          <p class="activity-organizer">主办方: ${activity.organizer}</p>
          <div class="activity-meta">
            <span class="activity-time">时间: ${activity.startTime} 至 ${activity.endTime}</span>
            <span class="activity-location">地点: ${activity.location}</span>
          </div>
          <p class="activity-description">${activity.description}</p>
          <div class="activity-stats">
            <span class="participants">参与: ${activity.currentParticipants}/${activity.maxParticipants}</span>
            <span class="category">${this.getCategoryName(activity.category)}</span>
          </div>
          <div class="activity-actions">
            <button class="btn-primary" onclick="location.href='activity-detail.html?id=${activity.id}'">查看详情</button>
          </div>
        </div>
      </div>
    `;
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

    renderPagination() {
        const totalPages = Math.ceil(this.filteredActivities.length / this.pageSize);
        const pagination = document.getElementById('activities-pagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-controls">';

        // 上一页
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="activitiesPage.goToPage(${this.currentPage - 1})">上一页</button>`;
        }

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (Math.abs(i - this.currentPage) <= 2 || i === 1 || i === totalPages) {
                const activeClass = i === this.currentPage ? 'active' : '';
                paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="activitiesPage.goToPage(${i})">${i}</button>`;
            } else if (Math.abs(i - this.currentPage) === 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        // 下一页
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="activitiesPage.goToPage(${this.currentPage + 1})">下一页</button>`;
        }

        paginationHTML += '</div>';
        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredActivities.length / this.pageSize);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderActivities();

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    bindEvents() {
        // 状态筛选
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterActivities();
            });
        }

        // 分类筛选
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterActivities();
            });
        }

        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterActivities();
            });
        }
    }

    filterActivities() {
        const status = document.getElementById('statusFilter').value;
        const category = document.getElementById('categoryFilter').value;
        const search = document.getElementById('searchInput').value.toLowerCase();

        this.filteredActivities = this.allActivities.filter(activity => {
            const matchesStatus = !status || activity.status === status;
            const matchesCategory = !category || activity.category === category;
            const matchesSearch = !search ||
                activity.title.toLowerCase().includes(search) ||
                activity.description.toLowerCase().includes(search) ||
                activity.organizer.toLowerCase().includes(search);
            return matchesStatus && matchesCategory && matchesSearch;
        });

        this.currentPage = 1; // 重置到第一页
        this.renderActivities();
    }

    showError(message) {
        const activitiesList = document.getElementById('activities-list');
        if (activitiesList) {
            activitiesList.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// 初始化页面
window.activitiesPage = new ActivitiesPage();



