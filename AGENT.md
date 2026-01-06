# AI健康饮食与陕西传统文化融合应用

## 项目结构

```
/home/project/
├── src/
│   ├── components/                # 原子组件目录
│   │   └── ComponentName/
│   │       ├── index.tsx          # 组件实现
│   │       └── index.module.css   # 局部样式（推荐 CSS Modules）
│   ├── App.tsx                    # 主路由/布局容器
│   ├── main.tsx                   # 应用入口
│   ├── index.css                  # 全局样式（含 @tailwind 指令）
│   └── mock.json                  # 模拟数据
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
└── index.html                     # HTML 入口
└── AGENT.md                      # 相当项目的README文档，需要包含目录中每个文件的具体内容描述
```

## 文件内容描述

### package.json
项目依赖配置文件，包含React、React DOM、React Router DOM、Lucide React、Date-fns等核心依赖，以及Vite、TypeScript、Tailwind CSS等开发依赖。

### vite.config.ts
Vite配置文件，设置React插件并配置开发服务器允许任意Host访问。

### tsconfig.json
TypeScript编译配置，设置ES2020目标、JSX模式等。

### tsconfig.node.json
Node.js环境的TypeScript编译配置。

### postcss.config.js
PostCSS配置文件，集成Tailwind CSS和Autoprefixer。

### tailwind.config.js
Tailwind CSS主题配置，定义了浅青花蓝主色、淡赭石色辅助色、浅松绿对比色等符合陕西传统文化主题的配色方案。

### index.html
HTML入口文件，包含应用标题和根元素。

### src/main.tsx
应用入口文件，渲染App组件到DOM。

### src/App.tsx
主应用组件，实现AI健康饮食与陕西传统文化融合的核心功能，包括：
- 首页：展示应用概览和核心功能
- AI识食：拍照识别陕西非遗菜品
- 节气饮食：根据节气推荐传统食谱
- 文化传承：展示陕西非遗文化
- 个人中心：管理健康数据和饮食记录
- 数据库功能：实现今日饮食清单和健康报告的增删改查功能
- AI助手：提供关于陕西传统文化与健康饮食的对话服务

### AGENT.md
当前文件，包含项目结构和文件内容描述。