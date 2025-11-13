# Xfinds

A modern dark-themed product search and agent comparison web application, inspired by plug4.me and uufinds, built with Next.js, TypeScript, Tailwind, Framer Motion, and shadcn/ui. Features liquid glass aesthetics, smooth animations, and intelligent keyword search powered by Fuse.js.

## Features

- 🔍 **Smart Search**: Fuzzy search using Fuse.js with keyword, category, and agent filtering
- 🛍️ **Product Comparison**: Side-by-side comparison of offers from different agents
- 🛒 **Shopping Cart**: Save selected product offers and batch open agent links
- 👥 **Agent Directory**: Browse all partner agent service providers
- 📤 **Product Upload**: Upload new products in development mode (dev environment only)
- 🔐 **User Authentication**: Stub mode quick authentication system
- 🌐 **Multi-language Support**: Chinese (default) and English interface
- 🎨 **Liquid Glass Aesthetics**: Dark theme, frosted glass effects, micro-interaction animations

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Search**: Fuse.js
- **Internationalization**: next-intl

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables file:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` file and set required environment variables (see Environment Variables section below)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Xfinds/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   ├── shared/            # Shared components (Navbar, Footer, etc.)
│   ├── search/            # Search-related components
│   ├── product/           # Product-related components
│   └── ...
├── lib/                    # Utility functions and libraries
├── store/                  # Zustand state management
├── data/                   # JSON data files
├── docs/                   # Project documentation
│   ├── deployment/        # Deployment-related docs
│   └── troubleshooting/   # Troubleshooting docs
├── scripts/                # Script files
│   ├── deploy/            # Deployment scripts
│   └── process-images.ts  # Image processing script
├── public/                 # Static assets
├── DEPLOY.md              # Deployment guide (quick reference)
├── setup-https.sh         # HTTPS configuration script
└── nginx.conf             # Nginx configuration file
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type checking

## Deployment

For detailed deployment instructions, see the [`DEPLOY.md`](./DEPLOY.md) file.

Quick deployment:
1. Check [`DEPLOY.md`](./DEPLOY.md) for one-click deployment commands
2. For issues, see the [`docs/troubleshooting/`](./docs/troubleshooting/) directory

## Environment Variables

Create `.env.local` file and configure the following variables (refer to `.env.example`):

### Required Variables

- `JWT_SECRET` - JWT signing secret (must be at least 32 characters in production)
  - Development environment can use default value
  - Production environment must set a strong password: `openssl rand -base64 32`

### Optional Variables

- `NODE_ENV` - Environment mode (`development` | `production`), default `development`
- `AUTH_MODE` - Authentication mode, default `stub`
- `ADMIN_TOKEN` - Admin token (for admin API in production)
- `APP_URL` - Application URL (for email links), default `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` - Public application URL, default `http://localhost:3000`
- `EXCHANGE_RATE_API` - Exchange rate API endpoint, default uses free API

### Production Environment Notes

⚠️ **Important**: Before deploying to production, ensure:
1. `JWT_SECRET` is set to a strong password (at least 32 characters)
2. `NODE_ENV=production`
3. `ADMIN_TOKEN` is set (if using admin features)
4. All sensitive information is not hardcoded in the code

## License

MIT
