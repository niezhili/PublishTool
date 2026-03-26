# 文章润色与封面生成工具

一个帮助内容创作者完成「文章润色 → AI 封面生成 → 文件导出」完整工作流的 Web 应用，基于字节跳动豆包大模型（文本 + 图像）。

## 功能特性

- **文章润色**：粘贴或拖拽上传 Markdown 文件，填写润色要求，一键调用豆包文本模型润色
- **双栏对比**：初稿与润色结果左右分屏展示，两侧均支持实时编辑
- **AI 封面生成**：基于润色后的文章内容，自动生成 4 张封面候选图，支持自定义 Prompt
- **灵活导出**：润色文章导出为 Markdown 文件（支持自定义文件名）；封面图片支持单张下载

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 样式 | Tailwind CSS v4 |
| 状态管理 | Zustand |
| HTTP 客户端 | Axios |
| 打包工具 | Vite 8 |
| AI 模型 | 字节豆包文本模型 + 豆包图像生成模型 |

## 快速开始

### 前置要求

- Node.js >= 18
- 豆包 API Key（[火山引擎控制台](https://console.volcengine.com/) 申请）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/PublishTool.git
cd PublishTool

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的豆包 API Key 和端点

# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
npm run build
npm run preview
```

## 环境变量说明

复制 `.env.example` 为 `.env` 并填入以下配置：

| 变量名 | 说明 |
|--------|------|
| `VITE_TEXT_POLISH_API_URL` | 豆包文本润色 API 端点 |
| `VITE_TEXT_POLISH_API_KEY` | 文本模型 API 密钥 |
| `VITE_IMAGE_GEN_API_URL` | 豆包图像生成 API 端点 |
| `VITE_IMAGE_GEN_API_KEY` | 图像模型 API 密钥 |
| `VITE_TEXT_MODEL_NAME` | 文本模型名称（如 `doubao-pro`） |
| `VITE_IMAGE_MODEL_NAME` | 图像模型名称 |
| `VITE_TEMPERATURE` | 文本生成温度（0~1，默认 0.7） |
| `VITE_TOP_P` | 文本生成 top_p（默认 0.9） |

> **安全提示**：`.env` 已被 `.gitignore` 排除，请勿将真实密钥提交到代码仓库。

## 使用流程

1. **输入初稿** — 在左侧文本框粘贴文章，或直接拖拽 `.md` 文件到输入区
2. **填写润色要求**（可选）— 如"保持口语化风格"、"面向技术读者"
3. **点击「润色」** — 右侧实时展示润色结果，支持继续手动编辑
4. **点击「生成封面」** — 输入/修改 Prompt，生成 4 张 AI 封面图
5. **导出** — 下载润色后的 Markdown 文件，或单独保存封面图片

## 项目结构

```
src/
├── components/
│   ├── Editor/          # 编辑器、文件拖拽、对比视图
│   ├── ImageGallery/    # 封面图片展示组件
│   ├── PromptEditor/    # Prompt 输入组件
│   └── Toolbar/         # 工具栏组件
├── hooks/
│   ├── useTextPolish.ts     # 文本润色 API 逻辑
│   └── useImageGeneration.ts # 图像生成 API 逻辑
├── pages/
│   └── Polish.tsx       # 核心页面
├── services/
│   └── doubleAPI.ts     # 豆包 API 封装
├── store/
│   └── appStore.ts      # Zustand 全局状态
├── types/
│   └── index.ts         # TypeScript 类型定义
└── utils/
    └── fileDownload.ts  # 文件/图片下载工具
```

## License

ISC
