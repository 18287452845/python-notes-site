# Python Notes Site

本仓库负责把 [`python-notes-content`](https://github.com/18287452845/python-notes-content) 中的 Markdown 讲义转换为静态网页，并部署到现有的 Cloudflare Pages 项目 `python-notes`。

## 仓库职责

- `python-notes-content`：Markdown 正文、课程目录和章节图片，是内容唯一来源。
- `python-notes-site`：网页模板、CSS、JavaScript、Markdown 构建器、页面校验和部署工作流。
- `public/`：构建生成的静态网页，不手动编辑其中的讲义 HTML。

## 页面功能

生成的网站包含：

- 首页课程目录和章节导航。
- 三列桌面布局：课程目录、本页目录、讲义正文。
- 课程目录收起/打开按钮。
- 移动端自适应布局。
- 根据二级、三级标题生成“本页目录”和页内锚点。
- MathJax 公式渲染。
- Highlight.js 代码语法高亮。
- 代码块一键复制。
- 讲义图片复制到站点资源目录并使用相对资源路径。

## 本地构建

需要 Node.js 22 或更高版本，并准备内容仓库目录：

```powershell
$env:CONTENT_DIR = "D:\Documents\Python笔记"
npm ci
npm run build
npm run check
```

其中：

- `npm run build`：读取 Markdown，生成 `public/`。
- `npm run check`：检查页面数量、课程目录、本页目录、代码高亮脚本和高亮主题资源。

也可以使用其他内容仓库路径：

```powershell
$env:CONTENT_DIR = "D:\path\to\python-notes-content"
$env:SITE_OUTPUT_DIR = "D:\path\to\output"
npm run build
```

## 自动同步与部署

网页仓库中的 `.github/workflows/sync-and-deploy.yml` 支持以下触发方式：

- `main` 分支的网页模板、脚本或构建配置发生变化。
- 手动执行 `workflow_dispatch`。
- 每 15 分钟定时执行一次。
- 内容仓库通过 `repository_dispatch` 发送 `content-updated` 事件。

工作流流程如下：

```text
拉取 python-notes-site
        ↓
拉取 python-notes-content
        ↓
npm ci
        ↓
Markdown → HTML
        ↓
页面结构校验
        ↓
提交 public/ 生成文件
        ↓
Wrangler 部署到 Cloudflare Pages
```

内容仓库中的 `.github/workflows/notify-site-sync.yml` 提供即时通知入口。配置 `SITE_REPO_DISPATCH_TOKEN` 后，Markdown 提交可以立即触发网页仓库同步；未配置时由网页仓库的 15 分钟定时任务完成同步。

## Cloudflare 配置

部署目标固定为：

```text
Cloudflare Pages 项目：python-notes
访问地址：https://python-notes.pages.dev
Account ID：56dda3bd89d39733f0810ec557ff72a5
```

网页仓库的 GitHub Actions 需要一个仓库 Secret：

```text
CLOUDFLARE_API_TOKEN
```

Token 只需要 `Pages Write` 和 `Pages Read` 权限，资源范围选择当前 Cloudflare 账户。不要把 Token 写进代码、提交到仓库或发送到聊天中。

Cloudflare 部署使用：

```powershell
npx wrangler@latest pages deploy public --project-name python-notes --branch main
```

现有 `python-notes` 是 Direct Upload 项目，因此由 GitHub Actions 使用 Wrangler 部署，而不是在 Cloudflare Pages 中重新创建或替换项目。

## 修改原则

- 修改 Markdown 正文：提交 `python-notes-content`。
- 修改网页布局、样式、代码高亮、目录交互或构建逻辑：提交 `python-notes-site`。
- 不要手动修改 `public/pages/` 中的生成 HTML。
- AI 或自动化同步只能更新生成内容，不能覆盖 `style.css`、`script.js`、MathJax 初始化和页面布局结构。
