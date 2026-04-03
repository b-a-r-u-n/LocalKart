import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg mb-4">LocalKart</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your one-stop destination for all your shopping needs. Quality products at the best prices.
            </p>
            {/* <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help-center"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/returns-refunds"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-info"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>new delhi</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={16} className="flex-shrink-0" />
                <span>1234567890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} className="flex-shrink-0" />
                <span>support@localkart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
