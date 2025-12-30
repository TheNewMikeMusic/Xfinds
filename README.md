<div align="center">

# 🌐 Xfinds

### Cross-Border Freight Comparison Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A modern, open-source platform for comparing shipping rates across multiple cross-border freight agents.**

[Live Demo](https://xfinds.cc) · [Report Bug](https://github.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison/issues) · [Request Feature](https://github.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison/issues)

</div>

---

## ✨ Features

### 🔍 Smart Product Search
- **Fuzzy Search** - Find products even with typos or partial names using Fuse.js
- **Advanced Filters** - Filter by category, price range, agent, and more
- **Real-time Results** - Instant search results as you type

### 💰 Price Comparison Engine
- **Multi-Agent Support** - Compare prices across 6+ shipping agents
- **Currency Conversion** - Real-time exchange rates for CNY, USD, EUR, GBP, JPY, KRW
- **Total Cost Calculator** - See the full cost including shipping and fees

### 🛒 Shopping Cart Management
- **Multi-Agent Cart** - Add products from different agents in one cart
- **Cart Optimization** - AI-powered suggestions to optimize your shipping costs
- **Save for Later** - Bookmark products for future purchases

### 📊 Agent Comparison
- **Side-by-Side View** - Compare up to 4 agents at once
- **Service Ratings** - See reliability scores and user reviews
- **Shipping Methods** - Compare delivery times and shipping options

### 🌐 Internationalization
- **Multi-language** - Full support for English and Chinese
- **Locale-aware** - Currency and date formatting based on user location

### 🎨 Modern UI/UX
- **Glassmorphic Design** - Beautiful frosted glass effects
- **Dark/Light Theme** - Automatic and manual theme switching
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Smooth Animations** - Delightful micro-interactions with Framer Motion

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.4 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | Radix UI, shadcn/ui |
| **State Management** | Zustand |
| **Search** | Fuse.js |
| **Animations** | Framer Motion |
| **i18n** | next-intl |
| **Image Processing** | Sharp |
| **Testing** | Vitest, Playwright |
| **Auth** | JWT (jose), bcryptjs |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0+ or **yarn** 1.22+

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison.git
cd xfinds-cross-border-freight-comparison
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
xfinds/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Internationalized routes
│   │   ├── page.tsx          # Homepage
│   │   ├── search/           # Search results page
│   │   ├── product/          # Product details
│   │   ├── cart/             # Shopping cart
│   │   ├── compare/          # Agent comparison
│   │   ├── agents/           # Agent listings
│   │   ├── dashboard/        # User dashboard
│   │   └── auth/             # Authentication pages
│   └── api/                  # API routes
├── components/               # React components
│   ├── ui/                   # Base UI components (shadcn)
│   ├── shared/               # Shared components
│   └── ...                   # Feature-specific components
├── lib/                      # Utility functions
├── store/                    # Zustand stores
├── messages/                 # i18n translations
├── data/                     # Static JSON data
├── public/                   # Static assets
└── tests/                    # Test files
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

---

## 🌍 Supported Agents

| Agent | Status | Features |
|-------|--------|----------|
| KakoBuy | ✅ Active | Full integration |
| MuleBuy | ✅ Active | Full integration |
| TigBuy | ✅ Active | Full integration |
| HippoBuy | ✅ Active | Full integration |
| EastMallBuy | ✅ Active | Full integration |
| RizzitGo | ✅ Active | Full integration |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Website**: [xfinds.cc](https://xfinds.cc)
- **Issues**: [GitHub Issues](https://github.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the Xfinds Team

</div>
