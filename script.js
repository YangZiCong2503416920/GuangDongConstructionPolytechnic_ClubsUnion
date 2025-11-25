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
            linkItem.innerHTML = `<a href="/activities.html">${activity.name}</a>`;
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
            navbar.style.backgroundColor = '#1a252f';
        } else {
            navbar.style.backgroundColor = '#2c3e50';
        }
    });

    // 社团分类过滤功能（仅在社团页面生效）
    const filterButtons = document.querySelectorAll('.filter-btn');
    // 重新获取所有社团项目，确保获取页面上所有的社团
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
            });
        });
    }

    // 搜索功能预留接口
    function searchClubs(keyword) {
        // 这里可以添加搜索逻辑
        // 例如：根据关键词过滤社团
        console.log('搜索社团:', keyword);
    }

    // 添加新社团接口预留
    function addNewClub(clubData) {
        // 预留添加新社团的接口
        // clubData: {name, category, contact}
        console.log('添加新社团:', clubData);
    }

    // 社团详情查看接口预留
    function viewClubDetails(clubId) {
        // 预留查看社团详情的接口
        console.log('查看社团详情:', clubId);
    }

    // 社团报名接口预留
    function registerClub(clubId) {
        // 预留社团报名接口
        console.log('报名社团:', clubId);
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

    // 页面加载完成后，确保所有社团都显示（在"全部"分类下）
    if (document.querySelector('.section-clubs')) {
        // 确保页面加载时显示所有社团
        const allClubs = document.querySelectorAll('.club-item');
        allClubs.forEach(club => {
            club.style.display = 'block';
        });
    }
});