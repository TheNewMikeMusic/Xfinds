# Architecture Overview

## Project Structure

```
xfinds/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Home page
│   │   ├── search/        # Search page
│   │   ├── product/       # Product detail page
│   │   ├── cart/          # Shopping cart
│   │   ├── compare/       # Product comparison
│   │   ├── agents/        # Agent directory
│   │   ├── dashboard/     # User dashboard
│   │   └── auth/          # Authentication pages
│   └── api/               # API routes
│       ├── auth/          # Auth endpoints
│       ├── products/      # Product endpoints
│       └── agents/        # Agent endpoints
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── shared/           # Shared components
│   ├── search/           # Search-related components
│   ├── product/          # Product components
│   ├── cart/             # Cart components
│   └── home/             # Home page components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── data.ts           # Data fetching
│   ├── currency.ts       # Currency conversion
│   └── utils.ts          # General utilities
├── store/                 # Zustand state stores
│   ├── cart-store.ts     # Shopping cart state
│   ├── compare-store.ts  # Comparison state
│   └── currency-store.ts # Currency preferences
├── data/                  # JSON data files
│   ├── products.json     # Product catalog
│   ├── agents.json       # Agent information
│   └── categories.json   # Product categories
├── messages/              # i18n translations
│   ├── en.json           # English
│   └── zh.json           # Chinese
└── public/               # Static assets
    ├── images/           # Product images
    └── agents/           # Agent logos
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| State Management | Zustand |
| Search | Fuse.js (fuzzy search) |
| Internationalization | next-intl |
| Authentication | JWT (jose) |

## Key Features

### 1. Product Search
- Fuzzy search powered by Fuse.js
- Filter by category, agent, price range
- Sort by relevance, price, date

### 2. Agent Comparison
- Compare offers from different agents
- Side-by-side price comparison
- Agent ratings and reviews

### 3. Shopping Cart
- Save product offers
- Batch open agent links
- Persistent cart state

### 4. Multi-language Support
- English and Chinese interfaces
- URL-based locale routing
- Automatic language detection

### 5. Dark Theme
- Liquid glass aesthetic
- Frosted glass effects
- Smooth micro-animations

## Data Flow

```
User Action
    ↓
React Component
    ↓
Zustand Store (client state)
    ↓
API Route (if needed)
    ↓
Data Layer (JSON files)
    ↓
Response
    ↓
UI Update
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products |
| `/api/products/[id]` | GET | Get product details |
| `/api/agents` | GET | List agents |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/exchange-rates` | GET | Currency rates |

## State Management

### Client State (Zustand)
- Cart items
- Comparison list
- Currency preference
- Theme settings

### Server State
- Product data
- Agent data
- User sessions

## Styling Conventions

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use CSS variables for theme colors
- Implement `prefers-reduced-motion` support

