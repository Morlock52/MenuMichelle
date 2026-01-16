# MenuMichelle - AI Agent Configuration

> **Note:** This AGENTS.md file follows 2026 best practices and is compatible with Claude Code, GitHub Copilot, Cursor, Codex, and other AI coding assistants.
>
> Research shows projects with detailed AGENTS.md average 35-55% fewer agent-generated bugs and reduce AI session setup time from 20-40 minutes to under 2 minutes.

---

## Project Overview

**MenuMichelle** is a modern restaurant digital menu and ordering system designed for the 2026 hospitality industry. The project focuses on QR code ordering, contactless payments, and exceptional user experience.

### Tech Stack (Recommended)
- **Frontend:** React 18+ with TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **State:** Zustand or React Context
- **Backend:** Node.js/Express or Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Real-time:** WebSocket (Socket.io)
- **Payments:** Stripe SDK
- **Mobile:** React Native or PWA

---

## Project Structure

```
MenuMichelle/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── menu/          # Menu display components
│   │   ├── cart/          # Shopping cart components
│   │   ├── order/         # Order management
│   │   └── ui/            # Base UI elements (buttons, inputs, etc.)
│   ├── pages/             # Route pages
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external service integrations
│   ├── store/             # State management
│   ├── utils/             # Helper functions
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles and design tokens
├── public/                # Static assets
├── api/                   # Backend API routes
├── prisma/                # Database schema and migrations
├── tests/                 # Test files
└── docs/                  # Documentation
```

---

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:watch   # Watch mode for tests
```

### Code Quality
```bash
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
npm run format       # Prettier formatting
npm run typecheck    # TypeScript type checking
```

### Database
```bash
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open database GUI
```

---

## Code Style Guidelines

### DO
- Use TypeScript strict mode
- Follow React functional component patterns with hooks
- Use descriptive variable and function names
- Write unit tests for business logic
- Use Tailwind utility classes for styling
- Implement proper error boundaries
- Follow accessibility (WCAG 2.1 AA) standards
- Use semantic HTML elements

### DO NOT
- Use `any` type in TypeScript (use `unknown` if needed)
- Create deeply nested component hierarchies (max 3 levels)
- Put business logic in components (use hooks/services)
- Use inline styles (use Tailwind classes)
- Skip error handling for API calls
- Ignore TypeScript errors with `@ts-ignore`
- Use deprecated React patterns (class components, etc.)

---

## Key Features to Implement

Based on [IMPROVEMENTS.md](./IMPROVEMENTS.md), prioritize:

### Phase 1: Core Menu System
1. QR code generation and scanning
2. Menu display with categories
3. Item detail views with modifiers
4. Shopping cart functionality

### Phase 2: Ordering & Payments
5. Order submission system
6. Stripe payment integration
7. Order tracking (real-time)
8. Order history

### Phase 3: Advanced Features
9. Multi-language support (i18n)
10. Dark mode toggle
11. AI-powered recommendations
12. Analytics dashboard

---

## Design System

### Colors (CSS Variables)
```css
--color-primary: #FF6B35;      /* Warm orange - appetite stimulating */
--color-secondary: #2E4057;    /* Deep blue - trust */
--color-accent: #48A9A6;       /* Teal - fresh */
--color-background: #FAFAFA;   /* Light neutral */
--color-surface: #FFFFFF;      /* Cards, modals */
--color-text: #1A1A1A;         /* Primary text */
--color-text-muted: #6B7280;   /* Secondary text */
--color-success: #10B981;      /* Confirmations */
--color-warning: #F59E0B;      /* Alerts */
--color-error: #EF4444;        /* Errors */
```

### Typography Scale
- Display: 48px/56px bold
- H1: 32px/40px bold
- H2: 24px/32px semibold
- H3: 20px/28px semibold
- Body: 16px/24px regular
- Caption: 14px/20px regular
- Small: 12px/16px regular

### Spacing Scale (4px base)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

---

## API Patterns

### REST Endpoints
```
GET    /api/menu                    # List all menu items
GET    /api/menu/:id                # Get single item
GET    /api/categories              # List categories
POST   /api/orders                  # Create order
GET    /api/orders/:id              # Get order status
PATCH  /api/orders/:id              # Update order
GET    /api/tables/:tableId/session # Get table session
```

### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

---

## Testing Requirements

- **Unit Tests:** All utility functions and hooks
- **Component Tests:** Critical UI components with React Testing Library
- **Integration Tests:** API endpoints with supertest
- **E2E Tests:** Core user flows with Playwright/Cypress

Minimum coverage targets:
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

---

## Security Considerations

- Sanitize all user inputs
- Use parameterized database queries (Prisma handles this)
- Implement rate limiting on API endpoints
- Validate payment webhooks with Stripe signatures
- Use HTTPS only in production
- Implement proper CORS policies
- Never expose sensitive env variables to client

---

## Environment Variables

```bash
# Required
DATABASE_URL=            # PostgreSQL connection string
STRIPE_SECRET_KEY=       # Stripe API key
STRIPE_WEBHOOK_SECRET=   # Stripe webhook signature

# Optional
NEXT_PUBLIC_API_URL=     # API base URL
NEXT_PUBLIC_WS_URL=      # WebSocket URL
SENTRY_DSN=              # Error tracking
ANALYTICS_ID=            # Analytics tracking
```

---

## Agent Instructions

When working on this codebase:

1. **Read IMPROVEMENTS.md first** - Contains 40 researched improvements for design and functionality
2. **Follow the design system** - Maintain visual consistency
3. **Prioritize accessibility** - 15%+ users have disabilities
4. **Test your changes** - Run tests before committing
5. **Keep components small** - Single responsibility principle
6. **Document complex logic** - Add comments where non-obvious
7. **Use TypeScript properly** - Leverage type safety

---

*Configuration based on January 2026 industry research and AI agent best practices*
