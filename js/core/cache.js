/**
 * 本地缓存管理模块
 * 封装 localStorage / sessionStorage 操作，支持过期时间
 */

const CACHE_PREFIX = 'clubs_';

/**
 * 设置缓存（带可选过期时间）
 * @param {string} key
 * @param {*} value
 * @param {number|null} ttl 过期时间（秒），null 表示永不过期
 */
export function set(key, value, ttl = null) {
    const item = {
        value: value,
        expiry: ttl ? Date.now() + ttl * 1000 : null
    };
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (e) {
        console.warn('Cache.set failed:', e);
    }
}

/**
 * 获取缓存
 * @param {string} key
 * @returns {*} 值，若不存在或已过期则返回 null
 */
export function get(key) {
    try {
        const itemStr = localStorage.getItem(CACHE_PREFIX + key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (item.expiry && Date.now() > item.expiry) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return item.value;
    } catch (e) {
        console.warn('Cache.get failed:', e);
        return null;
    }
}

/**
 * 删除缓存
 * @param {string} key
 */
export function remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
}

/**
 * 清空所有本应用缓存
 */
export function clear() {
    Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
}