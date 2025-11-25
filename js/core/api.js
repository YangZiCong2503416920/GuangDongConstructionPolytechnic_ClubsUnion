// api.js - API 接口封装
export class API {
    static baseUrl = '/api'; // 开发环境 API 基础路径

    // 获取社团列表
    static async getClubs(params = {}) {
        try {
            // 模拟 API 延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 从本地数据加载（v2.2.0）
            const response = await fetch('/data/clubs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // 模拟分页参数处理
            const { page = 1, limit = 12, category, search } = params;
            let filteredData = data;

            if (category) {
                filteredData = filteredData.filter(club => club.category === category);
            }

            if (search) {
                const searchTerm = search.toLowerCase();
                filteredData = filteredData.filter(club =>
                    club.name.toLowerCase().includes(searchTerm) ||
                    club.description.toLowerCase().includes(searchTerm)
                );
            }

            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedData = filteredData.slice(start, end);

            return {
                data: paginatedData,
                total: filteredData.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(filteredData.length / limit)
            };
        } catch (error) {
            console.error('获取社团列表失败:', error);
            throw error;
        }
    }

    // 获取活动列表
    static async getActivities(params = {}) {
        try {
            // 模拟 API 延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 从本地数据加载并生成模拟活动
            const clubsResponse = await fetch('/data/clubs.json');
            if (!clubsResponse.ok) {
                throw new Error(`HTTP error! status: ${clubsResponse.status}`);
            }
            const clubs = await clubsResponse.json();

            // 为每个社团生成模拟活动
            const activities = [];
            clubs.forEach(club => {
                for (let i = 0; i < 3; i++) {
                    const activity = {
                        id: `act_${club.id}_${i}`,
                        title: `${club.name} - 模拟活动${i + 1}`,
                        description: `这是${club.name}社团组织的第${i + 1}个模拟活动，欢迎参与！`,
                        category: club.category,
                        organizer: club.name,
                        startTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        endTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 + 3600000).toISOString().split('T')[0],
                        location: '模拟地点',
                        maxParticipants: 50,
                        currentParticipants: Math.floor(Math.random() * 50),
                        status: Math.random() > 0.3 ? 'upcoming' : 'ongoing',
                        image: club.logo || 'https://via.placeholder.com/300x200/cccccc/ffffff?text=活动',
                        createdAt: new Date().toISOString().split('T')[0]
                    };
                    activities.push(activity);
                }
            });

            // 模拟分页参数处理
            const { page = 1, limit = 12, status, category, search } = params;
            let filteredData = activities;

            if (status) {
                filteredData = filteredData.filter(activity => activity.status === status);
            }

            if (category) {
                filteredData = filteredData.filter(activity => activity.category === category);
            }

            if (search) {
                const searchTerm = search.toLowerCase();
                filteredData = filteredData.filter(activity =>
                    activity.title.toLowerCase().includes(searchTerm) ||
                    activity.description.toLowerCase().includes(searchTerm) ||
                    activity.organizer.toLowerCase().includes(searchTerm)
                );
            }

            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedData = filteredData.slice(start, end);

            return {
                data: paginatedData,
                total: filteredData.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(filteredData.length / limit)
            };
        } catch (error) {
            console.error('获取活动列表失败:', error);
            throw error;
        }
    }

    // 获取单个社团详情
    static async getClub(id) {
        try {
            const response = await fetch('/data/clubs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const clubs = await response.json();
            const club = clubs.find(c => c.id === id);

            if (!club) {
                throw new Error('社团不存在');
            }

            return club;
        } catch (error) {
            console.error('获取社团详情失败:', error);
            throw error;
        }
    }

    // 用户登录
    static async login(username, password) {
        try {
            // 模拟登录延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 模拟登录成功
            if (username && password) {
                return {
                    success: true,
                    token: 'mock-token-' + Date.now(),
                    user: {
                        id: 'mock-user-1',
                        username: username,
                        name: username,
                        role: 'student'
                    }
                };
            }

            return {
                success: false,
                message: '用户名或密码错误'
            };
        } catch (error) {
            console.error('登录失败:', error);
            throw error;
        }
    }

    // 用户注册
    static async register(userData) {
        try {
            // 模拟注册延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 模拟注册成功
            return {
                success: true,
                message: '注册成功，请登录'
            };
        } catch (error) {
            console.error('注册失败:', error);
            throw error;
        }
    }

    // 检查登录状态
    static async checkAuth() {
        try {
            // 模拟检查延迟
            await new Promise(resolve => setTimeout(resolve, 200));

            // 从 localStorage 检查 token
            const token = localStorage.getItem('auth_token');
            if (token) {
                return {
                    authenticated: true,
                    user: JSON.parse(localStorage.getItem('user_info') || '{}')
                };
            }

            return { authenticated: false };
        } catch (error) {
            console.error('检查登录状态失败:', error);
            return { authenticated: false };
        }
    }
}