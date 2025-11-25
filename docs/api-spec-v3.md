# 社团门户 v3.0 API 接口规范（草案）

## 认证
- 所有接口需携带 `X-User-ID: <uuid>` 头（由前端生成并持久化）

## 活动接口
- `GET /api/activities` → 获取活动列表
- `GET /api/activities/:id` → 获取活动详情
- `POST /api/activities/:id/register` → 报名活动（body: { name, phone, email }）

## 社团接口
- `GET /api/clubs`
- `POST /api/favorites` → { clubId }
- `DELETE /api/favorites/:clubId`

## 用户接口
- `GET /api/profile` → 返回 { favorites: [], registrations: [] }
- `GET /api/notifications`

## 错误格式
```json
{ "error": "错误描述", "code": "INVALID_INPUT" }