# Hermes 文件上传系统

这是一个基于 React + Vite 构建的现代化文件上传系统，具有美观的界面和完整的文件管理功能。

## 功能特性

### 前端功能
- ✅ 拖放文件上传
- ✅ 点击选择文件
- ✅ 实时上传进度显示
- ✅ 文件大小限制（10MB）
- ✅ 已上传文件列表
- ✅ 文件下载功能
- ✅ 文件删除功能
- ✅ 响应式设计
- ✅ 错误提示和成功反馈
- ✅ 文件统计信息

### 后端功能（可选）
- ✅ 文件上传接口
- ✅ 文件列表获取
- ✅ 文件删除接口
- ✅ 文件类型过滤
- ✅ 文件大小限制
- ✅ CORS 支持
- ✅ 错误处理

## 项目结构

```
my-hermes-vite-app/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx      # 文件上传主组件
│   │   └── FileUpload.css     # 组件样式
│   ├── App.jsx                # 主应用组件
│   ├── App.css                # 应用样式
│   ├── main.jsx               # 应用入口
│   └── index.css              # 全局样式
├── server.js                  # 后端服务器（可选）
├── server-package.json        # 后端依赖配置
├── uploads/                   # 文件存储目录（运行后端后创建）
├── package.json              # 前端依赖配置
└── vite.config.js            # Vite 配置
```

## 快速开始

### 1. 启动前端开发服务器
```bash
cd my-hermes-vite-app
npm run dev
```
访问：http://localhost:5173

### 2. 启动后端服务器（可选）
```bash
# 安装后端依赖
npm install express multer cors

# 启动服务器
node server.js
```
后端运行在：http://localhost:3001

### 3. 启用真实API
要使用真实的后端API，修改 `src/components/FileUpload.jsx`：
1. 取消注释第54-66行的真实API代码
2. 注释掉第69行的模拟API代码

## API 接口

### 后端服务器（如果启用）
- `GET /api/health` - 健康检查
- `GET /api/files` - 获取文件列表
- `POST /api/upload` - 上传文件
- `DELETE /api/files/:filename` - 删除文件

## 技术栈

### 前端
- **React 19** - UI 框架
- **Vite** - 构建工具和开发服务器
- **Axios** - HTTP 客户端
- **CSS3** - 样式和动画

### 后端（可选）
- **Express** - Node.js Web 框架
- **Multer** - 文件上传中间件
- **CORS** - 跨域资源共享

## 配置选项

### 文件限制
- 最大文件大小：10MB
- 支持的文件类型：图片、文档、压缩文件等
- 存储位置：`uploads/` 目录

### 样式定制
可以通过修改以下文件自定义外观：
- `src/App.css` - 应用整体样式
- `src/components/FileUpload.css` - 上传组件样式

## 开发说明

### 添加新功能
1. 在 `src/components/` 下创建新组件
2. 在 `FileUpload.jsx` 中导入和使用
3. 添加相应的样式文件

### 扩展后端功能
1. 在 `server.js` 中添加新的路由
2. 添加相应的业务逻辑
3. 更新前端API调用

## 部署说明

### 前端部署
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建后的文件在 `dist/` 目录，可以部署到任何静态文件服务器。

### 后端部署
1. 确保 Node.js 环境
2. 安装依赖：`npm install`
3. 启动服务器：`node server.js`
4. 建议使用 PM2 或 Docker 进行生产部署

## 故障排除

### 常见问题
1. **文件上传失败**
   - 检查文件大小是否超过10MB
   - 检查网络连接
   - 查看浏览器控制台错误

2. **后端服务器无法启动**
   - 检查端口3001是否被占用
   - 确保已安装所有依赖
   - 检查Node.js版本（需要14.0.0+）

3. **跨域问题**
   - 确保后端启用了CORS
   - 检查前端API地址是否正确

### 调试技巧
- 打开浏览器开发者工具
- 查看网络请求和响应
- 检查控制台日志
- 使用React开发者工具

## 许可证

本项目仅供学习使用，可以根据需要自由修改和扩展。

## 更新日志

### v1.0.0
- 初始版本发布
- 基本文件上传功能
- 拖放支持
- 响应式设计
- 可选后端服务器