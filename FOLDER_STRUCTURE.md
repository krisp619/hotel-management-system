# 📁 Recommended Folder Structure

## Current vs. Improved Structure

### CURRENT STRUCTURE (Flat, Hard to Scale)
```
frontend-react/src/
├── components/
│   ├── Alert.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Header.jsx
│   ├── Input.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Bookings.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── api/
│   └── index.js
├── hooks/
│   └── useAuth.js
├── firebase/
│   └── useFirebaseAuth.js
├── config/
│   └── apiConfig.js
├── App.jsx
├── App.css
└── main.jsx
```

---

## RECOMMENDED STRUCTURE (Professional, Scalable)

```
frontend-react/
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── logo-white.svg
│
├── src/
│
│   ├── assets/                          ← NEW: Static assets
│   │   ├── icons/
│   │   │   ├── home.svg
│   │   │   ├── booking.svg
│   │   │   ├── logout.svg
│   │   │   └── settings.svg
│   │   ├── images/
│   │   │   ├── hero-bg.jpg
│   │   │   ├── room-1.jpg
│   │   │   └── room-2.jpg
│   │   └── illustrations/
│   │       ├── empty-state.svg
│   │       └── error-404.svg
│   │
│   ├── styles/                          ← NEW: Global styles
│   │   ├── globals.css                  ← NEW: Design system
│   │   ├── variables.css                ← NEW: CSS custom properties
│   │   ├── animations.css               ← NEW: Keyframe animations
│   │   ├── responsive.css               ← NEW: Media queries
│   │   └── utilities.css                ← NEW: Utility classes
│   │
│   ├── components/
│   │
│   │   ├── common/                      ← NEW: Layout components
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Header.module.css
│   │   │   │   └── HeaderMenu.jsx       ← NEW
│   │   │   ├── Footer/                  ← NEW
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.module.css
│   │   │   ├── Navbar/                  ← NEW
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.module.css
│   │   │   ├── Sidebar/                 ← NEW
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Sidebar.module.css
│   │   │   └── Toast/                   ← NEW
│   │   │       ├── Toast.jsx
│   │   │       └── Toast.module.css
│   │   │
│   │   ├── shared/                      ← NEW: UI primitives
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Input.module.css
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Card.module.css
│   │   │   ├── Badge/                   ← NEW
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Badge.module.css
│   │   │   ├── Modal/                   ← NEW
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Modal.module.css
│   │   │   ├── Skeleton/                ← NEW
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── Skeleton.module.css
│   │   │   ├── Spinner/                 ← NEW
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── Spinner.module.css
│   │   │   ├── Tag/                     ← NEW
│   │   │   │   ├── Tag.jsx
│   │   │   │   └── Tag.module.css
│   │   │   ├── Divider/                 ← NEW
│   │   │   │   ├── Divider.jsx
│   │   │   │   └── Divider.module.css
│   │   │   └── Alert/                   ← REFACTOR
│   │   │       ├── Alert.jsx
│   │   │       └── Alert.module.css
│   │   │
│   │   ├── features/                    ← NEW: Feature-specific
│   │   │   ├── RoomSelector/
│   │   │   │   ├── RoomCard.jsx         ← NEW
│   │   │   │   ├── RoomCard.module.css
│   │   │   │   ├── RoomGrid.jsx         ← NEW
│   │   │   │   └── RoomGrid.module.css
│   │   │   ├── BookingForm/             ← NEW
│   │   │   │   ├── BookingForm.jsx
│   │   │   │   ├── BookingForm.module.css
│   │   │   │   └── BookingModal.jsx     ← NEW
│   │   │   ├── BookingCard/             ← NEW
│   │   │   │   ├── BookingCard.jsx
│   │   │   │   └── BookingCard.module.css
│   │   │   ├── SearchHero/              ← NEW
│   │   │   │   ├── SearchHero.jsx
│   │   │   │   └── SearchHero.module.css
│   │   │   ├── FilterSidebar/           ← NEW
│   │   │   │   ├── FilterSidebar.jsx
│   │   │   │   └── FilterSidebar.module.css
│   │   │   ├── ReviewSection/           ← NEW
│   │   │   │   ├── ReviewSection.jsx
│   │   │   │   └── ReviewSection.module.css
│   │   │   └── ProtectedRoute.jsx       ← MOVE HERE
│   │   │
│   │   └── index.js                     ← NEW: Barrel export
│   │
│   ├── pages/
│   │
│   │   ├── auth/                        ← NEW: Group auth pages
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Login.module.css
│   │   │   │   └── index.js
│   │   │   ├── Register/
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── Register.module.css
│   │   │   │   └── index.js
│   │   │   ├── ForgotPassword/          ← NEW
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── ForgotPassword.module.css
│   │   │   │   └── index.js
│   │   │   └── ResetPassword/           ← NEW
│   │   │       ├── ResetPassword.jsx
│   │   │       ├── ResetPassword.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── dashboard/                   ← NEW: Rename from pages
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Dashboard.module.css
│   │   │   │   └── index.js
│   │   │   ├── Bookings/
│   │   │   │   ├── Bookings.jsx
│   │   │   │   ├── Bookings.module.css
│   │   │   │   └── index.js
│   │   │   ├── Profile/                 ← NEW
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Profile.module.css
│   │   │   │   └── index.js
│   │   │   └── Settings/                ← NEW
│   │   │       ├── Settings.jsx
│   │   │       ├── Settings.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── NotFound/                    ← NEW
│   │   │   ├── NotFound.jsx
│   │   │   ├── NotFound.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── ServerError/                 ← NEW
│   │   │   ├── ServerError.jsx
│   │   │   ├── ServerError.module.css
│   │   │   └── index.js
│   │   │
│   │   └── index.js                     ← NEW: Barrel export
│   │
│   ├── context/                         ← NEW: State management
│   │   ├── AuthContext.js
│   │   ├── AuthProvider.jsx
│   │   ├── BookingContext.js            ← NEW
│   │   ├── BookingProvider.jsx          ← NEW
│   │   ├── ThemeContext.js              ← NEW
│   │   ├── ThemeProvider.jsx            ← NEW
│   │   └── index.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js                   ← EXISTING
│   │   ├── useBooking.js                ← NEW
│   │   ├── useForm.js                   ← NEW
│   │   ├── useDebounce.js               ← NEW
│   │   ├── useFetch.js                  ← NEW
│   │   ├── useLocalStorage.js           ← NEW
│   │   ├── useWindowSize.js             ← NEW
│   │   └── index.js
│   │
│   ├── api/
│   │   ├── index.js                     ← EXISTING (main export)
│   │   ├── auth.js                      ← NEW (auth endpoints)
│   │   ├── bookings.js                  ← NEW (booking endpoints)
│   │   ├── rooms.js                     ← NEW (room endpoints)
│   │   ├── config.js                    ← EXISTING
│   │   └── interceptors.js              ← NEW (request/response)
│   │
│   ├── utils/                           ← NEW: Utility functions
│   │   ├── formatters.js
│   │   │   ├── formatDate()
│   │   │   ├── formatPrice()
│   │   │   ├── formatPhone()
│   │   │   └── ...
│   │   ├── validators.js
│   │   │   ├── validateEmail()
│   │   │   ├── validatePassword()
│   │   │   ├── validatePhoneNumber()
│   │   │   └── ...
│   │   ├── constants.js
│   │   │   ├── ROOM_TYPES
│   │   │   ├── BOOKING_STATUS
│   │   │   ├── API_ENDPOINTS
│   │   │   └── ...
│   │   ├── helpers.js
│   │   │   ├── getInitials()
│   │   │   ├── getStatusColor()
│   │   │   ├── calculateNights()
│   │   │   └── ...
│   │   ├── localStorage.js
│   │   │   ├── setToken()
│   │   │   ├── getToken()
│   │   │   └── ...
│   │   └── index.js
│   │
│   ├── config/                          ← NEW: Configuration
│   │   ├── apiConfig.js                 ← MOVE HERE
│   │   ├── appConfig.js                 ← NEW
│   │   ├── environment.js               ← NEW
│   │   └── index.js
│   │
│   ├── firebase/                        ← OPTIONAL: Cloud services
│   │   ├── useFirebaseAuth.js
│   │   └── firebaseConfig.js
│   │
│   ├── types/                           ← NEW: TypeScript types (if using TS)
│   │   ├── user.types.js
│   │   ├── booking.types.js
│   │   ├── room.types.js
│   │   └── index.js
│   │
│   ├── App.jsx                          ← EXISTING
│   ├── App.module.css                   ← NEW: App-level styles (if needed)
│   ├── main.jsx                         ← EXISTING
│   └── index.css                        ← Can import globals.css here
│
├── .env                                 ← Environment variables
├── .env.example                         ← Example env file
├── .gitignore
├── package.json
├── vite.config.js
└── README.md                            ← Update with new structure
```

