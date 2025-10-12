# eXobe Vendor Portal

A comprehensive, beautiful, and user-friendly vendor dashboard for retailers on the eXobe marketplace platform.

## Features

### 🎯 Core Functionality
- **Dashboard Overview**: Real-time analytics, sales charts, and key performance metrics
- **Product Management**: Complete CRUD operations for products with variants and options
- **Collection Management**: Organize products into curated collections
- **Order Management**: Track and manage orders with detailed status tracking
- **Discount Management**: Create and manage promotional codes and discounts
- **Analytics**: Comprehensive insights into sales, traffic, and performance
- **Notifications**: Real-time updates on store activities
- **Settings**: Customizable store settings, account management, and security

### 🎨 Design Features
- Modern, clean UI with Tailwind CSS
- Responsive design for all device sizes
- Beautiful charts and visualizations with Recharts
- Intuitive navigation with sidebar and header
- Professional color scheme with red accent (brand color)
- Smooth animations and transitions

### 🛠️ Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **API**: Apollo Client for GraphQL
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Running eXobe API backend

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Update environment variables:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Run the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
exobe-vendors/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── page.tsx       # Dashboard overview
│   │   │   ├── products/      # Product management
│   │   │   ├── collections/   # Collection management
│   │   │   ├── orders/        # Order management
│   │   │   ├── discounts/     # Discount management
│   │   │   ├── analytics/     # Analytics & insights
│   │   │   ├── notifications/ # Notifications
│   │   │   └── settings/      # Settings
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page (redirects to dashboard)
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   │   ├── Header.tsx     # Top header
│   │   │   └── DashboardLayout.tsx
│   │   └── ui/                # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Select.tsx
│   │       ├── Textarea.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   └── apollo-client.ts   # GraphQL client setup
│   └── store/
│       └── vendor-store.ts    # Zustand state management
├── public/                     # Static assets
└── package.json
```

## Key Pages

### Dashboard (`/dashboard`)
- Overview of key metrics (revenue, orders, conversion rate)
- Sales and order trend charts
- Recent orders table
- Top selling products

### Products (`/dashboard/products`)
- Product list with search and filters
- Add/Edit products with full form
- Product variants and options management
- Media upload
- SEO optimization
- Inventory tracking

### Collections (`/dashboard/collections`)
- Collection grid view
- Create and manage collections
- Add products to collections
- Collection images and descriptions

### Orders (`/dashboard/orders`)
- Order list with status tracking
- Order details view
- Filter by status and payment
- Customer information

### Discounts (`/dashboard/discounts`)
- Discount code management
- Multiple discount types (percentage, fixed, free shipping)
- Usage tracking and limits
- Active period management

### Analytics (`/dashboard/analytics`)
- Revenue and order trends
- Sales by category
- Top products
- Traffic sources
- Key performance indicators

### Settings (`/dashboard/settings`)
- Store information
- Account management
- Notification preferences
- Security settings
- Password management

## Available Scripts

```bash
# Development
yarn dev              # Start development server

# Production
yarn build           # Build for production
yarn start           # Start production server

# Code Quality
yarn lint            # Run ESLint
```

## Integration with Backend

The vendor portal integrates with the eXobe GraphQL API. Key integration points:

1. **Authentication**: JWT token-based auth stored in localStorage
2. **Products**: Full CRUD operations via GraphQL mutations
3. **Orders**: Real-time order tracking and management
4. **Analytics**: Aggregated data from the analytics service

## Customization

### Colors
The primary brand color is red (`#dc2626`). To change:
- Update color classes in components (e.g., `bg-red-600`, `text-red-600`)
- Modify Tailwind config if needed

### Layout
- Sidebar navigation: `src/components/layout/Sidebar.tsx`
- Header: `src/components/layout/Header.tsx`
- Add/remove navigation items in the `navigation` array

## Best Practices

1. **State Management**: Use Zustand for global state, React hooks for local state
2. **Forms**: Use React Hook Form with Zod validation
3. **API Calls**: Use Apollo Client hooks (`useQuery`, `useMutation`)
4. **Styling**: Use Tailwind utility classes, create components for reusable patterns
5. **Types**: Define TypeScript interfaces for all data structures

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for type safety
3. Write clean, readable code with proper comments
4. Test thoroughly before committing

## Support

For issues or questions, contact the eXobe development team.

## License

Proprietary - eXobe Marketplace Platform
