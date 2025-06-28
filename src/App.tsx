
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Offers from './pages/Offers';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminSalesAnalytics from './pages/AdminSalesAnalytics';
import SellerListItem from './pages/SellerListItem';
import SellerVerification from './pages/SellerVerification';
import AdminPostProduct from './pages/AdminPostProduct';
import AdminOfferCreate from './pages/AdminOfferCreate';
import Support from './pages/Support';
import CustomerSupport from './pages/CustomerSupport';
import ProductAuction from './pages/ProductAuction';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingReturns from './pages/ShippingReturns';
import Profile from './pages/Profile';
import AdminAuth from './components/admin/AdminAuth';

import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/seller-dashboard" element={<SellerDashboard />} />
                <Route path="/seller-list-item" element={<SellerListItem />} />
                <Route path="/seller-verification" element={<SellerVerification />} />
                <Route path="/support" element={<Support />} />
                <Route path="/customer-support" element={<CustomerSupport />} />
                <Route path="/auction/:auctionId" element={<ProductAuction />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Admin Routes - Protected by AdminAuth */}
                <Route element={<AdminAuth />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin-sales-analytics" element={<AdminSalesAnalytics />} />
                  <Route path="/admin-post-product" element={<AdminPostProduct />} />
                  <Route path="/admin-offer-create" element={<AdminOfferCreate />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