---

## Migration Steps

### Step 1: Create New Folder Structure
```bash
# Create directories
mkdir -p src/assets/{icons,images,illustrations}
mkdir -p src/styles
mkdir -p src/components/{common,shared,features}
mkdir -p src/pages/{auth,dashboard}
mkdir -p src/context
mkdir -p src/utils
mkdir -p src/config
mkdir -p src/types
```

### Step 2: Move Files
```bash
# Move components
mv src/Header.jsx → src/components/common/Header/Header.jsx
mv src/Button.jsx → src/components/shared/Button/Button.jsx
# ... etc

# Move pages
mv src/pages/Login.jsx → src/pages/auth/Login/Login.jsx
mv src/pages/Dashboard.jsx → src/pages/dashboard/Dashboard/Dashboard.jsx
# ... etc

# Move configuration
mv src/config/apiConfig.js → src/config/apiConfig.js
mv src/hooks/useAuth.js → src/hooks/useAuth.js
```

### Step 3: Update Imports
Search and replace:
```javascript
// Before
import { Button } from './Button';

// After
import { Button } from '../components/shared/Button';
```

### Step 4: Create Barrel Exports
```javascript
// src/components/index.js
export { Button } from './shared/Button/Button';
export { Input } from './shared/Input/Input';
export { Card } from './shared/Card/Card';
export { Header } from './common/Header/Header';
export { ProtectedRoute } from './features/ProtectedRoute';

// Usage
import { Button, Input, Card } from '../components';
```

