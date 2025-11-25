// clubs.js - 社团列表页面逻辑
import { API } from '../core/api.js';
import { isAuthenticated, getCurrentUser } from '../core/auth.js';
import { Utils } from '../core/utils.js';

class ClubsPage {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 12;
        this.allClubs = [];
        this.filteredClubs = [];
        this.init();
    }

    async init() {
        try {
            // 从本地数据加载（v2.2.0 版本）
            this.allClubs = await this.loadClubsFromLocal();
            this.filteredClubs = [...this.allClubs];
            this.renderClubs();
            this.bindEvents();
        } catch (error) {
            console.error('加载社团数据失败:', error);
            this.showError('加载社团列表失败，请稍后重试');
        }
    }

    async loadClubsFromLocal() {
        // 模拟 API 调用，从本地 JSON 文件加载
        const response = await fetch('/data/clubs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    renderClubs() {
        const clubsList = document.getElementById('clubs-list');
        if (!clubsList) return;

        if (this.filteredClubs.length === 0) {
            clubsList.innerHTML = '<div class="no-results">没有找到符合条件的社团</div>';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const currentClubs = this.filteredClubs.slice(startIndex, endIndex);

        clubsList.innerHTML = currentClubs.map(club => this.renderClubCard(club)).join('');

        // 隐藏加载提示
        const loading = document.getElementById('clubs-loading');
        if (loading) loading.style.display = 'none';

        // 渲染分页
        this.renderPagination();
    }

    renderClubCard(club) {
        return `
      <div class="club-card" data-id="${club.id}">
        <img src="${club.logo || 'https://via.placeholder.com/100x100/cccccc/ffffff?text=社团'}" 
             alt="${club.name}" 
             class="club-logo"
             onerror="this.src='https://via.placeholder.com/100x100/cccccc/ffffff?text=社团'">
        <div class="club-info">
          <h3 class="club-name">${club.name}</h3>
          <p class="club-category">${this.getCategoryName(club.category)}</p>
          <p class="club-description">${club.description}</p>
          <div class="club-stats">
            <span class="member-count">成员: ${club.memberCount || 0}</span>
            <span class="founded-date">成立: ${club.founded || '未知'}</span>
          </div>
          <div class="club-actions">
            <button class="btn-primary" onclick="location.href='clubs/${club.id}'">查看详情</button>
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
        const totalPages = Math.ceil(this.filteredClubs.length / this.pageSize);
        const pagination = document.getElementById('clubs-pagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-controls">';

        // 上一页
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="clubsPage.goToPage(${this.currentPage - 1})">上一页</button>`;
        }

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (Math.abs(i - this.currentPage) <= 2 || i === 1 || i === totalPages) {
                const activeClass = i === this.currentPage ? 'active' : '';
                paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="clubsPage.goToPage(${i})">${i}</button>`;
            } else if (Math.abs(i - this.currentPage) === 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        // 下一页
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="clubsPage.goToPage(${this.currentPage + 1})">下一页</button>`;
        }

        paginationHTML += '</div>';
        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredClubs.length / this.pageSize);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderClubs();

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    bindEvents() {
        // 分类筛选
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterClubs();
            });
        }

        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterClubs();
            });
        }
    }

    filterClubs() {
        const category = document.getElementById('categoryFilter').value;
        const search = document.getElementById('searchInput').value.toLowerCase();

        this.filteredClubs = this.allClubs.filter(club => {
            const matchesCategory = !category || club.category === category;
            const matchesSearch = !search ||
                club.name.toLowerCase().includes(search) ||
                club.description.toLowerCase().includes(search);
            return matchesCategory && matchesSearch;
        });

        this.currentPage = 1; // 重置到第一页
        this.renderClubs();
    }

    showError(message) {
        const clubsList = document.getElementById('clubs-list');
        if (clubsList) {
            clubsList.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// 初始化页面
window.clubsPage = new ClubsPage();