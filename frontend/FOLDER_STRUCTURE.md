# FintechOps Frontend - Folder Structure

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── Signup/
│   │   │   ├── Signup.jsx
│   │   │   └── Signup.css
│   │   └── Confirm/
│   │       ├── Confirm.jsx
│   │       └── Confirm.css
│   │
│   ├── Layout/
│   │   └── Navbar/
│   │       ├── Navbar.jsx
│   │       └── Navbar.css
│   │
│   ├── Home/
│   │   ├── IndicesBar/
│   │   │   ├── IndicesBar.jsx
│   │   │   └── IndicesBar.css
│   │   ├── NewsSection/
│   │   │   ├── NewsSection.jsx
│   │   │   └── NewsSection.css
│   │   ├── StocksSection/
│   │   │   ├── StocksSection.jsx
│   │   │   └── StocksSection.css
│   │   ├── MarketOverview/
│   │   │   ├── MarketOverview.jsx
│   │   │   └── MarketOverview.css
│   │   ├── IPOSection/
│   │   │   ├── IPOSection.jsx
│   │   │   └── IPOSection.css
│   │   ├── Newsletter/
│   │   │   ├── Newsletter.jsx
│   │   │   └── Newsletter.css
│   │   └── Footer/
│   │       ├── Footer.jsx
│   │       └── Footer.css
│   │
│   ├── Calculators/
│   │   ├── SIPCalculator/
│   │   │   ├── SIPCalculator.jsx
│   │   │   └── SIPCalculator.css
│   │   ├── EMICalculator/
│   │   │   ├── EMICalculator.jsx
│   │   │   └── EMICalculator.css
│   │   ├── CAGRCalculator/
│   │   │   ├── CAGRCalculator.jsx
│   │   │   └── CAGRCalculator.css
│   │   ├── CompoundInterestCalculator/
│   │   │   ├── CompoundInterestCalculator.jsx
│   │   │   └── CompoundInterestCalculator.css
│   │   ├── LumpsumCalculator/
│   │   │   ├── LumpsumCalculator.jsx
│   │   │   └── LumpsumCalculator.css
│   │   ├── InflationCalculator/
│   │   │   ├── InflationCalculator.jsx
│   │   │   └── InflationCalculator.css
│   │   ├── RetirementCalculator/
│   │   │   ├── RetirementCalculator.jsx
│   │   │   └── RetirementCalculator.css
│   │   ├── PPFCalculator/
│   │   │   ├── PPFCalculator.jsx
│   │   │   └── PPFCalculator.css
│   │   ├── NPSCalculator/
│   │   │   ├── NPSCalculator.jsx
│   │   │   └── NPSCalculator.css
│   │   ├── SWPCalculator/
│   │   │   ├── SWPCalculator.jsx
│   │   │   └── SWPCalculator.css
│   │   ├── GoalPlanningCalculator/
│   │   │   ├── GoalPlanningCalculator.jsx
│   │   │   └── GoalPlanningCalculator.css
│   │   ├── AssetAllocationCalculator/
│   │   │   ├── AssetAllocationCalculator.jsx
│   │   │   └── AssetAllocationCalculator.css
│   │   ├── RiskRewardCalculator/
│   │   │   ├── RiskRewardCalculator.jsx
│   │   │   └── RiskRewardCalculator.css
│   │   ├── PortfolioReturnCalculator/
│   │   │   ├── PortfolioReturnCalculator.jsx
│   │   │   └── PortfolioReturnCalculator.css
│   │   └── TaxCalculator/
│   │       ├── TaxCalculator.jsx
│   │       └── TaxCalculator.css
│   │
│   ├── Common/
│   │   └── ProtectedRoute.js
│   │
│   └── Dashboard.js (legacy - to be refactored)
│
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.css
│   └── Calculators/
│       ├── Calculators.jsx
│       └── Calculators.css
│
├── services/
│   ├── api.js
│   ├── cognitoService.js
│   ├── marketApi.js
│   ├── newsApi.js
│   └── calculatorApi.js
│
├── utils/
│   └── (utility functions)
│
├── App.js
├── App.css
└── index.js
```

## 🎯 Design Principles

### 1. Component Organization
- Each component has its own folder
- Each folder contains `.jsx` and `.css` files
- Related components grouped by feature

### 2. Naming Conventions
- PascalCase for component folders and files
- Descriptive names indicating purpose
- Consistent file extensions (.jsx for components)

### 3. Responsive Design
- Mobile-first approach
- Breakpoints: 360px, 480px, 768px, 1024px, 1440px
- Touch-friendly UI elements (min 44x44px)
- Flexible layouts using CSS Grid and Flexbox

### 4. CSS Architecture
- Component-scoped styles
- Shared variables in App.css
- No CSS conflicts
- BEM-like naming for clarity

## 📱 Responsive Breakpoints

```css
/* Mobile Small */
@media (max-width: 360px) { }

/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop Small */
@media (max-width: 1024px) { }

/* Desktop Large */
@media (min-width: 1440px) { }
```

## 🚀 Component Guidelines

### Each Component Should:
1. Be self-contained
2. Have its own CSS file
3. Be fully responsive
4. Follow accessibility standards
5. Use semantic HTML
6. Handle loading/error states

### File Structure Example:
```
ComponentName/
├── ComponentName.jsx    # Component logic
└── ComponentName.css    # Component styles
```

## 🔧 Import Patterns

```javascript
// Component imports
import ComponentName from './components/Feature/ComponentName/ComponentName';

// Service imports
import { serviceName } from './services/serviceName';

// Style imports
import './ComponentName.css';
```

## 📦 Features by Folder

### Auth/
- User authentication
- Login, Signup, Confirmation
- Password management

### Layout/
- Navigation bar
- Header, Footer
- Common layout components

### Home/
- Dashboard components
- Market data displays
- News feeds
- IPO sections

### Calculators/
- 15 financial calculators
- Each with dedicated folder
- Reusable calculation logic

### Common/
- Shared components
- Protected routes
- Utility components

## 🎨 Styling Strategy

1. **Global Styles** (App.css)
   - CSS variables
   - Reset styles
   - Typography
   - Common utilities

2. **Component Styles** (Component.css)
   - Component-specific styles
   - Responsive adjustments
   - State variations

3. **Responsive Design**
   - Mobile-first
   - Progressive enhancement
   - Touch-optimized

## ✅ Best Practices

1. **Component Structure**
   - One component per file
   - Clear separation of concerns
   - Reusable and modular

2. **CSS Organization**
   - Scoped to component
   - No global pollution
   - Consistent naming

3. **Responsive Design**
   - Test on multiple devices
   - Use relative units (rem, %, vh/vw)
   - Flexible images and media

4. **Performance**
   - Lazy loading for routes
   - Code splitting
   - Optimized images

5. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## 🔄 Migration Status

✅ Completed:
- Auth components (Login, Signup, Confirm)
- Layout components (Navbar)
- All 15 Calculators

🔄 In Progress:
- Home page components
- Dashboard refactoring

📋 Pending:
- Markets page
- News page
- Portfolio page
- Watchlist page
- Premium page

## 📝 Notes

- All components are fully responsive
- Mobile-first design approach
- Clean white UI theme
- Optimized for all screen sizes
- Touch-friendly interactions
