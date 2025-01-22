# My Airbnb Clone (Enhanced UI/UX + Simple Dropdown Search)

This is an **Airbnb-like application** built with Next.js, Tailwind CSS, 
and a local JSON server for sample data. It features a **simple, on-page 
search bar dropdown** that expands to show filters (location, date, price, 
amenities) **without** navigating to a separate page or calling external APIs.

## Key Features

- **Sticky Header** with a minimal Airbnb-like logo and refined styling.
- **Dropdown Search Bar** that expands inline to reveal multiple filters.
- **Hero Section** with an eye-catching background image & gradient overlay.
- **Consistent, Modern Design**: improved spacing, typography, and transitions.
- **Dark Mode** with consistent color usage.
- **JSON Server** for local data at `http://localhost:5000`.
- Optional **Storybook** and **Jest** for testing.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

3. **Run JSON Server**:
   ```bash
   npm run server
   # or
   yarn server
   ```
   Visit [http://localhost:5000](http://localhost:5000).

4. **Testing**:
   ```bash
   npm run test
   ```
5. **Storybook**:
   ```bash
   npm run storybook
   ```
   Visit [http://localhost:6006](http://localhost:6006).

## Environment Variables
Create a `.env.local` (optional for map/payment):
```
MAPBOX_API_KEY=YOUR_MAPBOX_API_KEY
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
JWT_SECRET=MY_SUPER_SECRET
```

## Notes
- For demonstration, data is fetched from `localhost:5000` using JSON Server.
- If you want to integrate with a real external API, you can replace 
  local endpoints accordingly.
- The **search bar** is purely UI-based; 
  "Apply Filters" closes the dropdown without filtering.

**Enjoy your new and improved, fully responsive Airbnb-like clone with an on-page dropdown search!**
