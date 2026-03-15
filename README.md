# LeetCode 每日精讲 - 静态网站

📚 每日 LeetCode 算法题目精讲报告网站

## 在线预览

本地预览：
```bash
cd /root/.openclaw/workspace/leetcode-reports-static
python3 -m http.server 8888
```

然后访问 http://localhost:8888

## 部署到 Vercel

### 方式一：Vercel CLI（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **进入项目目录**
   ```bash
   cd /root/.openclaw/workspace/leetcode-reports-static
   ```

3. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

4. **获得网址**
   部署成功后，会显示类似 `https://leetcode-reports-xxxxx.vercel.app` 的网址

### 方式二：GitHub + Vercel

1. **创建 GitHub 仓库并推送代码**
   ```bash
   cd /root/.openclaw/workspace/leetcode-reports-static
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/leetcode-reports.git
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 导入你的 GitHub 仓库
   - 选择 Framework Preset: **Other**（纯静态网站）
   - 点击 Deploy

### 方式三：Vercel 网站直接上传

1. 访问 https://vercel.com/new
2. 点击 "Upload" 按钮
3. 选择 `leetcode-reports-static` 文件夹
4. 点击 Deploy

## 更新报告

当有新报告生成时，重新运行生成脚本：

```bash
cd /root/.openclaw/workspace/leetcode-reports-static
node generate.js
```

然后重新部署到 Vercel。

## 项目结构

```
leetcode-reports-static/
├── index.html              # 首页
├── report-141-20260315/    # 各报告详情页
│   └── index.html
├── report-198-20260315/
│   └── index.html
├── ...
├── generate.js             # 生成脚本
├── vercel.json             # Vercel 配置
└── package.json            # 依赖
```

## 技术栈

- 纯静态 HTML/CSS
- Node.js + Marked (生成脚本)
- Vercel (托管)

## 功能特性

✅ 响应式设计，支持移动端
✅ Markdown 完整渲染
✅ 代码块语法高亮
✅ 无需服务器，纯静态托管
✅ 秒级加载速度

---

部署后你将获得一个类似 `https://leetcode-reports-xxxx.vercel.app` 的网址，可以直接分享给他人查看！
