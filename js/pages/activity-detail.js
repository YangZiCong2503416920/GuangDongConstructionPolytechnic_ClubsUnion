import { fetchActivityById, registerForActivity } from '../core/api.js';
import { showNotification, formatDate } from '../core/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 初始化导航栏
    initializeNavigation();

    // 加载活动详情
    await loadActivityDetail();

    // 初始化报名和评论功能
    initializeRegistration();
    initializeComments();
});

async function loadActivityDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');

    if (!activityId) {
        showNotification('活动ID不能为空', 'error');
        return;
    }

    try {
        const activity = await fetchActivityById(activityId);

        if (!activity) {
            showNotification('活动不存在', 'error');
            return;
        }

        // 填充活动详情
        document.getElementById('activityImage').src = activity.poster || './assets/images/default-activity.jpg';
        document.getElementById('activityTitle').textContent = activity.title;
        document.getElementById('activityDate').textContent = formatDate(activity.date);
        document.getElementById('activityLocation').textContent = activity.location;
        document.getElementById('activityOrganizer').textContent = activity.organizer;
        document.getElementById('activityDescription').textContent = activity.description;

        // 更新报名进度
        const progress = Math.min(100, (activity.currentParticipants / activity.maxParticipants) * 100);
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${Math.round(progress)}% 已满 (${activity.currentParticipants}/${activity.maxParticipants})`;
        document.getElementById('activityParticipants').textContent = `${activity.currentParticipants}/${activity.maxParticipants}`;

        // 检查是否已报名
        checkRegistrationStatus(activityId);

    } catch (error) {
        console.error('加载活动详情失败:', error);
        showNotification('活动详情加载失败', 'error');
    }
}

function initializeRegistration() {
    const registerBtn = document.getElementById('registerBtn');
    const registrationModal = document.getElementById('registrationModal');
    const closeBtn = registrationModal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelRegBtn');
    const submitBtn = document.getElementById('submitRegBtn');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            registrationModal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            registrationModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            registrationModal.style.display = 'none';
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', submitRegistration);
    }

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === registrationModal) {
            registrationModal.style.display = 'none';
        }
    });
}

function initializeComments() {
    const submitCommentBtn = document.getElementById('submitCommentBtn');

    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', submitComment);
    }

    // 加载已有评论
    loadComments();
}

function checkRegistrationStatus(activityId) {
    const userId = localStorage.getItem('user_id') || 'temp_user';
    const key = `registrations_${userId}`;
    const registrations = JSON.parse(localStorage.getItem(key) || '[]');

    const isRegistered = registrations.some(r => r.activityId === activityId);

    if (isRegistered) {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.textContent = '已报名';
            registerBtn.disabled = true;
            registerBtn.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
        }
    }
}

async function submitRegistration() {
    const form = document.getElementById('registrationForm');
    const formData = {
        name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value,
        email: document.getElementById('regEmail').value,
        note: document.getElementById('regNote').value,
        agree: document.getElementById('regAgree').checked
    };

    // 验证表单
    if (!formData.name || !formData.phone || !formData.email || !formData.agree) {
        showNotification('请填写完整信息并同意条款', 'error');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');

    try {
        await registerForActivity(activityId, formData);

        // 关闭模态框
        document.getElementById('registrationModal').style.display = 'none';

        // 显示成功通知
        showNotification('报名成功！', 'success');

        // 更新报名状态
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.textContent = '已报名';
            registerBtn.disabled = true;
            registerBtn.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
        }

        // 重新加载活动详情（更新人数）
        setTimeout(() => {
            location.reload();
        }, 1000);

    } catch (error) {
        console.error('报名失败:', error);
        showNotification('报名失败，请稍后重试', 'error');
    }
}

function submitComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        showNotification('请输入评论内容', 'error');
        return;
    }

    const comment = {
        id: Date.now().toString(),
        text: commentText,
        author: localStorage.getItem('user_id') || '匿名用户',
        time: new Date().toISOString()
    };

    // 保存评论到localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');
    const key = `comments_${activityId}`;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments.unshift(comment);
    localStorage.setItem(key, JSON.stringify(comments));

    // 清空输入框
    commentInput.value = '';

    // 显示成功通知
    showNotification('评论发表成功', 'success');

    // 重新加载评论
    loadComments();
}

function loadComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');
    const key = `comments_${activityId}`;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');

    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">暂无评论</p>';
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-time">${formatDate(comment.time)}</span>
            </div>
            <div class="comment-content">${comment.text}</div>
        </div>
    `).join('');
}

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
    if (currentPage === 'activity-detail.html') {
        document.querySelector('.nav-link[href="activity-detail.html"]').classList.add('active');
    } else {
        const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// 分享活动功能
document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.getElementById('activityTitle').textContent,
                    text: document.getElementById('activityDescription').textContent,
                    url: window.location.href
                }).catch(console.error);
            } else {
                // 复制链接到剪贴板
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('链接已复制到剪贴板', 'success');
                });
            }
        });
    }
});