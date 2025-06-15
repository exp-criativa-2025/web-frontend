# Treko Authentication System

## Overview
This application implements a complete JWT-based authentication system with user context management using React Context API and localStorage persistence.

## Features

### 🔐 Authentication
- **Login**: Users can log in with email/password
- **Registration**: New users can create accounts
- **Logout**: Secure logout with cookie clearing
- **JWT Tokens**: Secure authentication using jose library
- **Middleware Protection**: Automatic route protection

### 👤 User Management
- **User Context**: App-wide user state management
- **localStorage**: Persistent user data across sessions
- **Profile Management**: Users can edit their profile information
- **Real-time Updates**: UI updates immediately when user data changes

### 🎨 UI Components
- **Responsive Design**: Works on mobile and desktop
- **Modern UI**: Built with shadcn/ui components
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## File Structure

```
src/
├── providers/
│   └── UserProvider.tsx           # User context provider
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── route.ts           # Login API
│   │       ├── register/route.ts  # Registration API
│   │       └── logout/route.ts    # Logout API
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── login/page.tsx     # Login page
│   │   │   └── register/page.tsx  # Registration page
│   │   └── base/
│   │       ├── user/page.tsx      # User profile page
│   │       └── profile/page.tsx   # Enhanced profile page
├── components/
│   ├── app-sidebar.tsx            # Sidebar with user info
│   └── nav-user.tsx               # User dropdown menu
└── middleware.ts                  # Route protection
```

## Usage

### 1. User Context
The `UserProvider` wraps your entire app and provides:

```tsx
const { user, setUser, updateUser, clearUser, isLoading } = useUser()
```

### 2. Login Flow
```tsx
// Login page automatically:
// 1. Calls /api/auth with credentials
// 2. Receives JWT token (set as httpOnly cookie)
// 3. Sets user in context
// 4. Redirects to dashboard
```

### 3. User Profile
```tsx
// User can edit their profile:
// 1. Toggle edit mode
// 2. Update information
// 3. Save changes to context and localStorage
```

### 4. Logout
```tsx
// Logout process:
// 1. Calls /api/auth/logout to clear cookie
// 2. Clears user from context
// 3. Removes localStorage data
// 4. Redirects to login
```

## API Endpoints

### POST /api/auth
Login endpoint that returns user data and sets JWT cookie.

**Request:**
```json
{
  "username": "user@example.com",
  "email": "user@example.com", 
  "password": "password"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Login successful",
  "user": {
    "id": "1",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "(11) 99999-9999",
    "role": "User",
    "avatar": "/avatars/default.jpg"
  }
}
```

### POST /api/auth/register
Registration endpoint for new users.

### POST /api/auth/logout
Logout endpoint that clears the JWT cookie.

## Environment Variables

```env
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
```

## Security Features

- **HttpOnly Cookies**: JWT tokens stored securely
- **Route Protection**: Middleware checks authentication
- **CSRF Protection**: SameSite cookie configuration
- **Development Bypass**: Easy testing in development mode

## Data Persistence

User data is stored in two places:
1. **Context**: For real-time app state
2. **localStorage**: For persistence across browser sessions

The context automatically syncs with localStorage, ensuring data consistency.

## Error Handling

The system includes comprehensive error handling:
- Invalid credentials
- Network errors
- Token expiration
- Malformed requests

All errors are displayed to users in a friendly format.
