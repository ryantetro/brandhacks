# Brand Hack Finder - Unlock Hidden Brand Benefits

A comprehensive platform designed to uncover and deliver hidden brand warranties, return policies, price protections, and other perks associated with users' purchases — benefits most shoppers never realize they have. Our service acts as a personal assistant that scans purchase receipts, tracks deadlines, and proactively alerts users to take advantage of valuable brand hacks they are entitled to but would otherwise miss out on.

## 🚀 Features

- **AI-Powered Receipt Scanning**: Automatically extract brand information and policies from purchase receipts
- **Brand Policy Database**: Comprehensive database of verified brand policies and hidden benefits
- **Smart Alerts**: Proactive notifications for warranty expirations, return deadlines, and opportunities
- **Purchase Tracking**: Monitor all your purchases and their associated benefits
- **Warranty Management**: Track warranties, coverage details, and claim processes
- **Return Policy Tracking**: Never miss return windows with deadline alerts
- **User Dashboard**: Consolidated view of all active warranties, returns, and discovered hacks
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Modern state management with Zustand
- **Database Integration**: SQLite database with Prisma ORM

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern database ORM
- **SQLite** - Lightweight database
- **Zod** - Schema validation
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── brands/        # Brand policy management
│   │   ├── purchases/     # Purchase tracking endpoints
│   │   └── users/         # User management endpoints
│   ├── auth/              # Authentication pages
│   ├── brands/            # Brand policy browser
│   ├── dashboard/         # User dashboard
│   ├── purchases/         # Purchase management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/                    # Utility libraries
│   ├── api/                # API client functions
│   ├── auth/                # Authentication utilities
│   ├── db.ts               # Database connection
│   └── utils.ts            # General utilities
├── stores/                  # Zustand stores
├── types/                   # TypeScript type definitions
└── hooks/                   # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dealtracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed the brand database**
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Start the development server**
```bash
npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Users
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User's full name
- `password` - Hashed password
- `subscription` - Free or premium subscription
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Purchases
- `id` - Unique identifier
- `title` - Purchase title
- `description` - Purchase description
- `brand` - Brand name
- `productName` - Product name
- `purchasePrice` - Purchase price
- `purchaseDate` - Date of purchase
- `receiptImageUrl` - Receipt image URL
- `receiptText` - OCR extracted text
- `category` - Product category
- `tags` - JSON string of tags
- `storeUrl` - Store URL
- `imageUrl` - Product image URL
- `userId` - Foreign key to user
- `createdAt` - Purchase creation timestamp
- `updatedAt` - Last update timestamp

### Warranties
- `id` - Unique identifier
- `purchaseId` - Foreign key to purchase
- `brand` - Brand name
- `duration` - Duration in days
- `type` - Warranty type (manufacturer, extended, accidental)
- `description` - Warranty description
- `coverage` - What's covered
- `exclusions` - What's not covered
- `claimProcess` - How to claim
- `expiresAt` - Warranty expiration date
- `isActive` - Whether warranty is active
- `userId` - Foreign key to user

### Return Policies
- `id` - Unique identifier
- `purchaseId` - Foreign key to purchase
- `brand` - Brand name
- `duration` - Duration in days
- `conditions` - Return conditions
- `process` - Return process
- `refundType` - Type of refund (full, store_credit, exchange)
- `expiresAt` - Return deadline
- `isActive` - Whether return is available
- `userId` - Foreign key to user

### Brands
- `id` - Unique identifier
- `name` - Brand name (unique)
- `slug` - URL-friendly slug (unique)
- `logoUrl` - Brand logo URL
- `website` - Brand website
- `description` - Brand description
- `defaultWarranty` - Default warranty duration
- `defaultReturnPolicy` - Default return policy duration
- `isVerified` - Whether brand is verified
- `createdAt` - Brand creation timestamp
- `updatedAt` - Last update timestamp

### Brand Policies
- `id` - Unique identifier
- `brandId` - Foreign key to brand
- `type` - Policy type (warranty, return, price_protection, other)
- `title` - Policy title
- `description` - Policy description
- `duration` - Duration in days
- `conditions` - Specific conditions
- `process` - How to claim/use
- `exclusions` - What's excluded
- `isActive` - Whether policy is active
- `createdAt` - Policy creation timestamp
- `updatedAt` - Last update timestamp

### Alerts
- `id` - Unique identifier
- `type` - Alert type (warranty_expiry, return_deadline, price_drop, policy_update)
- `title` - Alert title
- `message` - Alert message
- `priority` - Alert priority (low, medium, high, urgent)
- `isRead` - Whether alert is read
- `isActive` - Whether alert is active
- `scheduledFor` - When to send alert
- `sentAt` - When alert was sent
- `warrantyId` - Foreign key to warranty (optional)
- `returnPolicyId` - Foreign key to return policy (optional)
- `userId` - Foreign key to user
- `createdAt` - Alert creation timestamp
- `updatedAt` - Last update timestamp

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Brands
- `GET /api/brands` - Get all brands with policies
- `POST /api/brands` - Create new brand with policies

### Purchases
- `GET /api/purchases` - Get all purchases (with pagination and filtering)
- `POST /api/purchases` - Create new purchase and apply brand policies

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 UI Components

The application uses a comprehensive design system with:

- **Button** - Multiple variants (default, outline, ghost, etc.)
- **Card** - Container components with header, content, footer
- **Input** - Form input fields
- **Label** - Form labels
- **Layout** - Page layout components
- **Header** - Navigation header

All components are built with:
- TypeScript support
- Tailwind CSS styling
- Accessibility features
- Responsive design
- Dark mode support

## 🔐 Authentication

The authentication system includes:

- **Registration** - New user signup with validation
- **Login** - Secure user authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Session Management** - Zustand store for client-side state
- **Protected Routes** - Authentication guards for sensitive pages

## 📱 State Management

Using Zustand for lightweight state management:

- **Auth Store** - User authentication state
- **Purchase Store** - Purchase, warranty, and return policy management
- **Persistent Storage** - Automatic state persistence

## 🎯 Key Features

### Dashboard
- Overview of user's purchases and benefits
- Warranty and return statistics
- Recent purchases display
- Quick actions for common tasks

### Brand Database
- Browse verified brand policies
- Search and filter brands
- View detailed policy information
- Submit brand requests

### Purchase Management
- Add new purchases manually
- Upload receipts for AI processing
- Track warranties and return policies
- Monitor benefit deadlines

### User Experience
- Responsive design
- Loading states
- Error handling
- Form validation
- Intuitive navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Deal Management**: Add, edit, and track product deals
- **Price Monitoring**: Track original and discounted prices
- **Dashboard Analytics**: View savings statistics and deal overview
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Modern state management with Zustand
- **Database Integration**: SQLite database with Prisma ORM

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern database ORM
- **SQLite** - Lightweight database
- **Zod** - Schema validation
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── deals/         # Deal management endpoints
│   │   └── users/         # User management endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/                    # Utility libraries
│   ├── api/                # API client functions
│   ├── auth/                # Authentication utilities
│   ├── db.ts               # Database connection
│   └── utils.ts            # General utilities
├── stores/                  # Zustand stores
├── types/                   # TypeScript type definitions
└── hooks/                   # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dealtracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Users
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User's full name
- `password` - Hashed password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Deals
- `id` - Unique identifier
- `title` - Deal title
- `description` - Deal description
- `originalPrice` - Original product price
- `discountedPrice` - Discounted price
- `discountPercentage` - Calculated discount percentage
- `category` - Deal category
- `tags` - JSON string of tags
- `url` - Product URL
- `imageUrl` - Product image URL (optional)
- `expiresAt` - Deal expiration date (optional)
- `isActive` - Whether deal is active
- `userId` - Foreign key to user
- `createdAt` - Deal creation timestamp
- `updatedAt` - Last update timestamp

### Categories
- `id` - Unique identifier
- `name` - Category name (unique)
- `slug` - URL-friendly slug (unique)
- `description` - Category description (optional)
- `createdAt` - Category creation timestamp

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Deals
- `GET /api/deals` - Get all deals (with pagination and filtering)
- `POST /api/deals` - Create new deal
- `GET /api/deals/[id]` - Get specific deal
- `PUT /api/deals/[id]` - Update deal
- `DELETE /api/deals/[id]` - Delete deal

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 UI Components

The application uses a comprehensive design system with:

- **Button** - Multiple variants (default, outline, ghost, etc.)
- **Card** - Container components with header, content, footer
- **Input** - Form input fields
- **Label** - Form labels
- **Layout** - Page layout components
- **Header** - Navigation header

All components are built with:
- TypeScript support
- Tailwind CSS styling
- Accessibility features
- Responsive design
- Dark mode support

## 🔐 Authentication

The authentication system includes:

- **Registration** - New user signup with validation
- **Login** - Secure user authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Session Management** - Zustand store for client-side state
- **Protected Routes** - Authentication guards for sensitive pages

## 📱 State Management

Using Zustand for lightweight state management:

- **Auth Store** - User authentication state
- **Deal Store** - Deal management state
- **Persistent Storage** - Automatic state persistence

## 🎯 Key Features

### Dashboard
- Overview of user's deals
- Savings statistics
- Recent deals display
- Quick actions

### Deal Management
- Add new deals
- Track price changes
- Set expiration dates
- Categorize deals
- Tag system

### User Experience
- Responsive design
- Loading states
- Error handling
- Form validation
- Intuitive navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS