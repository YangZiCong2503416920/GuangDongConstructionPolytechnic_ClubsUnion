// about.js - 关于页面逻辑（滚动渐显 + 返回顶部）
import { Utils } from '../core/utils.js';

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollReveal();
        this.initBackToTop();
    }

    // 滚动渐显动画：进入视口时添加 visible 类
    initScrollReveal() {
        const sections = document.querySelectorAll('.about-section');
        if (!sections.length) return;

        // 不支持 IntersectionObserver 时直接全部显示
        if (!('IntersectionObserver' in window)) {
            sections.forEach(s => s.classList.add('reveal-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(s => observer.observe(s));
    }

    // 返回顶部按钮
    initBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.textContent = '↑';
        btn.setAttribute('aria-label', '返回顶部');
        document.body.appendChild(btn);

        const toggle = () => {
            btn.classList.toggle('show', window.scrollY > 400);
        };

        window.addEventListener('scroll', Utils.throttle(toggle, 150));
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        toggle();
    }
}

// 初始化页面
window.aboutPage = new AboutPage();
