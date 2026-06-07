# Journey Unit Lab 🌍✨

**AI赋能的旅行体验资产管理与灵感生成平台**

将旅行碎片转化为可复用的设计资产，通过 AI 拆解、多维搜索和灵感生成器，帮助设计师创作新的设计方案。

## 🎨 设计风格

采用 **makemepulse + Y2K 美学融合**，呈现沉浸式的高互动、艺术向的数字体验。

- 纯黑背景 + 高饱和强调色（霓虹感）
- 梦幻渐变 + 有机 blob 形状
- 3D 元素和粒子系统
- 流体动画和视差效果

## 🏗️ 项目结构

```
journey-unit-lab/
├── frontend/                  # React 前端应用
│   ├── public/
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── components/       # 可复用组件
│   │   ├── context/          # 全局状态（认证等）
│   │   ├── api/              # API 请求配置
│   │   ├── styles/           # 全局样式
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                   # Node.js + Express 后端
│   ├── routes/               # API 路由
│   ├── models/               # MongoDB 数据模型
│   ├── middleware/           # 中间件（认证等）
│   ├── services/             # 业务逻辑（AI、存储等）
│   ├── config/               # 配置文件
│   ├── server.js
│   └── package.json
│
├── .env.example              # 环境变量模板
└── README.md
```

## 🚀 快速开始

### 前提条件
- Node.js >= 16
- MongoDB Atlas 账户（或本地 MongoDB）
- OpenAI / Claude API 密钥
- AWS S3 或阿里云 OSS 账户（文件存储）

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 填写必要的环境变量：
```
# Database
MONGODB_URI=

# Authentication
JWT_SECRET=

# AI Service
OPENAI_API_KEY=
# or
CLAUDE_API_KEY=

# File Storage
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
```

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

### 启动后端

```bash
cd backend
npm install
npm start
```

后端运行在 `http://localhost:5000`

## ☁️ 部署指南

> **推荐流程**：先部署后端（Render / Railway），获取公网地址后再构建并部署前端（Vercel / Netlify / Render Static）。

---

### 🔹 Render（全栈一键部署）

项目根目录已有 [`render.yaml`](./render.yaml)，导入即可。

**后端 Blueprint（Node Web Service）**

