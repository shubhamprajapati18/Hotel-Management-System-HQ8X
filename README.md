# HQ8X – Luxury Hotel Management System

HQ8X is a comprehensive and premium hotel management platform designed to deliver an exceptional experience for both guests and hotel administrators. Built with modern web technologies, it seamlessly handles everything from room reservations and public browsing to internal hotel operations like housekeeping, maintenance, and staff management.

## 🌟 Key Features

### 🏨 Public Experience
*   **Property Showcase:** Explore luxury rooms, premium amenities, curated dining options, and exclusive experiences.
*   **Seamless Booking:** Intuitive room search, detailed room views, and a smooth booking and payment flow.
*   **Customer Engagement:** Special offers, contact forms, and automated booking confirmations.

### 🛎️ Guest Portal (My Stay)
*   *Accessible to registered guests with active reservations.*
*   **Booking Management:** View past and current bookings.
*   **Room Services:** Request in-room dining and services.
*   **Operations Requests:** Request housekeeping and report maintenance issues directly from the room.
*   **Billing & Notifications:** View secure payments and receive real-time notifications.
*   **Profile Management:** Manage account details and preferences.

### 💼 Admin Panel
*   *Comprehensive dashboard for hotel staff and management.*
*   **Core Operations:** Manage rooms, reservations, group bookings, and the interactive booking calendar.
*   **Guest Management:** Comprehensive guest directories, waitlist management, and testimonials.
*   **Internal Logistics:** Dedicated panels for housekeeping schedules, maintenance requests, and service requests.
*   **Business Tools:** Revenue reports, payment tracking, staff management, and system settings.
*   **Marketing Management:** Update public-facing dining menus, offers, and respond to contact submissions.

## 💻 Tech Stack

*   **Frontend Framework:** React 18 with TypeScript, powered by Vite for lightning-fast builds.
*   **Routing:** React Router DOM (v6) for seamless client-side navigation.
*   **Styling & UI:** Tailwind CSS combined with shadcn/ui (Radix UI) for a highly customizable, accessible, and beautiful design system.
*   **State & Data Management:** TanStack React Query for efficient server-state management and caching.
*   **Backend & Database:** Supabase (PostgreSQL, Authentication, Real-time subscriptions, and Storage).
*   **Animations:** Framer Motion for premium interactions and fluid layouts.
*   **Data Visualization:** Recharts for admin dashboard analytics.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and a package manager installed. You can use `npm` or `bun` (recommended, as a `bun.lock` is present).

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd hms-hq8x
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Set up Environment Variables:
   Create a `.env` file in the root directory (or use the existing one) and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```
5. Open your browser and visit `http://localhost:8080` (or the port specified by Vite in the terminal output).

## 📁 Project Structure

*   `src/pages/` - Core page components split across Public, Guest (`/my-stay`), and Admin routes.
*   `src/components/` - Reusable UI components including base shadcn elements, layouts, and feature-specific components.
*   `src/contexts/` - Global state providers (e.g., `AuthContext`).
*   `src/integrations/` - Third-party API setups, predominantly Supabase clients and types.
*   `src/hooks/` - Custom React hooks for shared logic.
*   `src/lib/` - Utility functions and helpers.
*   `src/App.tsx` - Main application routing and provider setup.

## 🤝 Contributing
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License
All rights reserved by HQ8X.
