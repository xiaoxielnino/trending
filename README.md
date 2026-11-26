# GitHub 热门仓库

一个简洁的网站，展示 GitHub 官方 Trending 页面的今日/本周/本月热门仓库。

**在线访问**: https://xiaoxielnino.github.io/trending/

> **首次部署说明**: 如果网站尚未上线，请在仓库 Settings → Pages → Build and deployment → Source 中选择 "GitHub Actions"，然后手动触发 workflow 或等待下次 push。

## 功能

- 展示 GitHub Trending 今日、本周、本月热门仓库
- 按编程语言筛选
- 显示仓库名称、描述、语言、Star 数、Fork 数、新增 Star 数
- 显示每个仓库的许可证和标签
- 提供克隆命令和 README 链接
- 深色主题，支持移动端

## 数据来源

数据从 GitHub 官方 Trending 页面 (https://github.com/trending) 抓取，包括：
- 今日热门 (`?since=daily`)
- 本周热门 (`?since=weekly`)
- 本月热门 (`?since=monthly`)

额外信息（许可证、标签、主页）通过 GitHub REST API 获取（无需认证）。

## 自动更新

通过 GitHub Actions 每天自动更新数据并部署到 GitHub Pages。

## 本地运行

```bash
# 安装依赖
npm install

# 抓取最新数据
npm run fetch-data

# 启动开发服务器
npm run dev
```

## 构建部署

```bash
# 抓取数据并构建
npm run fetch-data && npm run build

# 预览构建结果
npm run preview
```

## 技术栈

- Vite + React + TypeScript
- 纯 CSS（无 UI 框架）
- 静态 JSON 数据文件
- GitHub Actions 自动部署

## 许可证

MIT
