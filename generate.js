const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// 配置
const SOURCE_DIR = '/root/.openclaw/workspace/memory/leetcode';
const OUTPUT_DIR = '/root/.openclaw/workspace/leetcode-reports-static';

// 题目名称映射
const problemNames = {
  1: '两数之和', 3: '无重复字符最长子串', 4: '寻找两个正序数组的中位数',
  11: '盛最多水的容器', 15: '三数之和', 23: '合并K个升序链表',
  33: '搜索旋转排序数组', 46: '全排列', 48: '旋转矩阵',
  53: '最大子数组和', 55: '跳跃游戏', 56: '合并区间',
  76: '最小覆盖子串', 94: '二叉树中序遍历', 102: '二叉树层序遍历',
  141: '环形链表', 198: '打家劫舍', 199: '二叉树右视图',
  200: '岛屿数量', 206: '反转链表', 207: '课程表',
  208: '实现Trie前缀树', 215: '数组中的第K个最大元素',
  300: '最长递增子序列', 338: '比特位计数'
};

function getProblemName(num) {
  return problemNames[num] || `题目 ${num}`;
}

// HTML 模板
const pageTemplate = (title, content, backLink = true) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | LeetCode 每日精讲</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
      background: #f5f5f5;
      line-height: 1.6;
      color: #333;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .header h1 { font-size: 24px; }
    .header a { color: white; text-decoration: none; }
    .content {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .back-link {
      display: inline-block;
      color: #667eea;
      text-decoration: none;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .back-link:hover { text-decoration: underline; }
    
    /* Markdown styles */
    .markdown-body h1 { font-size: 28px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
    .markdown-body h2 { font-size: 22px; margin: 30px 0 15px; color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .markdown-body h3 { font-size: 18px; margin: 20px 0 10px; color: #555; }
    .markdown-body p { margin: 15px 0; }
    .markdown-body code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 14px;
      color: #e83e8c;
    }
    .markdown-body pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 15px 0;
    }
    .markdown-body pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: 13px;
    }
    .markdown-body ul, .markdown-body ol { margin: 15px 0; padding-left: 25px; }
    .markdown-body li { margin: 6px 0; }
    .markdown-body blockquote {
      border-left: 4px solid #667eea;
      padding: 12px 15px;
      margin: 15px 0;
      color: #666;
      background: #f8f8ff;
      border-radius: 0 8px 8px 0;
    }
    .markdown-body table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .markdown-body th, .markdown-body td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    .markdown-body th { background: #f5f5f5; }
    .markdown-body tr:nth-child(even) { background: #fafafa; }
    
    /* Home page styles */
    .stats { display: flex; justify-content: center; gap: 40px; margin-top: 15px; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; }
    .stat-label { font-size: 13px; opacity: 0.9; }
    .report-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .report-card {
      background: white;
      border-radius: 10px;
      padding: 18px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .report-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    .report-number {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .report-title { font-size: 16px; font-weight: 600; margin-bottom: 5px; }
    .report-date { font-size: 12px; color: #999; }
    
    @media (max-width: 768px) {
      .content { padding: 20px; }
      .markdown-body h1 { font-size: 22px; }
      .markdown-body h2 { font-size: 18px; }
      .report-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  ${backLink ? `
  <div class="container">
    <div class="header">
      <h1><a href="./">🎯 LeetCode 每日精讲</a></h1>
    </div>
    <a href="./" class="back-link">← 返回报告列表</a>
    <div class="content markdown-body">
      ${content}
    </div>
  </div>
  ` : `
  <div class="container">
    ${content}
  </div>
  `}
</body>
</html>`;

// 生成主页
function generateHomePage(reports) {
  const uniqueProblems = new Set(reports.map(r => r.number)).size;
  
  const content = `
    <div class="header">
      <h1>🎯 LeetCode 每日精讲</h1>
      <p style="margin-top:8px;opacity:0.9;">每天一道算法题，深入理解核心考点</p>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${reports.length}</div>
          <div class="stat-label">篇报告</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${uniqueProblems}</div>
          <div class="stat-label">道题目</div>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="report-grid">
        ${reports.map(r => `
          <a href="${r.id}/" class="report-card">
            <span class="report-number">#${r.number}</span>
            <div class="report-title">${r.title}</div>
            <div class="report-date">${r.date}</div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
  
  return pageTemplate('首页', content, false);
}

// 主函数
function generate() {
  console.log('🚀 开始生成静态网站...\n');
  
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 读取所有报告
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();
  
  const reports = [];
  
  files.forEach(file => {
    const match = file.match(/(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{1,3})\.md$/);
    if (!match) return;
    
    const [_, year, month, day, hour, minute, numStr] = match;
    const number = parseInt(numStr);
    const date = `${year}-${month}-${day} ${hour}:${minute}`;
    const id = `report-${number}-${year}${month}${day}`;
    
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
    const title = getProblemName(number);
    
    reports.push({ id, number, title, date, content });
    
    // 生成详情页
    const html = marked.parse(content);
    const page = pageTemplate(`#${number} ${title}`, html);
    
    const reportDir = path.join(OUTPUT_DIR, id);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(reportDir, 'index.html'), page);
    console.log(`✅ 生成: ${id}/ - #${number} ${title}`);
  });
  
  // 生成首页
  const homePage = generateHomePage(reports);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), homePage);
  console.log(`\n✅ 首页生成完成`);
  
  console.log(`\n📊 统计: ${reports.length} 篇报告, ${new Set(reports.map(r => r.number)).size} 道题目`);
  console.log(`\n📁 输出目录: ${OUTPUT_DIR}`);
  console.log('\n🎉 生成完成！');
}

generate();
