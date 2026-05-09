import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminBanners } from './pages/admin/Banners';
import { AdminLogin } from './pages/admin/Login';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer Facing Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="banners" element={<AdminBanners />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
