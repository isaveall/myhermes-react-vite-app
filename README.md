# MyHermes React Vite App

一个基于React + Vite的现代化管理后台系统，提供完整的用户认证、文件管理、数据统计等功能。

## 功能特性

### 用户系统
- 用户注册和登录
- 用户个人中心
- 认证状态管理
- 受保护的路由

### 文件管理
- 文件上传（支持多文件和文件夹）
- 分片上传和断点续传
- 文件列表和管理
- 文件下载和删除
- 批量操作

### 管理后台
- 响应式侧边栏导航
- 多页面管理（首页、关于、文件上传、联系我们、系统设置等）
- 数据统计和图表展示
- 帮助中心

### 技术特性
- 基于React 19和Vite 8
- 使用React.lazy实现代码分割和懒加载
- 现代化UI设计
- 完整的错误处理
- 文件数据库存储

## 技术栈

### 前端
- React 19
- Vite 8
- React Router（通过状态管理）
- CSS3（响应式设计）

### 后端
- Express 5
- Multer（文件上传）
- Busboy（分片上传）
- UUID（唯一标识符）
- 文件系统存储

## 项目结构

```
my-hermes-vite-app/
├── src/                    # 前端源代码
│   ├── components/         # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── Layout.jsx     # 主布局组件
│   │   ├── FileUpload.jsx # 文件上传组件
│   │   └── UserProfile.jsx# 用户资料组件
│   ├── context/           # React上下文
│   │   └── AuthContext.jsx # 认证上下文
│   ├── App.jsx            # 主应用组件
│   ├── main.jsx           # 应用入口
│   └── *.css              # 样式文件
├── server.js              # Express后端服务器
├── public/                # 静态资源
├── uploads/               # 上传文件存储目录
├── chunks/                # 分片上传临时目录
├── db/                    # 数据库文件
├── package.json           # 项目配置
└── vite.config.js         # Vite配置
```

## 安装和运行

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/isaveall/myhermes-react-vite-app.git
cd myhermes-react-vite-app
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 启动后端服务器（在新的终端窗口）
```bash
node server.js
```

5. 访问应用
- 前端：http://localhost:5173
- 后端API：http://localhost:3001

### 生产构建

1. 构建前端
```bash
npm run build
```

2. 预览构建结果
```bash
npm run preview
```

## 使用说明

### 用户认证
1. 访问应用会自动跳转到登录页面
2. 使用演示账户登录或注册新账户
3. 登录后可以访问所有功能

### 文件上传
1. 点击侧边栏的"文件上传"
2. 选择要上传的文件或文件夹
3. 支持拖拽上传
4. 大文件会自动分片上传
5. 支持断点续传

### 文件管理
1. 点击侧边栏的"文件管理"
2. 查看已上传的文件列表
3. 支持文件下载、删除、批量操作
4. 支持文件夹导航

### 系统设置
1. 点击侧边栏的"系统设置"
2. 管理用户偏好设置
3. 系统配置选项

## API文档

### 文件上传API

#### 健康检查
```
GET /api/health
```

#### 获取文件列表
```
GET /api/files
```

#### 单文件上传
```
POST /api/upload
Content-Type: multipart/form-data
```

#### 多文件上传
```
POST /api/upload/multiple
Content-Type: multipart/form-data
```

#### 分片上传初始化
```
POST /api/upload/init
Content-Type: application/json
{
  "fileName": "filename.ext",
  "fileSize": 12345678,
  "fileType": "application/octet-stream",
  "totalChunks": 10
}
```

#### 上传分片
```
POST /api/upload/chunk
Content-Type: multipart/form-data
```

#### 合并分片
```
POST /api/upload/merge
Content-Type: application/json
{
  "uploadId": "uuid",
  "fileName": "filename.ext"
}
```

#### 查询上传状态
```
GET /api/upload/status/:uploadId
```

#### 取消上传
```
DELETE /api/upload/cancel/:uploadId
```

#### 删除文件
```
DELETE /api/files/:filename
```

#### 批量删除
```
POST /api/files/batch-delete
Content-Type: application/json
{
  "filenames": ["file1.txt", "file2.txt"]
}
```

## 开发指南

### 添加新页面
1. 在`src/components/pages/`创建新的页面组件
2. 在`src/App.jsx`中添加路由
3. 在`src/components/Layout.jsx`中添加菜单项

### 修改样式
- 全局样式：`src/index.css`
- 组件样式：对应的`.css`文件
- 布局样式：`src/components/Layout.css`

### 后端API扩展
- 在`server.js`中添加新的路由
- 使用Express中间件处理请求
- 更新文件数据库操作

## 部署

### 前端部署
1. 构建生产版本：`npm run build`
2. 将`dist`目录部署到静态文件服务器

### 后端部署
1. 确保Node.js环境
2. 运行`node server.js`
3. 配置反向代理（可选）

### Docker部署（可选）
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "server.js"]
```

## 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情

## 联系方式

- 项目地址：https://github.com/isaveall/myhermes-react-vite-app
- 问题反馈：https://github.com/isaveall/myhermes-react-vite-app/issues

## 致谢

- React团队
- Vite团队
- Express团队
- 所有贡献者

---

**注意：** 这是一个演示项目，用于学习和开发目的。在生产环境中使用前，请确保添加适当的安全措施和错误处理。