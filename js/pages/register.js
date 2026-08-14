// register.js - 注册页面逻辑
import { API } from '../core/api.js';
import { Utils } from '../core/utils.js';

class RegisterPage {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // 输入时即时校验确认密码
        const confirmInput = document.getElementById('regConfirmPassword');
        if (confirmInput) {
            confirmInput.addEventListener('input', () => {
                this.validateConfirmPassword(false);
            });
        }
    }

    // 校验确认密码是否一致
    validateConfirmPassword(showMessage = true) {
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;

        if (showMessage && confirm && password !== confirm) {
            Utils.showMessage('两次输入的密码不一致', 'error');
            return false;
        }
        return !confirm || password === confirm;
    }

    // 表单校验
    validate() {
        const username = document.getElementById('regUsername').value.trim();
        const name = document.getElementById('regName').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        const phone = document.getElementById('regPhone').value.trim();
        const agree = document.getElementById('regAgree').checked;

        if (!username) {
            Utils.showMessage('请输入学号或工号', 'error');
            return false;
        }
        if (!name) {
            Utils.showMessage('请输入真实姓名', 'error');
            return false;
        }
        if (password.length < 6) {
            Utils.showMessage('密码长度至少 6 位', 'error');
            return false;
        }
        if (password !== confirm) {
            Utils.showMessage('两次输入的密码不一致', 'error');
            return false;
        }
        if (!Utils.validatePhone(phone)) {
            Utils.showMessage('请输入正确的手机号', 'error');
            return false;
        }
        if (!agree) {
            Utils.showMessage('请先阅读并同意用户协议', 'error');
            return false;
        }
        return true;
    }

    async handleRegister() {
        if (!this.validate()) {
            return;
        }

        const submitBtn = document.getElementById('registerBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '注册中...';
        submitBtn.disabled = true;

        try {
            const userData = {
                username: document.getElementById('regUsername').value.trim(),
                name: document.getElementById('regName').value.trim(),
                password: document.getElementById('regPassword').value,
                phone: document.getElementById('regPhone').value.trim()
            };

            const result = await API.register(userData);

            if (result.success) {
                Utils.showMessage('注册成功，请登录', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                Utils.showMessage(result.message || '注册失败', 'error');
            }
        } catch (error) {
            console.error('注册失败:', error);
            Utils.showMessage('注册失败，请稍后重试', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// 初始化页面
window.registerPage = new RegisterPage();
