# MenuMichelle

Modern restaurant digital menu and QR code ordering platform built with Next.js 14, React 18, and TypeScript.

## Features

### Core Functionality
- **Digital Menu Display** - Clean, categorized menu with search and filtering
- **QR Code Ordering** - Table-specific QR codes for contactless ordering
- **Shopping Cart** - Full cart management with modifiers and special instructions
- **Order Tracking** - Real-time order status updates
- **Multi-language Support** - 10+ languages with RTL support

### Design (2026 Best Practices)
- **Liquid Glass UI** - Modern translucent design elements
- **Dark Mode** - Full dark theme support with system preference detection
- **Mobile-First** - Bottom navigation, gesture support, responsive design
- **Accessibility** - WCAG 2.1 AA compliant, screen reader support
- **Micro-animations** - Smooth transitions with Framer Motion

### Technical
- **Type-Safe** - Full TypeScript implementation
- **State Management** - Zustand with persistence
- **Design System** - Tailwind CSS with custom tokens
- **PWA Ready** - Manifest and offline support structure

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand 4.5
- **Animation:** Framer Motion 11
- **Icons:** Lucide React
- **QR Codes:** qrcode.react

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck

# Run tests
npm run test
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home/Menu page
│   ├── cart/              # Cart page
│   ├── orders/            # Orders page
│   └── profile/           # Profile/Settings page
├── components/
│   ├── ui/                # Base UI components
│   ├── menu/              # Menu-specific components
│   ├── cart/              # Cart components
│   ├── layout/            # Layout components
│   ├── navigation/        # Navigation components
│   ├── providers/         # Context providers
│   └── qr/                # QR code components
├── store/                 # Zustand stores
├── services/              # API service layer
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── i18n/                  # Internationalization
```

## Documentation

- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - 40 researched improvements (20 design + 20 features)
- **[AGENTS.md](./AGENTS.md)** - AI agent configuration and project guidelines
- **[agent.ini](./agent.ini)** - Quick reference configuration

## Design System

### Colors
- Primary: `#FF6B35` (Warm orange - appetite stimulating)
- Secondary: `#2E4057` (Deep blue - trust)
- Accent: `#48A9A6` (Fresh teal)

### Typography Scale
- Display: 48px/56px bold
- H1: 32px/40px bold
- H2: 24px/32px semibold
- Body: 16px/24px regular

### Spacing (4px base)
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px

## License

Private - All rights reserved

## Contributing

See [AGENTS.md](./AGENTS.md) for development guidelines.
