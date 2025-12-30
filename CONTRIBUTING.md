# Contributing to Xfinds

First off, thank you for considering contributing to Xfinds! It's people like you that make Xfinds such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots)
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** if applicable
5. **Run the test suite**: `npm run test`
6. **Run linting**: `npm run lint`
7. **Run type checking**: `npm run type-check`
8. **Commit your changes** using conventional commits
9. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Getting Started

```bash
# Clone your fork
git clone https://github.com/your-username/xfinds.git
cd xfinds

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Project Structure

```
xfinds/
├── app/           # Next.js App Router
├── components/    # React components
├── lib/           # Utility functions
├── store/         # Zustand stores
├── data/          # JSON data files
├── messages/      # i18n translations
└── public/        # Static assets
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define proper types for all functions and components
- Avoid using `any` type
- Use interfaces for object shapes

```typescript
// Good
interface ProductProps {
  id: string;
  name: string;
  price: number;
}

function ProductCard({ id, name, price }: ProductProps) {
  // ...
}

// Avoid
function ProductCard(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Use `'use client'` directive only when necessary
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use the `cn()` utility for conditional classes
- Respect `prefers-reduced-motion` for animations

```typescript
import { cn } from '@/lib/utils'

function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        className
      )}
      {...props}
    />
  )
}
```

### Internationalization

- Never hardcode user-facing text
- Use `useTranslations` hook for client components
- Use `getTranslations` for server components
- Add translations to both `en.json` and `zh.json`

```typescript
import { useTranslations } from 'next-intl'

function Header() {
  const t = useTranslations('Header')
  
  return <h1>{t('title')}</h1>
}
```

### Git Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(search): add fuzzy search functionality
fix(cart): resolve item count display issue
docs(readme): update installation instructions
```

## Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉


