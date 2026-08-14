// activity-detail.js - 活动详情页面逻辑
import { fetchActivityById, registerForActivity } from '../core/api.js';
import { showNotification, formatDate, formatDateTime } from '../core/utils.js';

// 分类与状态的中文映射
const CATEGORY_NAMES = {
    culture: '文化艺术类',
    sports: '体育健身类',
    academic: '学术科技类',
    service: '服务实践类'
};

const STATUS_NAMES = {
    upcoming: '即将开始',
    ongoing: '进行中',
    finished: '已结束'
};

document.addEventListener('DOMContentLoaded', async () => {
    initializeNavigation();
    await loadActivityDetail();
    initializeRegistration();
    initializeShare();
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

    // 高亮当前页（详情页没有自己的导航项，无需特殊处理）
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector('.nav-link[href="' + currentPage + '"]');
    if (activeLink) activeLink.classList.add('active');
}

async function loadActivityDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');

    if (!activityId) {
        showNotification('活动ID不能为空', 'error');
        hideLoading();
        return;
    }

    try {
        const activity = await fetchActivityById(activityId);
        if (!activity) {
            showNotification('活动不存在', 'error');
            hideLoading();
            return;
        }

        // 填充活动信息
        document.getElementById('activity-title').textContent = activity.title;
        document.getElementById('activity-category').textContent = CATEGORY_NAMES[activity.category] || activity.category || '未分类';
        document.getElementById('activity-status').textContent = STATUS_NAMES[activity.status] || activity.status || '未知';
        document.getElementById('activity-organizer').textContent = activity.organizer || '待定';
        document.getElementById('activity-time').textContent = activity.date ? formatDateTime(activity.date) : '待定';
        document.getElementById('activity-deadline').textContent = activity.endTime ? formatDateTime(activity.endTime) : '待定';
        document.getElementById('activity-location').textContent = activity.location || '待定';
        document.getElementById('activity-participants').textContent = activity.currentParticipants || 0;
        document.getElementById('activity-limit').textContent = activity.maxParticipants || '不限';
        document.getElementById('activity-description').textContent = activity.description || '暂无活动介绍。';

        // 活动图片
        const imageBox = document.getElementById('activity-image');
        if (imageBox) {
            if (activity.poster) {
                imageBox.innerHTML = '<img src="' + activity.poster + '" alt="' + activity.title + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
            } else {
                imageBox.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f4f8;color:#999;border-radius:10px;">暂无活动图片</div>';
            }
        }

        // 报名要求
        const requirements = document.getElementById('activity-requirements');
        if (requirements) {
            requirements.innerHTML = '<p>1. 请如实填写报名信息；</p><p>2. 报名成功后请按时参加活动；</p><p>3. 如有特殊情况请提前联系主办方。</p>';
        }

        // 启用报名按钮
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) registerBtn.disabled = false;

        // 显示内容，隐藏加载
        document.getElementById('activity-content').style.display = 'block';
        document.getElementById('activity-loading').style.display = 'none';

    } catch (error) {
        console.error('加载活动详情失败:', error);
        showNotification('活动详情加载失败', 'error');
        hideLoading();
    }
}

function hideLoading() {
    const loading = document.getElementById('activity-loading');
    const content = document.getElementById('activity-content');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';
}

function initializeRegistration() {
    const registerBtn = document.getElementById('registerBtn');
    const formWrap = document.getElementById('registrationForm');
    const form = document.getElementById('registrationFormElement');
    const cancelBtn = document.getElementById('cancelRegistration');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (formWrap) formWrap.style.display = 'block';
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (formWrap) formWrap.style.display = 'none';
        });
    }
    if (form) {
        form.addEventListener('submit', submitRegistration);
    }
}

async function submitRegistration(e) {
    e.preventDefault();

    const name = document.getElementById('realName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !studentId || !phone || !email) {
        showNotification('请填写完整的报名信息', 'error');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');

    // 按钮加载状态
    const submitBtn = e.target.querySelector('button[type=submit]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;

    try {
        await registerForActivity(activityId, { name, phone, email });

        // 关闭报名表单
        const formWrap = document.getElementById('registrationForm');
        if (formWrap) formWrap.style.display = 'none';

        // 显示成功模态框
        const modal = document.getElementById('successModal');
        if (modal) modal.style.display = 'block';

        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        }

        // 更新报名按钮
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.textContent = '已报名';
            registerBtn.disabled = true;
        }

        // 重置表单
        e.target.reset();
    } catch (error) {
        console.error('报名失败:', error);
        showNotification('报名失败，请稍后重试', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function initializeShare() {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
        const title = document.getElementById('activity-title').textContent;
        const desc = document.getElementById('activity-description').textContent;

        if (navigator.share) {
            navigator.share({ title, text: desc, url: window.location.href }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('链接已复制到剪贴板', 'success');
            }).catch(() => {
                showNotification('复制失败，请手动复制链接', 'error');
            });
        }
    });
}
