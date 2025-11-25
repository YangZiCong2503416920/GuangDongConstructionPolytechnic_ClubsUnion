// auth.js - 用户认证模块

// 模拟当前用户状态
let currentUser = null;
let authToken = localStorage.getItem('auth_token') || null;

// 用户登录
async function login(username, password) {
    try {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟登录验证（实际项目中应调用后端API）
        if (username && password) {
            const user = {
                id: 'user_' + Date.now(),
                username: username,
                name: username,
                role: 'student',
                permissions: ['view_activities', 'join_clubs']
            };

            currentUser = user;
            authToken = 'token_' + Date.now();

            // 保存到本地存储
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('user_info', JSON.stringify(user));

            return {
                success: true,
                user: user,
                token: authToken
            };
        }

        return {
            success: false,
            message: '用户名或密码错误'
        };
    } catch (error) {
        console.error('登录失败:', error);
        return {
            success: false,
            message: '登录失败，请稍后重试'
        };
    }
}

// 用户登出
function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
}

// 检查是否已登录
function isAuthenticated() {
    if (!authToken) {
        return false;
    }

    // 检查 token 是否过期（模拟）
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        return true;
    }

    return false;
}

// 获取当前用户信息
function getCurrentUser() {
    if (!currentUser && isAuthenticated()) {
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }
    }
    return currentUser;
}

// 检查用户权限
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user || !user.permissions) {
        return false;
    }
    return user.permissions.includes(permission);
}

// 检查是否为管理员
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// 验证用户凭据
async function validateCredentials() {
    try {
        if (!authToken) {
            return false;
        }

        // 模拟验证请求
        await new Promise(resolve => setTimeout(resolve, 500));

        // 检查本地存储的用户信息
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            return true;
        }

        return false;
    } catch (error) {
        console.error('验证凭据失败:', error);
        return false;
    }
}

// 重新验证登录状态
async function revalidate() {
    if (await validateCredentials()) {
        return { authenticated: true, user: getCurrentUser() };
    } else {
        logout();
        return { authenticated: false };
    }
}

// 导出所有函数
export {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    hasPermission,
    isAdmin,
    validateCredentials,
    revalidate
};

// 也可以导出一个命名空间对象
export const Auth = {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    hasPermission,
    isAdmin,
    validateCredentials,
    revalidate
};



