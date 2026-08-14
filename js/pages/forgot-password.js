// forgot-password.js - 找回密码页面逻辑
import { Utils } from '../core/utils.js';

class ForgotPasswordPage {
    constructor() {
        this.verificationCode = null; // 本次生成的验证码
        this.countdown = 0;           // 倒计时秒数
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const form = document.getElementById('forgotPasswordForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReset();
            });
        }

        const getCodeBtn = document.getElementById('getVerificationCode');
        if (getCodeBtn) {
            getCodeBtn.addEventListener('click', () => {
                this.sendVerificationCode();
            });
        }

        // 输入时即时校验确认密码
        const confirmInput = document.getElementById('confirmNewPassword');
        if (confirmInput) {
            confirmInput.addEventListener('input', () => {
                this.validateConfirmPassword(false);
            });
        }
    }

    // 校验确认密码
    validateConfirmPassword(showMessage = true) {
        const password = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;

        if (showMessage && confirm && password !== confirm) {
            Utils.showMessage('两次输入的新密码不一致', 'error');
            return false;
        }
        return !confirm || password === confirm;
    }

    // 发送验证码（模拟）
    sendVerificationCode() {
        const phone = document.getElementById('forgotPhone').value.trim();

        if (!phone) {
            Utils.showMessage('请先输入手机号', 'error');
            return;
        }
        if (!Utils.validatePhone(phone)) {
            Utils.showMessage('请输入正确的手机号', 'error');
            return;
        }

        // 模拟生成 6 位验证码
        this.verificationCode = String(Math.floor(100000 + Math.random() * 900000));
        console.log('[模拟] 验证码:', this.verificationCode);

        Utils.showMessage('验证码已发送至手机（模拟），请查收', 'success');

        // 60 秒倒计时
        const btn = document.getElementById('getVerificationCode');
        this.countdown = 60;
        btn.disabled = true;

        const timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.textContent = '获取验证码';
            } else {
                btn.textContent = this.countdown + 's 后重发';
            }
        }, 1000);
    }

    // 表单校验
    validate() {
        const username = document.getElementById('forgotUsername').value.trim();
        const phone = document.getElementById('forgotPhone').value.trim();
        const code = document.getElementById('verificationCode').value.trim();
        const password = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;

        if (!username) {
            Utils.showMessage('请输入学号或工号', 'error');
            return false;
        }
        if (!Utils.validatePhone(phone)) {
            Utils.showMessage('请输入正确的手机号', 'error');
            return false;
        }
        if (!this.verificationCode) {
            Utils.showMessage('请先获取验证码', 'error');
            return false;
        }
        if (code !== this.verificationCode) {
            Utils.showMessage('验证码错误', 'error');
            return false;
        }
        if (password.length < 6) {
            Utils.showMessage('密码长度至少 6 位', 'error');
            return false;
        }
        if (password !== confirm) {
            Utils.showMessage('两次输入的新密码不一致', 'error');
            return false;
        }
        return true;
    }

    async handleReset() {
        if (!this.validate()) {
            return;
        }

        const submitBtn = document.getElementById('resetPasswordBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '重置中...';
        submitBtn.disabled = true;

        try {
            // 模拟重置请求
            await new Promise(resolve => setTimeout(resolve, 1000));

            Utils.showMessage('密码重置成功，请使用新密码登录', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error('重置失败:', error);
            Utils.showMessage('重置失败，请稍后重试', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// 初始化页面
window.forgotPasswordPage = new ForgotPasswordPage();
