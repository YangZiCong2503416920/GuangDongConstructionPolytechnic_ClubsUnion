// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 示例：动态加载活动和社团数据
    const activitiesData = [
        { name: '摄影社', description: '记录美好瞬间' },
        { name: '舞蹈社', description: '舞动青春' },
        { name: '科技协会', description: '探索科技前沿' },
        { name: '文学社', description: '文字的魅力' }
    ];

    // 为首页添加动态内容
    const quickLinksContainer = document.querySelector('.quick-links ul');
    if (quickLinksContainer) {
        quickLinksContainer.innerHTML = ''; // 清空默认内容
        activitiesData.forEach(activity => {
            const linkItem = document.createElement('li');
            linkItem.innerHTML = `<a href="activities.html">${activity.name}</a>`;
            quickLinksContainer.appendChild(linkItem);
        });
    }

    // 为活动页面添加动态内容
    const activityListContainer = document.querySelector('.activity-list ul');
    if (activityListContainer) {
        activityListContainer.innerHTML = ''; // 清空默认内容
        activitiesData.forEach((activity, index) => {
            const date = new Date();
            date.setDate(date.getDate() + (index + 1) * 5); // 模拟未来日期
            const formattedDate = date.toLocaleDateString('zh-CN');
            const activityItem = document.createElement('li');
            activityItem.innerHTML = `${activity.name} - ${formattedDate}`;
            activityListContainer.appendChild(activityItem);
        });
    }

    // 导航链接激活状态管理
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 页面滚动时导航栏效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 1)';
        }
    });

    // 从JSON文件加载社团数据
    async function loadClubData() {
        try {
            const response = await fetch('clubs-data.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('加载社团数据失败:', error);
            // 如果加载失败，返回默认数据
            return {
                clubs: [],
                categories: {
                    "academic": "学术",
                    "art": "艺术",
                    "sports": "体育",
                    "public-service": "公益服务",
                    "culture": "文化",
                    "technology": "技术",
                    "other": "其他"
                }
            };
        }
    }

    // 渲染社团列表
    async function renderClubList() {
        const clubListContainer = document.getElementById('clubList');
        if (!clubListContainer) return;

        // 显示加载状态
        clubListContainer.innerHTML = '<div class="loading">正在加载社团数据...</div>';

        try {
            const data = await loadClubData();
            const clubs = data.clubs;

            if (clubs.length === 0) {
                clubListContainer.innerHTML = '<div class="no-data">暂无社团数据</div>';
                return;
            }

            // 清空加载状态
            clubListContainer.innerHTML = '';

            // 创建社团项目
            clubs.forEach(club => {
                const clubItem = document.createElement('div');
                clubItem.className = 'club-item';
                clubItem.setAttribute('data-category', club.category);
                clubItem.setAttribute('data-name', club.name.toLowerCase());
                clubItem.setAttribute('data-description', club.description.toLowerCase());

                clubItem.innerHTML = `
                    <h3>${club.name}</h3>
                    <p>类别: ${data.categories[club.category]}</p>
                    <p>联系: ${club.contact}</p>
                    <p class="club-description">${club.description}</p>
                    <div class="club-actions">
                        <button class="favorite-btn" onclick="toggleFavorite('${club.id}')">
                            <span class="heart">❤</span>
                        </button>
                        <button class="detail-btn" onclick="showClubDetails('${club.id}')">详情</button>
                        <button class="register-btn" onclick="registerClub('${club.id}')">报名</button>
                    </div>
                `;

                // 检查是否已收藏
                if (isFavorite(club.id)) {
                    const favoriteBtn = clubItem.querySelector('.favorite-btn');
                    favoriteBtn.classList.add('favorited');
                    favoriteBtn.querySelector('.heart').textContent = '❤';
                }

                clubListContainer.appendChild(clubItem);
            });

            // 初始化筛选和搜索功能
            initializeFilters();
            initializeSearch();
        } catch (error) {
            console.error('渲染社团列表失败:', error);
            clubListContainer.innerHTML = '<div class="error">加载社团数据失败，请刷新页面重试</div>';
        }
    }

    // 初始化筛选功能
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        let clubItems = document.querySelectorAll('.club-item');

        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 重新获取社团项目，以防页面动态更新
                    clubItems = document.querySelectorAll('.club-item');

                    // 移除所有按钮的active类
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // 为当前按钮添加active类
                    this.classList.add('active');

                    const category = this.getAttribute('data-category');

                    // 显示/隐藏对应类别的社团
                    clubItems.forEach(item => {
                        if (category === 'all' || item.getAttribute('data-category') === category) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // 重新应用搜索过滤
                    applySearchFilter();
                });
            });
        }
    }

    // 初始化搜索功能
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchInput) {
            // 实时搜索
            searchInput.addEventListener('input', debounce(applySearchFilter, 300));
        }

        if (searchButton) {
            searchButton.addEventListener('click', applySearchFilter);
        }
    }

    // 防抖函数 - 优化搜索性能
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 应用搜索过滤
    function applySearchFilter() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const clubItems = document.querySelectorAll('.club-item');

        clubItems.forEach(item => {
            const clubName = item.getAttribute('data-name');
            const clubDescription = item.getAttribute('data-description') || '';
            const category = item.getAttribute('data-category');

            const isActiveFilter = document.querySelector('.filter-btn.active').getAttribute('data-category');

            // 检查是否符合当前分类筛选
            const matchesCategory = isActiveFilter === 'all' || category === isActiveFilter;

            // 检查是否符合搜索条件 - 同时搜索名称和描述
            const matchesSearch = searchTerm === '' ||
                clubName.includes(searchTerm) ||
                clubDescription.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
                // 高亮搜索关键词
                highlightSearchTerms(item, searchTerm);
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 高亮搜索关键词
    function highlightSearchTerms(element, searchTerm) {
        if (!searchTerm) return;

        const clubNameElement = element.querySelector('h3');
        const clubDescriptionElement = element.querySelector('.club-description');

        // 恢复原始内容（移除之前的高亮）
        if (clubNameElement.dataset.original) {
            clubNameElement.innerHTML = clubNameElement.dataset.original;
        } else {
            clubNameElement.dataset.original = clubNameElement.innerHTML;
        }

        if (clubDescriptionElement && clubDescriptionElement.dataset.original) {
            clubDescriptionElement.innerHTML = clubDescriptionElement.dataset.original;
        } else if (clubDescriptionElement) {
            clubDescriptionElement.dataset.original = clubDescriptionElement.innerHTML;
        }

        // 高亮关键词
        if (searchTerm) {
            const nameText = clubNameElement.dataset.original;
            const descriptionText = clubDescriptionElement ? clubDescriptionElement.dataset.original : '';

            // 高亮名称中的关键词
            clubNameElement.innerHTML = nameText.replace(
                new RegExp(`(${searchTerm})`, 'gi'),
                '<mark class="highlight">$1</mark>'
            );

            // 高亮描述中的关键词
            if (clubDescriptionElement) {
                clubDescriptionElement.innerHTML = descriptionText.replace(
                    new RegExp(`(${searchTerm})`, 'gi'),
                    '<mark class="highlight">$1</mark>'
                );
            }
        }
    }

    // 收藏功能
    function toggleFavorite(clubId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(clubId);

        if (index > -1) {
            // 取消收藏
            favorites.splice(index, 1);
            showNotification('已取消收藏', 'info');
        } else {
            // 添加收藏
            favorites.push(clubId);
            showNotification('已添加收藏', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));

        // 更新按钮状态
        const favoriteBtn = document.querySelector(`[data-name="${document.querySelector(`[data-name*="${clubId}"]`).getAttribute('data-name')}"] .favorite-btn`);
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('favorited');
            const heart = favoriteBtn.querySelector('.heart');
            heart.textContent = favoriteBtn.classList.contains('favorited') ? '❤' : '♡';
        }
    }

    // 检查是否已收藏
    function isFavorite(clubId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.includes(clubId);
    }

    // 显示通知
    function showNotification(message, type) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // 设置样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            zIndex: '9999',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // 根据类型设置背景色
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                break;
            case 'info':
                notification.style.background = 'linear-gradient(135deg, #3498db 0%, #2ecc71 100%)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
        }

        document.body.appendChild(notification);

        // 3秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 社团详情查看功能
    window.showClubDetails = function(clubId) {
        // 从JSON数据中获取社团详情
        fetch('clubs-data.json')
            .then(response => response.json())
            .then(data => {
                const club = data.clubs.find(c => c.id === clubId);
                if (club) {
                    // 显示模态框
                    const modal = document.getElementById('clubModal');
                    const modalTitle = document.getElementById('modalTitle');
                    const modalDescription = document.getElementById('modalDescription');
                    const modalContact = document.getElementById('modalContact');
                    const modalRegisterBtn = document.getElementById('modalRegisterBtn');
                    const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');

                    modalTitle.textContent = club.name;
                    modalDescription.textContent = club.description;
                    modalContact.textContent = club.contact;

                    // 更新报名按钮的事件
                    modalRegisterBtn.onclick = function() {
                        registerClub(clubId);
                        modal.style.display = 'none';
                    };

                    // 更新收藏按钮的事件
                    if (modalFavoriteBtn) {
                        modalFavoriteBtn.onclick = function() {
                            toggleFavorite(clubId);
                        };

                        // 更新收藏按钮状态
                        if (isFavorite(clubId)) {
                            modalFavoriteBtn.classList.add('favorited');
                            modalFavoriteBtn.innerHTML = '❤ 已收藏';
                        } else {
                            modalFavoriteBtn.classList.remove('favorited');
                            modalFavoriteBtn.innerHTML = '♡ 收藏';
                        }
                    }

                    modal.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('获取社团详情失败:', error);
                alert('获取社团详情失败，请稍后重试');
            });
    };

    // 社团报名功能
    window.registerClub = function(clubId) {
        // 从JSON数据中获取社团详情
        fetch('clubs-data.json')
            .then(response => response.json())
            .then(data => {
                const club = data.clubs.find(c => c.id === clubId);
                if (club) {
                    // 简单的报名确认
                    if (confirm(`您确定要报名参加 "${club.name}" 吗？\n\n社团邮箱: ${club.contact}`)) {
                        alert(`报名成功！您已报名参加 "${club.name}"。请联系社团邮箱: ${club.contact} 进行后续确认。`);
                        console.log('报名社团:', clubId);
                    }
                }
            })
            .catch(error => {
                console.error('获取社团详情失败:', error);
                alert('获取社团信息失败，请稍后重试');
            });
    };

    // 模态框关闭功能
    const modal = document.getElementById('clubModal');
    const span = document.querySelector('.close');

    if (span) {
        span.onclick = function() {
            modal.style.display = 'none';
        };
    }

    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // 页面加载完成后渲染社团列表
    if (document.querySelector('.section-clubs')) {
        renderClubList();
    }

    // 预留API接口调用示例
    async function fetchClubData() {
        try {
            // 这里可以调用后端API获取社团数据
            // const response = await fetch('/api/clubs');
            // const clubs = await response.json();
            console.log('从API获取社团数据');
        } catch (error) {
            console.error('获取社团数据失败:', error);
        }
    }

    // 预留数据更新接口
    function updateClubList(clubs) {
        // 这里可以更新社团列表
        console.log('更新社团列表:', clubs);
    }

    // 初始化时获取数据
    fetchClubData();
});