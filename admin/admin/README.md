# Admin App Documentation

## 📋 Overview

The admin system is now a **standalone, independent application** completely separate from the user-facing Coffee Shop website.

## 🚀 Usage

### Running the User App (Default)

```bash
npm run dev
```

This runs the main app from `src/main.jsx` → `src/App.jsx`

**Access:** `http://localhost:5173/`

### Running the Admin App

To run only the admin app, update your `vite.config.js` to use `src/admin-main.jsx` as the entry point:

```javascript
// In vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
  },
  server: {
    historyApiFallback: true,
  },
});
```

Then update package.json:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:admin": "vite --entry src/admin-main.jsx",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Access:** `http://localhost:5173/`

### Demo Credentials

- Username: `admin`
- Password: `admin123`

---

## 📁 Admin App Structure

```
src/admin/
├── AdminApp.jsx              ← Main admin app entry (separate from App.jsx)
├── pages/
│   ├── AdminLogin.jsx        ← Login page
│   ├── Dashboard.jsx         ← Dashboard with statistics
│   ├── Categories.jsx        ← Category management
│   ├── Products.jsx          ← Product management
│   ├── Inventory.jsx         ← Inventory tracking
│   ├── GoodsReceipt.jsx       ← Goods receipt history
│   ├── Orders.jsx            ← Order management
│   ├── Users.jsx             ← User management
│   ├── Settings.jsx          ← System settings
│   └── Index.jsx             ← Auto-redirect to dashboard/login
├── layouts/
│   └── AdminLayout.jsx       ← Main layout with sidebar + topbar
├── components/
│   ├── Sidebar.jsx           ← Collapsible navigation
│   └── TopBar.jsx            ← Top bar with user info
└── context/
    └── AdminContext.jsx      ← Auth context
```

---

## 🌐 Routes (Admin App)

| Route            | Description                    |
| ---------------- | ------------------------------ |
| `/login`         | Admin login page               |
| `/`              | Redirect to dashboard or login |
| `/dashboard`     | Main dashboard                 |
| `/categories`    | Category management            |
| `/products`      | Product management             |
| `/inventory`     | Inventory management           |
| `/goods-receipt` | Goods receipt tracking         |
| `/orders`        | Order management               |
| `/users`         | User account management        |
| `/settings`      | System settings & vouchers     |

---

## ✨ Key Features

✅ **Completely Separate**: Admin app is independent from user app
✅ **Clean Routing**: Dedicated `AdminApp.jsx` with its own routing
✅ **Authentication**: Admin login with session storage
✅ **CRUD Operations**: Add/Edit/Delete for all resources
✅ **Responsive UI**: Collapsible sidebar, professional design
✅ **Real-time Data**: Status updates and statistics
✅ **Tailwind CSS**: Fully styled with Tailwind

---

## 🔧 Customization

### To modify admin routes:

Edit `src/admin/AdminApp.jsx`

### To modify authentication:

Edit `src/admin/context/AdminContext.jsx`

### To add new admin pages:

1. Create component in `src/admin/pages/`
2. Import in `src/admin/AdminApp.jsx`
3. Add route to the Routes section