### Step 5: Update App.jsx
```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components';
import { Login, Register } from './pages/auth';
import { Dashboard, Bookings } from './pages/dashboard';
import { NotFound } from './pages';
import './App.module.css';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

---

## Benefits of New Structure

| Aspect | Benefit |
|--------|---------|
| **Scalability** | Easy to add new features without cluttering main folders |
| **Maintainability** | Related files grouped together for easier updates |
| **Discoverability** | Clear organization makes finding code faster |
| **Testing** | Easy to locate and test related components |
| **Team Collaboration** | Different team members can work on different features |
| **Code Reuse** | Clear separation makes components reusable |
| **Documentation** | Easier to document with organized structure |
| **Performance** | Easier to identify and optimize bottlenecks |

---

## Naming Conventions

### Components
```javascript
// PascalCase for component files/folders
Button.jsx
Header.jsx
LoginForm.jsx

// Exported as named exports
export const Button = ({ ... }) => {}
export const Header = ({ ... }) => {}

// Usage
import { Button } from '../components';
```

### Utils & Hooks
```javascript
// camelCase for utility functions
formatDate.js
validateEmail.js
useAuth.js

// Export as named or default
export const formatDate = () => {}
export const useAuth = () => {}

// Usage
import { formatDate } from '../utils';
import useAuth from '../hooks/useAuth';
```

### CSS Modules
```javascript
// Match component file name
Button.module.css
Header.module.css
LoginForm.module.css

// Import and use
import styles from './Button.module.css';
<button className={styles.button}></button>
```

### Constants
```javascript
// UPPER_SNAKE_CASE for constants
export const API_BASE_URL = 'https://api.example.com';
export const ROOM_TYPES = ['Single', 'Double', 'Deluxe'];
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};
```

---

## Tree View Command

To generate this structure, use:

```bash
# Install tree-like tool (Windows)
npm install -g tree-cli

# Generate tree
tree -L 3 -I 'node_modules' src/
```

---

This structure will make your codebase professional, scalable, and maintainable!