1. 登录 [Render Dashboard](https://dashboard.render.com/) → Blueprints → 连接你的 Git 仓库
2. Render 会自动读取 `render.yaml`，识别 `journey-unit-lab-backend`（Node）和 `journey-unit-lab-frontend`（Static Site）
3. 在后端服务中添加环境变量：
   | 变量 | 说明 |
   |---|---|
   | `MONGODB_URI` | MongoDB Atlas 连接字符串 |
   | `JWT_SECRET` | 至少 32 位的随机密钥 |
   | `AI_SERVICE` | `OPENAI` 或 `CLAUDE` |
   | `OPENAI_API_KEY` | 你的 OpenAI API 密钥 |
   | `OPENAI_MODEL` | 模型名称，例如 `gpt-4` |
   | `STORAGE_SERVICE` | 存储方案，例如 `AWS_S3` |
   | `AWS_S3_BUCKET` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` | S3 配置 |
   | `CORS_ORIGIN` | 前端最终地址（先留空，获得前端 URL 后再回填） |
4. 后端部署完成后你会得到一个类似 `https://journey-unit-lab-backend.onrender.com` 的地址
5. 在前端 Static Site 环境变量中设置：
   - `VITE_API_URL` = `https://journey-unit-lab-backend.onrender.com/api`
   - `VITE_API_TIMEOUT` = `30000`
6. 前端构建完成后即可通过 `https://journey-unit-lab-frontend.onrender.com` 访问

---

### 🔹 Railway

项目根目录已有 [`railway.json`](./railway.json)。

1. 登录 [Railway](https://railway.app/) → 创建新项目 → "Deploy from GitHub repo"
2. Railway 会自动检测 `railway.json` 里的两个服务
3. **后端环境变量**（与 Render 相同，见上表）
4. 后端部署完成后记录公网域名
5. 在 Railway 前端服务的 Variables 中设置 `VITE_API_URL` 和后端域名
6. 从 Railway 提供的域名即可访问完整应用

---

### 🔹 Vercel（前端 + 可单独部署后端）

**前端**：项目已有 `frontend/vercel.json`。

1. 在 Vercel 中导入项目，Root Directory 设为 `frontend`
2. 框架自动检测为 Vite
3. 环境变量：
   - `VITE_API_URL` = 后端地址 `/api`
   - `VITE_API_TIMEOUT` = `30000`

**后端**也可以单独通过 Vercel Functions 部署（需本地改造为 serverless），推荐先用 Render / Railway。

---

### 🔹 Netlify（前端）

项目已有 `frontend/netlify.toml`，在 Netlify 中导入 `frontend` 目录即可。

> 注意：前端为纯静态资源，所有 API 请求会直连后端；确保 `CORS_ORIGIN` 包含前端域名。

---

### Docker 本地 / 云部署

`docker-compose.yml` 可快速在本地或任意云主机上一键启动：

```bash
cp .env.docker.example .env.docker
# 填写后端密钥、Mongo URI、S3/OSS 配置、VITE_API_URL 等
docker compose up --build
```

- 前端: `http://localhost:3000`
- 后端: `http://localhost:5000`

---

### ☑️ 部署检查清单

- [ ] MongoDB 集群已创建且 IP 白名单已配置（或 `0.0.0.0/0`）
- [ ] AI API 密钥有效且有余额
- [ ] S3/OSS Bucket 已创建且权限正确（或部署时暂时跳过文件上传）
- [ ] `JWT_SECRET` 为强随机字符串
- [ ] 后端 `CORS_ORIGIN` 包含前端实际域名
- [ ] 前端 `VITE_API_URL` 指向后端公网地址

## 🔑 核心功能

### 1. **用户认证**
- 注册 / 登录（JWT）
- 用户会话管理

### 2. **旅行资产上传**
- 支持图片、文字、路线信息
- 文件上传到 S3/OSS
- AI 自动拆解为结构化资产

### 3. **AI 拆解引擎**
输入：原始媒体（照片、文字、位置）  
输出：
```json
{
  "triggers": [],              // 触发点
  "collected_inputs": [],      // 采集输入
  "cognitive_understanding": "", // 认知理解
  "emotional_reactions": [],   // 情绪反应
  "behaviors": [],             // 行为
  "auto_tags": {
    "emotions": [],
    "behaviors": [],
    "scenarios": [],
    "creativity_types": []
  }
}
```

### 4. **资产库与多维搜索**
- 按情绪、行为、情景、创意类型搜索
- 高级过滤和排序

### 5. **灵感生成器**
- 选择多个资产
- AI 分析并生成综合设计方案
- 输出新的设计建议

## 📊 数据库 Schema

### Users
```javascript
{
  _id: ObjectId,
  email: String,
  password_hash: String,
  username: String,
  created_at: Date,
  updated_at: Date
}
```

### Assets
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  title: String,
  description: String,
  source_type: String, // 'photo', 'text', 'route'
  original_media: [
    {
      type: String,
      url: String,
      size: Number
    }
  ],
  parsed_data: {
    triggers: [String],
    collected_inputs: [String],
    cognitive_understanding: String,
    emotional_reactions: [String],
    behaviors: [String],
    auto_tags: {
      emotions: [String],
      behaviors: [String],
      scenarios: [String],
      creativity_types: [String]
    }
  },
  created_at: Date,
  updated_at: Date
}
```

### Inspiration Outputs
```javascript
{
  _id: ObjectId,
  designer_id: ObjectId,
  source_assets: [ObjectId],
  combined_result: {
    summary: String,
    design_suggestions: [String],
    merged_tags: Object
  },
  generated_at: Date
}
```

## 🛠️ 技术栈

**前端**
- React 18
- Tailwind CSS + 自定义 Y2K 主题
- Framer Motion（动画）
- React Spring（物理动画）
- Axios（HTTP 客户端）

**后端**
- Node.js + Express
- MongoDB + Mongoose
- JWT（认证）
- OpenAI/Claude SDK
- AWS SDK S3 / 阿里云 OSS SDK
- Multer（文件上传）
- CORS / Helmet（安全）

**AI & 动画**
- OpenAI GPT-4 / Claude 3（拆解 + 生成）
- GSAP / Three.js（高级动画）
- SVG.js（SVG 动画）

## 📅 项目阶段

- **Week 1** ✅ 项目架构 + 数据库设计
- **Week 1-2** 用户认证系统
- **Week 2-3** 文件上传 + AI 拆解
- **Week 3-4** 资产库 + 搜索
- **Week 4-5** 灵感生成器
- **Week 5-6** 部署 + 优化

## 🤝 贡献

项目开发中，欢迎沟通和反馈！

## 📝 许可证

MIT

---

**Made with ✨ for designers and travelers**
