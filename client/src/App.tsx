import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./features/home/Home";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Shop from "./features/shop/Shop";
import ProductDetail from "./features/products/ProductDetail";
import Cart from "./features/cart/Cart";
import Checkout from "./features/checkout/Checkout";
import OrderSuccess from "./features/checkout/OrderSuccess";
import Wishlist from "./features/wishlist/Wishlist";
import Discover from "./features/discover/Discover";
import BodyProfile from "./features/profile/BodyProfile";
import DesignStudio from "./features/design/DesignStudio";
import Closet from "./features/closet/Closet";
import Stylist from "./features/stylist/Stylist";
import MyOrders from "./features/orders/MyOrders";
import AccountLayout from "./features/account/AccountLayout";
import AccountOverview from "./features/account/AccountOverview";
import { AccountAddresses, AccountDesigns, AccountSettings, AccountStyle } from "./features/account/AccountPanels";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminProducts from "./features/admin/AdminProducts";
import AddProduct from "./features/admin/AddProduct";
import AdminOrders from "./features/admin/AdminOrders";
import { AdminAnalytics, AdminCustomers, AdminInventory } from "./features/admin/AdminExtra";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import Toasts from "./components/ui/Toasts";
import { AdminRoute, ProtectedRoute } from "./components/auth/Guards";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import { usePrefStore } from "./store/preferenceStore";
import EditProduct from "./features/admin/EditProduct";

function Shell() {
  const { user, hydrate, hydrated, logout } = useAuthStore();
  const fetchCart = useCartStore((s) => s.fetch);
  const bindUser = usePrefStore((s) => s.bindUser);
  const location = useLocation();
  const admin = location.pathname.startsWith("/admin");

  useEffect(() => {
    hydrate();
    const onExpired = () => {
      logout();
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [hydrate, logout]);

  useEffect(() => {
    bindUser(user?.id || null);
    if (user) fetchCart();
  }, [user, bindUser, fetchCart]);

  return (
    <div className="min-h-screen flex flex-col bg-bone">
      {!admin && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/design" element={<DesignStudio />} />
          <Route path="/stylist" element={<Stylist />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<BodyProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/my-orders" element={<Navigate to="/account/orders" replace />} />
          <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="profile" element={<BodyProfile />} />
            <Route path="style" element={<AccountStyle />} />
            <Route path="designs" element={<AccountDesigns />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
          </Route>
        </Routes>
      </main>
      {!admin && <Footer />}
      <CartDrawer />
      <Toasts />
      {!hydrated && <span className="sr-only">Loading session</span>}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
