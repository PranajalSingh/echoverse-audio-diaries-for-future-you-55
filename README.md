
# EchoVerse - Your Audio Timeline

EchoVerse is an innovative audio diary application that allows you to create audio time capsules connecting your present self with your future self. Record thoughts, memories, and dreams to unlock at specific dates in the future.

## 🚀 Features

- **Audio Recording**: Create personal audio diary entries with built-in recording functionality
- **Time Capsule System**: Schedule entries to unlock at future dates
- **Timeline View**: Visual timeline interface to browse and manage your audio entries
- **User Authentication**: Secure user accounts and personalized experiences
- **Dashboard Analytics**: Track your diary journey with statistics and insights
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Notifications**: Get notified when new entries unlock

## 🛠️ Technologies Used

### Frontend Framework & Core
- **React** (v18.3.1) - JavaScript library for building user interfaces
- **TypeScript** - Static type checking for JavaScript
- **Vite** - Build tool and development server

### Routing & State Management
- **React Router DOM** (v6.26.2) - Client-side routing for navigation
- **TanStack React Query** (v5.56.2) - Data fetching and server state management

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - Pre-built component library with Radix UI primitives
- **Radix UI** - Unstyled, accessible UI primitives (multiple packages)
- **Lucide React** (v0.462.0) - Icon library
- **class-variance-authority** - Utility for creating component variants
- **clsx** & **tailwind-merge** - Utility libraries for conditional CSS classes

### Forms & Validation
- **React Hook Form** (v7.53.0) - Form library for React
- **@hookform/resolvers** (v3.9.0) - Validation resolvers for React Hook Form
- **Zod** (v3.23.8) - TypeScript-first schema validation

### UI Enhancement Libraries
- **Sonner** (v1.5.0) - Toast notification library
- **cmdk** (v1.0.0) - Command palette component
- **Recharts** (v2.12.7) - Chart library for data visualization
- **React Day Picker** (v8.10.1) - Date picker component
- **Embla Carousel React** (v8.3.0) - Carousel/slider component
- **React Resizable Panels** (v2.1.3) - Resizable panel layouts
- **Vaul** (v0.9.3) - Drawer component
- **input-otp** (v1.2.4) - One-time password input component

### Backend & Database
- **Supabase** (v2.49.8) - Backend-as-a-Service for authentication, database, and storage

### Utilities
- **date-fns** (v3.6.0) - Date utility library
- **next-themes** (v0.3.0) - Theme switching utility

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Tailwind CSS Animate** (v1.0.7) - Animation utilities for Tailwind

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
├── pages/              # Application pages/routes
└── utils/              # Helper utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:8080`

## 🏗️ Building for Production

```bash
npm run build
```

## 🌐 Deployment

This project can be deployed on any static hosting service. For easy deployment, you can use the Lovable platform's built-in deployment feature.

## 📱 Responsive Design

EchoVerse is built with a mobile-first approach and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Privacy & Security

- All audio data is stored securely
- User authentication ensures private access to personal entries
- Client-side validation with server-side security measures

## 🤝 Contributing

This project was built using [Lovable](https://lovable.dev), an AI-powered development platform. To contribute or make changes, you can:

1. Use the Lovable editor directly
2. Clone this repository and push changes back
3. Create pull requests for review

## 📄 License

This project is part of the Lovable platform ecosystem.

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **Lovable Project**: https://lovable.dev/projects/5fe48a6c-11c4-4460-8d5c-22a87cc6dceb
- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)

---

Built with ❤️ using [Lovable](https://lovable.dev)
