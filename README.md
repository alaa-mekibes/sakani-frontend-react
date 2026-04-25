# 🏠 Sakani — Frontend

> Client application for **Sakani**, an Algerian real estate platform built with React, TanStack Router, and TailwindCSS.

**Backend Repo:** [sakani-backend-mongoose](https://github.com/alaa-mekibes/sakani-backend-mongoose)

![home page screenshot](https://i.ibb.co/7t5JwYN1/homepage.png)

---

## 🛠 Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| TanStack Router | File-based routing with type-safe navigation |
| TanStack Form | Form state management & validation |
| Zod | Schema validation |
| TailwindCSS + DaisyUI | Styling & component library |
| Lucide React | Icons |

---

## 📦 Packages

### Dependencies

| Package | Why |
| ------- | --- |
| `react` + `react-dom` | Core UI library |
| `@tanstack/react-form` | Form state, validation, and submission — integrates with Zod |
| `zod` | Schema validation for forms and search params |
| `tailwindcss` | Utility-first CSS framework |
| `@tailwindcss/vite` | Vite plugin that integrates Tailwind 4 without a config file |
| `daisyui` | Tailwind component library — provides ready-made UI components (navbar, card, input, etc.) |
| `lucide-react` | Clean, consistent icon set used throughout the UI |
| `react-hot-toast` | Lightweight toast notifications for success/error feedback |

### Dev Dependencies

| Package | Why |
| ------- | --- |
| `vite` | Fast dev server and bundler |
| `@vitejs/plugin-react` | Enables React Fast Refresh in Vite |
| `@tanstack/router-plugin` | Vite plugin that auto-generates `routeTree.gen.ts` from the file structure |
| `typescript` | TypeScript compiler |
| `eslint` + plugins | Code linting and quality enforcement |
| `@types/*` | Type definitions for React |

---

## 📁 Project Structure

```markdown
src/
├── assets/                     # Static images and SVGs
├── components/
│   ├── images/
│   │   ├── DefaultAvatar.tsx   # Fallback avatar when user has no profile picture
│   │   ├── Logo.tsx            # Sakani logo component (switches black/white by theme)
│   │   ├── LoginImage.tsx      # Illustrationkit SVG for login page
│   │   └── RegisterImage.tsx   # Illustrationkit SVG for register page
│   └── layout/
│       ├── Navbar.tsx          # Top navigation with search, theme toggle, auth links
│       ├── Hero.tsx            # Landing page hero section
│       ├── SearchCard.tsx      # Filter card (title, location, price, type)
│       ├── PropertyGrid.tsx    # Grid display of property cards
│       ├── ImageSlider.tsx     # Image carousel for property details
│       ├── CreatePropertyForm.tsx  # TanStack Form for creating a property
│       ├── UpdatePropertyForm.tsx  # TanStack Form with pre-filled values for editing
│       ├── ConfirmDialog.tsx   # Reusable delete confirmation modal
│       ├── FieldInfo.tsx       # Displays Zod validation errors under form fields
│       ├── LoadingSpinner.tsx  # Full-screen loading indicator
│       ├── SafeImage.tsx       # Image with fallback on load error
│       ├── NoData.tsx          # Empty state component
│       ├── NotFound.tsx        # 404 page component
│       └── Error.tsx           # Error page component
├── context/
│   └── AuthContext.tsx         # Global auth state — user, login, logout, register, isAuthenticated
├── hooks/
│   └── useTheme.ts             # Light/dark theme toggle with localStorage persistence
├── interfaces/
│   └── index.ts                # TypeScript interfaces for API data (IUser, IProperty, etc.)
├── lib/
│   └── api.ts                  # Fetch wrapper — get, post, patch, delete, upload, uploadPatch
├── routes/
│   ├── __root.tsx              # Root layout — Navbar, Toaster, Outlet
│   ├── index.tsx               # Landing page (/)
│   ├── (auth)/
│   │   ├── login.tsx           # Login page with TanStack Form
│   │   └── signup.tsx          # Register page with TanStack Form
│   ├── properties/
│   │   ├── route.tsx           # Properties layout route
│   │   ├── index.tsx           # Properties listing with search & filters
│   │   ├── $propertyId.tsx     # Property detail page
│   │   ├── create.tsx          # Create property page (protected)
│   │   └── update.tsx          # Update property page (protected, owner only)
│   └── profile/
│       └── $userId.tsx         # User profile page
├── types/
│   └── index.ts                # Shared TypeScript types (PropertyType enum, etc.)
├── utils/
│   └── index.ts                # Utility functions
├── validation/
│   └── index.ts                # Zod schemas + inferred types for all forms
├── router.tsx                  # TanStack Router setup with auth context
└── main.tsx                    # App entry point
```

---

## 🔧 Utility Functions

### `api` — `src/lib/api.ts`

Centralized fetch wrapper. All requests go through here — handles `credentials: 'include'` for cookies automatically:

```typescript
api.get<IProperty[]>('/property')                    // GET
api.post<IUser>('/auth/login', { email, password })  // POST JSON
api.patch('/property/123', body)                     // PATCH JSON
api.delete('/property/123')                          // DELETE
api.upload('/property', formData)                    // POST multipart (images)
api.uploadPatch('/property/123', formData)           // PATCH multipart (update images)
```

### `useAuth` — `src/context/AuthContext.tsx`

Global auth context. Fetches `/auth/me` on app load to restore session from cookie:

```typescript
const { user, isAuthenticated, login, logout, register } = useAuth();
```

### `useTheme` — `src/hooks/useTheme.ts`

Toggles between `light` and `dracula` DaisyUI themes. Persists choice in `localStorage` and applies `data-theme` attribute to `<html>`:

```typescript
const { theme, toggleTheme } = useTheme();
```

### `FieldInfo` — `src/components/layout/FieldInfo.tsx`

Displays Zod validation errors below any TanStack Form field:

```tsx
<form.Field name="email">
    {(field) => (
        <>
            <input ... />
            <FieldInfo field={field} />  {/* shows error message */}
        </>
    )}
</form.Field>
```

### `validateImages` — `src/validation/index.ts`

Validates image files before upload — checks count, type, and size:

```typescript
const error = validateImages(files);  // returns error string or null
if (error) toast.error(error);
```

### `getErrorMessage` — `src/utils/index.ts`

Safely extracts error messages from unknown catch values:

```typescript
catch (error) {
    toast.error(getErrorMessage(error) ?? 'Something went wrong');
}
```

---

## 🛣 Routing

TanStack Router uses **file-based routing** — the folder structure defines the routes. The `routeTree.gen.ts` file is auto-generated by the Vite plugin on every save.

| Route | Page |
| ----- | ---- |
| `/` | Landing / Hero |
| `/login` | Login |
| `/signup` | Register |
| `/properties` | Properties listing with filters |
| `/properties/:propertyId` | Property detail |
| `/properties/create` | Create property (protected) |
| `/properties/update` | Update property (protected) |
| `/profile/:userId` | User profile |

### Route-level auth protection

```typescript
beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) throw redirect({ to: '/login' });
}
```

### Search param validation

```typescript
validateSearch: searchPropertySchema  // invalid params are silently ignored
```

---

## ⚙️ Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Run in development
bun dev
```

App runs at `http://localhost:5173`

---

## 🎨 Credits

- Login & Register illustrations from [IllustrationKit — Yippy](https://illustrationkit.com/illustrations/yippy)
- Hero background photo from [Unsplash](https://unsplash.com/photos/gray-and-white-concrete-house-2keCPb73aQY)
