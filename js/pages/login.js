// login.js - 登录页面逻辑
import { API } from '../core/api.js';
import { Auth } from '../core/auth.js';
import { Utils } from '../core/utils.js';

class LoginPage {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkRememberedUser();
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            Utils.showMessage('请输入用户名和密码', 'error');
            return;
        }

        try {
            // 显示加载状态
            const submitBtn = document.querySelector('.form-button.primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '登录中...';
            submitBtn.disabled = true;

            // 模拟登录（v2.2.0 版本）
            const result = await API.login(username, password);

            if (result.success) {
                // 保存用户信息
                localStorage.setItem('auth_token', result.token);
                localStorage.setItem('user_info', JSON.stringify(result.user));

                if (rememberMe) {
                    localStorage.setItem('remembered_user', JSON.stringify({
                        username: username
                    }));
                } else {
                    localStorage.removeItem('remembered_user');
                }

                Utils.showMessage('登录成功', 'success');

                // 延迟跳转
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
            } else {
                Utils.showMessage(result.message || '登录失败', 'error');
            }
        } catch (error) {
            console.error('登录失败:', error);
            Utils.showMessage('登录失败，请稍后重试', 'error');
        } finally {
            // 恢复按钮状态
            const submitBtn = document.querySelector('.form-button.primary');
            if (submitBtn) {
                submitBtn.textContent = '登录';
                submitBtn.disabled = false;
            }
        }
    }

    checkRememberedUser() {
        const remembered = localStorage.getItem('remembered_user');
        if (remembered) {
            const userData = JSON.parse(remembered);
            document.getElementById('username').value = userData.username;
            document.getElementById('rememberMe').checked = true;
        }
    }
}

// 初始化页面
window.loginPage = new LoginPage();



