# Journey Unit Lab - 项目设置指南

## 🚀 快速开始

### 前置要求
- Node.js >= 16
- npm 或 yarn
- MongoDB Atlas 账户（云数据库）
- OpenAI 或 Claude API 密钥
- AWS S3 或阿里云 OSS 账户

---

## 📋 第 1 步：环境配置

### 1.1 复制环境变量文件

```bash
cp .env.example .env.local
```

### 1.2 填写 .env.local

**关键变量说明**：

```env
# ========== 数据库 ==========
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/journey-unit-lab

# ========== 认证 ==========
JWT_SECRET=your-super-secret-key-min-32-chars-long
JWT_EXPIRE=7d

# ========== AI 服务 ==========
AI_SERVICE=OPENAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# ========== 文件存储 ==========
STORAGE_SERVICE=AWS_S3
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# ========== 服务器 ==========
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## 🔧 第 2 步：安装依赖

### 2.1 后端依赖

```bash
cd backend
npm install
```

### 2.2 前端依赖

```bash
cd frontend
npm install
```

---

## ▶️ 第 3 步：启动开发服务器

### 3.1 启动后端（在 `backend` 目录）

```bash
npm run dev
```

输出应该是：
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### 3.2 启动前端（新终端，在 `frontend` 目录）

```bash
npm run dev
```

输出应该是：
```
VITE v... ready in ... ms
➜  Local:   http://localhost:3000/
```

---

## 🧪 第 4 步：测试连接

### 测试后端

```bash
curl http://localhost:5000/api/health
```

预期响应：
```json
{
  "status": "OK",
  "timestamp": "2024-06-07T..."
}
```

### 测试前端

访问 http://localhost:3000 应该看到加载的应用界面

---

## 📊 MongoDB Atlas 设置

1. 创建账户：https://www.mongodb.com/cloud/atlas
2. 创建 Cluster（选择 Free Tier）
3. 创建数据库用户和密码
4. 获取连接字符串：`mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>`
5. 在 `.env.local` 中填写 `MONGODB_URI`

---

## 🔑 OpenAI API 密钥设置

1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API 密钥
3. 复制到 `.env.local` 的 `OPENAI_API_KEY`

**成本管理**：
- 设置每月支出限制
- 监控 API 使用情况
- GPT-4 大约 $0.03/1K tokens

---

## 🪣 AWS S3 设置

### 创建 S3 Bucket

1. 登录 AWS 控制台
2. 创建新 Bucket（例如 `journey-unit-lab-assets`）
3. 设置为公开读权限

### 创建 IAM 用户

1. IAM 控制台 → Users → 创建用户
2. 编程访问（获取 Access Key 和 Secret Key）
3. 附加策略：`AmazonS3FullAccess`
4. 复制凭证到 `.env.local`：
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_S3_BUCKET=your-bucket
   AWS_REGION=us-east-1
   ```

---

## 🐛 常见问题

### 问题 1：MongoDB 连接失败

**解决**：
- 检查 `MONGODB_URI` 是否正确
- 确保 MongoDB Atlas IP 白名单包含你的 IP（或允许所有：0.0.0.0/0）
- 检查网络连接

### 问题 2：OpenAI API 错误

**解决**：
- 确认 API 密钥有效
- 检查账户配额和支出限制
- 查看 OpenAI 状态页面

### 问题 3：前端无法连接后端

**解决**：
- 确保后端运行在 `localhost:5000`
- 检查 `.env.local` 中的 `CORS_ORIGIN`
- 清除浏览器缓存

### 问题 4：S3 上传失败

**解决**：
- 检查 AWS 凭证
- 确认 Bucket 存在且可访问
- 验证 IAM 权限

---

## 📁 项目结构概览

```
journey-unit-lab/
├── backend/
│   ├── routes/          # API 路由
│   ├── models/          # 数据库模型
│   ├── middleware/      # 中间件
│   ├── services/        # 业务逻辑
│   ├── server.js        # 入口文件
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── components/  # 可复用组件
│   │   ├── context/     # 全局状态
│   │   ├── api/         # API 客户端
│   │   ├── styles/      # 样式文件
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🎯 下一步

1. ✅ 项目初始化完成
2. ⏭️ 实现用户认证 UI（登录/注册页面）
3. ⏭️ 实现文件上传功能
4. ⏭️ 集成 AI 拆解
5. ⏭️ 构建资产库和搜索
6. ⏭️ 实现灵感生成器
7. ⏭️ 完整的 Y2K 设计系统

---

## 📞 需要帮助？

有问题随时沟通！ 😊
