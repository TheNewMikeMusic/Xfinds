# Xfinds

<div align="center">
  <p><strong>Professional Cross-Border Shopping Agent Aggregator & Comparison Platform</strong></p>
  <p><strong>企业级跨境购物代理聚合与全球比价系统</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" /></a>
  </p>

  <p>
    <a href="https://xfinds.cc">Live Demo | 官方演示</a> •
    <a href="https://github.com/TheNewMikeMusic/Xfinds/issues">Report Bug | 反馈问题</a> •
    <a href="https://github.com/TheNewMikeMusic/Xfinds/milestones">Roadmap | 发展路线</a>
  </p>
</div>

---

### 📖 Introduction | 项目简介

**Xfinds** is a high-performance, open-source aggregator designed for the global e-commerce ecosystem. It provides a unified interface for real-time price comparison, logistics estimation, and smart cart optimization across multiple shipping agents (Kakobuy, Mulebuy, TigBuy, etc.). Built with a focus on scalability and modern aesthetics (Glassmorphism), Xfinds empowers users to make data-driven cross-border purchasing decisions.

**Xfinds** 是一款专为全球跨境电商生态设计的高性能、开源聚合平台。它通过统一的标准化接口，实现了多家货运代理商（如 Kakobuy, Mulebuy, TigBuy 等）的实时价格对比、物流费用估算及智能购物车优化。项目核心关注可扩展性与现代感十足的“毛玻璃”视觉语言，致力于为用户提供数据驱动的跨境购物决策支持。

---

### 📸 System Showcase | 系统演示

<div align="center">
  <p><em>Homepage - Dark Mode | 首页 - 夜间模式</em></p>
  <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_110255_958.png" alt="Xfinds Banner" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" />
</div>

<br/>

| **Product Grid (Light Mode) | 首页网格（日间）** | **Product Details | 商品详情与变体** |
| :--- | :--- |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124517_559.png" width="100%" style="border-radius: 4px;" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_114122_459.png" width="100%" style="border-radius: 4px;" /> |
| _Modern clean layout for product discovery._ | _Comprehensive variant & media management._ |

| **Agent Comparison | 代理商价格比对** | **Cart Checkout | 购物车结算** |
| :--- | :--- |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124445_841.png" width="100%" style="border-radius: 4px;" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124531_340.png" width="100%" style="border-radius: 4px;" /> |
| _Side-by-side agent price & fee analysis._ | _Optimized multi-agent checkout flow._ |

---

### 🚀 Core Capabilities | 核心特性

*   **⚡ Multi-Agent Engine | 多代理比价引擎**
    *   Sub-second price calculation for 6+ major shipping agents.
    *   实时整合 6+ 主流货运代理数据，实现毫秒级价格计算。
*   **🔍 Enterprise Search | 企业级模糊搜索**
    *   Advanced fuzzy matching powered by Fuse.js with category filtering.
    *   基于 Fuse.js 的高阶模糊匹配，支持多维度分类筛选。
*   **💱 Financial Engine | 实时金融引擎**
    *   Real-time multi-currency conversion (CNY/USD/EUR/JPY/GBP/KRW).
    *   对接实时汇率接口，支持全球主流货币自动换算。
*   **🌐 Internationalization | 深度国际化**
    *   Full English/Chinese support with URL-based locale routing.
    *   原生支持中英双语，基于路由的国际化架构。
*   **🎨 Optimized UI/UX | 极致交互体验**
    *   Responsive Glassmorphism design with seamless Dark/Light mode switching.
    *   响应式毛玻璃设计，支持深浅色模式无缝切换。

---

### 🛠️ Tech Stack | 技术选型

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14** | App Router, SSR, and optimized caching logic. |
| **Language** | **TypeScript** | Strict type safety for enterprise-scale development. |
| **Styling** | **Tailwind CSS** | Utility-first CSS with **Framer Motion** for animations. |
| **UI Library** | **shadcn/ui** | Accessible components built on **Radix UI** primitives. |
| **State** | **Zustand** | Lightweight and reactive client-side state management. |
| **Search** | **Fuse.js** | Client-side fuzzy search for instant results. |
| **Testing** | **Playwright** | Robust End-to-End testing for critical user flows. |

---

### 📂 Project Structure | 项目结构

```text
Xfinds/
├── app/                  # Next.js App Router (Routes, API, Layouts)
│   ├── [locale]/         # I18n routed pages (Home, Search, Product, Cart)
│   └── api/              # Standardized Backend API Endpoints
├── components/           # React Component Library (Atomic Design)
│   ├── ui/               # Base Primitives (shadcn/ui)
│   └── shared/           # Reusable Business Components
├── lib/                  # Core Business Logic, Utils & Infrastructure
├── store/                # Global State Management (Zustand Stores)
├── messages/             # I18n Localization Dictionaries (JSON)
├── data/                 # Static Knowledge Base & Mock Data
└── public/               # Optimized Static Assets (Images, Icons)
```

---

### 📦 Quick Start | 快速开始

1.  **Clone the repository | 克隆仓库**
    ```bash
    git clone https://github.com/TheNewMikeMusic/Xfinds.git
    cd Xfinds
    ```
2.  **Install dependencies | 安装依赖**
    ```bash
    npm install
    ```
3.  **Environment Setup | 环境配置**
    ```bash
    cp .env.example .env.local # Configure your environment variables
    ```
4.  **Development | 启动开发**
    ```bash
    npm run dev
    ```

---

### 📄 License | 开源协议

Distributed under the **MIT License**. See `LICENSE` for more information.
本项目基于 **MIT License** 协议开源。详情请参阅 `LICENSE` 文件。

<div align="center">
  <p>Built with Precision for the Global Shopping Community</p>
  <p>为全球购物社区精准打造</p>
</div>
