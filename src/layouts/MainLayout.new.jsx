import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function MainLayout() {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Announcement Bar */}
      <div className="bg-dark text-white text-center py-2 px-4">
        <p className="text-xs md:text-sm">
          Free Delivery on orders over $120. Don't miss discount.
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Left Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm hover:text-gray-600 transition">
                Home
              </Link>
              <Link to="/products" className="text-sm hover:text-gray-600 transition">
                Shop
              </Link>
              <a href="#blog" className="text-sm hover:text-gray-600 transition">
                News
              </a>
              <a href="#about" className="text-sm hover:text-gray-600 transition">
                About us
              </a>
            </nav>

            {/* Logo - Centered */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none">
              <span className="text-2xl md:text-3xl font-serif text-dark">
                Xstore
              </span>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Search Icon */}
              <button className="text-dark hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* User Icon */}
              <Link to="/profile" className="text-dark hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Cart Icon with Count */}
              <Link to="/cart" className="relative text-dark hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-dark text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-sans">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-dark"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-sm hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/products" className="text-sm hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  Shop
                </Link>
                <a href="#blog" className="text-sm hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  News
                </a>
                <a href="#about" className="text-sm hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  About us
                </a>
                <a href="#more" className="text-sm hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  More
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Social Sidebar - Desktop Only */}
      <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col space-y-4">
          <a href="#" className="text-dark hover:text-gray-600" title="Behance">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
          </a>
          <a href="#" className="text-dark hover:text-gray-600" title="Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          <a href="#" className="text-dark hover:text-gray-600" title="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="#" className="text-dark hover:text-gray-600" title="Telegram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 13.477l1.39 4.598 2.527-2.356 4.948 3.651.934-7.953-9.799 2.06zm8.678-6.427l-11.644 3.044c-.271.071-.457.322-.457.6 0 .279.186.53.457.6l2.978.782 1.149 3.788c.066.218.267.366.495.366.154 0 .299-.074.393-.198l1.496-1.968 4.157 3.071c.238.176.563.13.748-.105.073-.093.121-.206.139-.327l2.227-11.946c.055-.295-.152-.577-.449-.632-.09-.017-.183-.017-.274 0l-.415-.091z"/>
            </svg>
          </a>
          <a href="#" className="text-dark hover:text-gray-600" title="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* About */}
            <div>
              <h3 className="text-base md:text-lg font-serif mb-4 md:mb-6">About</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Our Story</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Sustainability</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-base md:text-lg font-serif mb-4 md:mb-6">Products</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">All Styles</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Latest Drops</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Clearance</a></li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-base md:text-lg font-serif mb-4 md:mb-6">Shop</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">All Products</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">New Arrivals</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Sale</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-base md:text-lg font-serif mb-4 md:mb-6">Help</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Shipping</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Returns</a></li>
                <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex justify-center items-center space-x-6">
              <p className="text-sm mr-4">Follow us</p>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-xs md:text-sm text-gray-400">
              Copyright © Xstore Theme. Created by 8theme – Premium WooCommerce Themes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4">
              <a href="#" className="text-xs text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-xs text-gray-400 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-xs text-gray-400 hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
