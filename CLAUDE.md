# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Conekta** is a marketplace platform that connects gas stations (postos) to specialized service providers (fornecedores). The system enables service discovery, procurement, and payments.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Firebase Auth (email/password + Google OAuth)
- **Database**: Firebase Firestore
- **Payments**: Conekta API (Mexican payment processor)
- **Fonts**: Outfit (display), Montserrat (body)
- **Icons**: lucide-react only (never use emojis)

## Development Commands

```bash
# Development server
npm run dev              # Runs on http://localhost:3000

# Production build
npm run build            # Creates static export for Firebase Hosting
npm start                # Serves production build locally
```

Note: Production builds use static export (`output: "export"`) for Firebase Hosting deployment. Development mode runs without this restriction.

## Architecture

### Route Groups

The app uses Next.js route groups for layout organization:

- **`(auth)/`** - Authentication pages (login, cadastro, recuperar-senha)
  - Shared auth layout at `app/(auth)/layout.tsx`
  - Multi-step registration with role selection (posto/fornecedor)

- **`(dashboard)/`** - Protected dashboard pages (home, shop, sos, conekta-pay, solicitacoes)
  - Shared dashboard layout with sidebar at `app/(dashboard)/layout.tsx`
  - Protected by authentication checks

- **Public routes** - Landing page, marketplace, service info pages (conheca/, seja-fornecedor, chat)

### Authentication Flow

Firebase Authentication is wrapped in a custom AuthProvider:

1. **Provider Setup**: `app/providers.tsx` wraps React Query and AuthProvider
2. **Auth Hook**: `lib/hooks/useAuth.ts` manages auth state and profile loading
3. **User Roles**: Users have one of three roles: `posto`, `fornecedor`, or `admin`
4. **User Profile**: Stored in Firestore `users/{uid}` collection with:
   - `displayName`, `email`, `role`
   - `conektaCustomerId` (linked payment account)
   - `createdAt`, `updatedAt` timestamps

Access auth state via `useAuthContext()` from any component.

### Payment Integration

Conekta integration via `lib/conekta/client.ts`:

- Creates/manages customers linked to Firebase users
- Supports card, OXXO cash, and SPEI payments
- Customer IDs stored in user profiles (`conektaCustomerId`)
- Uses server-side private key for API calls

### Data Patterns

- **React Query** for all async operations (use `useQuery`, `useMutation`)
- **Custom Hooks** in `lib/hooks/` for reusable logic (useAuth, useConekta, useSpeechRecognition)
- **Service Layer** in `lib/data/services.ts` for mock/static data
- **Firebase Utilities** in `lib/firebase/` for auth and config

## Design System

### Brand Colors (Tailwind)

```typescript
purple: {
  DEFAULT: '#623996',  // Primary brand color
  medium: '#913E97',
  light: '#BE85BB',
  glow: 'rgba(98, 57, 150, 0.15)'
}
```

Use `text-purple`, `bg-purple`, `border-purple` for brand elements.

### Typography

- **Display Text**: `font-display` (Outfit) - headings, hero text
- **Body Text**: `font-body` (Montserrat) - paragraphs, UI

### Component Patterns

- UI components in `components/ui/` (wavy-background, text-loop)
- Feature components organized by domain (auth/, marketplace/, chat/, payment/)
- Icons exclusively from `lucide-react` - never use emojis

## Environment Variables

Required variables (see `.env.example`):

```bash
# Firebase (all required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Conekta Payments (required)
CONEKTA_PRIVATE_KEY=
NEXT_PUBLIC_CONEKTA_PUBLIC_KEY=

# Optional: AI Chat (Claude or OpenAI)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

## Key Files to Reference

- **Next.js Config**: `next.config.ts` - static export configuration
- **Auth Logic**: `lib/firebase/auth.ts` - signUp, signIn, signInWithGoogle, getUserProfile
- **Type Definitions**: Check component props and Firebase types in respective files
- **Route Protection**: Components use `ProtectedRoute` wrapper from `components/auth/ProtectedRoute.tsx`

## Next.js Version Notes

This project uses Next.js 16 which may have breaking changes from earlier versions. When working with Next.js APIs:

1. Check `node_modules/next/dist/docs/` for current documentation
2. Heed deprecation warnings in the console
3. Use App Router conventions (not Pages Router)

@AGENTS.md
