# Xfinds

<div align="center">

**Professional Cross-Border Shopping Agent Aggregator & Comparison Platform**
**企业级跨境购物代理聚合与全球比价系统**

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Official Demo | 官方演示](https://xfinds.cc) · [Issue Tracker | 问题反馈](https://github.com/TheNewMikeMusic/Xfinds/issues) · [Roadmap | 发展路线](https://github.com/TheNewMikeMusic/Xfinds/milestones)

---

Xfinds is a high-performance, open-source aggregator designed for the global e-commerce ecosystem. It provides a unified interface for real-time price comparison, logistics estimation, and smart cart optimization across multiple shipping agents (Kakobuy, Mulebuy, TigBuy, etc.). Built with a focus on scalability, accessibility, and modern aesthetics (Glassmorphism), Xfinds empowers users to make data-driven cross-border purchasing decisions.

Xfinds 是一款专为全球跨境电商生态设计的高性能、开源聚合平台。它通过统一的标准化接口，实现了多家货运代理商（如 Kakobuy, Mulebuy, TigBuy 等）的实时价格对比、物流费用估算及智能购物车优化。项目核心关注可扩展性、无障碍体验及现代感十足的“毛玻璃”视觉语言，致力于为用户提供数据驱动的跨境购物决策支持。

</div>

---

## 🏗️ Architectural Excellence | 架构愿景

### Design Philosophy | 设计理念
- **Glassmorphic UI**: High-end frosted glass aesthetics with smooth micro-interactions powered by Framer Motion.  
  **毛玻璃视觉语言**：基于高质量磨砂玻璃美学，辅以 Framer Motion 实现的细腻微交互。
- **Modular Design**: A component-based architecture using Radix UI primitives for maximum reusability.  
  **模块化设计**：基于 Radix UI 原语构建的组件化架构，确保高度可复用性。
- **User-Centric**: Seamless transition between dark/light themes and full mobile responsiveness.  
  **以用户为中心**：深浅色主题平滑切换，深度适配全端移动响应式需求。

---

## 📸 System Showcase | 系统演示

<div align="center">
  <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_110255_958.png" alt="Xfinds Banner" width="100%" style="border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
</div>

<br/>

| **High-Precision Search | 高精度搜索** | **Rich Variant Selector | 变体选择器** |
| :---: | :---: |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124517_559.png" width="100%" style="border-radius: 8px;" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_114122_459.png" width="100%" style="border-radius: 8px;" /> |
| _Fuzzy Matching & Filtering_ | _SKU & Media Gallery Management_ |

| **Comparative Analysis | 竞价分析** | **Optimized Checkout | 结算优化** |
| :---: | :---: |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124445_841.png" width="100%" style="border-radius: 8px;" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124531_340.png" width="100%" style="border-radius: 8px;" /> |
| _Real-time Price Engine_ | _Smart Cart Logic_ |

---

## 🚀 Core Capabilities | 核心功能

- **🚀 Multi-Agent Intelligence**: Standardized data mapping for 6+ major shipping agents with sub-second price calculation.  
  **多代理智能路由**：标准化整合 6+ 主流代理数据，实现毫秒级比价计算。
- **🔍 Enterprise Fuzzy Search**: Advanced search capabilities powered by Fuse.js with customizable weights and relevance ranking.  
  **企业级模糊搜索**：基于 Fuse.js 的高阶搜索，支持自定义权重分配与相关性排序。
- **💱 Real-time Financial Engine**: Integration with global exchange rate APIs for accurate CNY/USD/EUR/JPY conversions.  
  **实时金融引擎**：对接全球汇率 API，提供极度精准的多币种实时换算。
- **🌐 Internationalization (i18n)**: Fully localized experience in English and Chinese with RTL support considerations.  
  **国际化深度适配**：中英全界面深度汉化，具备良好的本地化扩展性。
- **⚡ Performance Optimized**: Zero-layout shift (CLS) focus, optimized image delivery via Sharp, and App Router caching.  
  **极致性能优化**：关注零布局抖动（CLS），采用 Sharp 图像预处理与 App Router 级缓存。

---

## 🛠️ Tech Stack | 技术选型

| Stack | Technology | Reason |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14** | Server-side rendering (SSR) & optimized routing. |
| **Language** | **TypeScript** | Type-safety & enterprise scalability. |
| **Styling** | **Tailwind CSS** | Atomic CSS approach for rapid UI development. |
| **Motion** | **Framer Motion** | Industry-standard declarative animations. |
| **Components** | **shadcn/ui** | Accessible, unstyled components based on Radix UI. |
| **State** | **Zustand** | Lightweight, reactive client-side state management. |
| **Testing** | **Playwright** | Robust end-to-end testing for critical user flows. |

---

## 📦 Getting Started | 快速开始

### Environment | 环境要求
- **Runtime**: Node.js 18.x or 20.x (LTS recommended)
- **Package Manager**: npm 9+ or pnpm 8+

### Setup | 安装部署
1. **Repository Cloning**
   ```bash
   git clone https://github.com/TheNewMikeMusic/Xfinds.git
   ```
2. **Dependency Installation**
   ```bash
   npm install
   ```
3. **Environment Configuration**
   ```bash
   cp .env.example .env.local # Update your API keys here
   ```
4. **Development Execution**
   ```bash
   npm run dev
   ```

---

## 📂 Engineering Excellence | 项目结构

```text
Xfinds/
├── app/                  # Enterprise App Router Architecture
│   ├── [locale]/         # I18n Content Sub-trees
│   └── api/              # Standardized RESTful Endpoints
├── components/           # Atomic Design Component Library
│   ├── ui/               # Low-level Primitives (shadcn/ui)
│   └── shared/           # High-level Composite Components
├── lib/                  # Core Business Logic & Infrastructure
├── store/                # Global State Orchestration (Zustand)
├── messages/             # Localization Dictionary (JSON)
├── data/                 # Static Knowledge Base (JSON)
└── public/               # Optimized Static Assets
```

---

## 🤝 Community & Support | 参与贡献

We follow the **Standard Open Source Workflow**. Contributions of all sizes are welcome.  
我们遵循**标准开源开发流**，欢迎任何形式的贡献。

- 💬 **Join the Discussion**: Use [GitHub Discussions](https://github.com/TheNewMikeMusic/Xfinds/discussions) for questions.
- 🐛 **Report Issues**: Found a bug? Let us know via the [Issue Tracker](https://github.com/TheNewMikeMusic/Xfinds/issues).
- 🌟 **Star Support**: If you find Xfinds valuable, please give us a star to support the development!

---

## 📄 License | 开源协议

Distributed under the **MIT License**. See `LICENSE` for more information.  
基于 **MIT License** 协议授权。更多信息请参阅 `LICENSE` 文件。

---

<div align="center">

**Built with Precision for the Global Shopping Community**
**为全球购物社区精准打造**

[<img src="https://img.shields.io/badge/Follow-Xfinds-1DA1F2?style=for-the-badge&logo=twitter" />](https://x.com/xfinds)

</div>
