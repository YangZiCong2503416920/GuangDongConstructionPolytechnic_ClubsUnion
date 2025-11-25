import { fetchActivities } from '../core/api.js';
import { showNotification } from '../core/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 初始化导航栏
    initializeNavigation();

    // 初始化首页内容
    initializeHomePage();

    // 添加动画样式
    addAnimationStyles();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有链接的active类
            navLinks.forEach(l => l.classList.remove('active'));

            // 为当前链接添加active类
            this.classList.add('active');

            // 获取目标页面
            const targetPage = this.getAttribute('href');
            if (targetPage) {
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 150);
            }
        });
    });

    // 设置当前页面的导航链接为激活状态
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '' || currentPage === 'index.html') {
        document.querySelector('.nav-link[href="index.html"]').classList.add('active');
    } else {
        const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function initializeHomePage() {
    // 动态加载快速链接
    loadQuickLinks();

    // 添加滚动效果
    addScrollEffect();
}

function loadQuickLinks() {
    const quickLinksContainer = document.querySelector('.quick-links ul');
    if (!quickLinksContainer) return;

    const activitiesData = [
        { name: '摄影社', description: '记录美好瞬间' },
        { name: '舞蹈社', description: '舞动青春' },
        { name: '科技协会', description: '探索科技前沿' },
        { name: '文学社', description: '文字的魅力' }
    ];

    quickLinksContainer.innerHTML = activitiesData.map(activity => `
        <li>
            <a href="activities.html">${activity.name}</a>
        </li>
    `).join('');
}

function addScrollEffect() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'linear-gradient(135deg, rgba(26, 37, 47, 0.95) 0%, rgba(52, 73, 94, 0.95) 100%)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, rgba(26, 37, 47, 0.85) 0%, rgba(52, 73, 94, 0.85) 100%)';
        }
    });
}

function addAnimationStyles() {
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
}



