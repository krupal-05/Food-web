import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                Food<span className="text-orange-500">X</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Connecting food enthusiasts with the best local restaurants. Hot, chef-crafted meals delivered right to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-500 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-500 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-500 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Explore</h4>
            <Link to="/" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
              Full Food Menu
            </Link>
            <Link to="/about" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
              About Us
            </Link>
            <Link to="/menu?category=Pizza" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
              Gourmet Pizzas
            </Link>
            <Link to="/menu?category=Burger" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
              Juicy Burgers
            </Link>
          </div>

          {/* Partner & Portals */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">For Partners</h4>
            <Link to="/register?role=restaurantOwner" className="text-sm text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1">
              <span>Partner With Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/owner/dashboard" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
              Merchant Kitchen
            </Link>
            <Link to="/admin/login" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
              Admin Portal
            </Link>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Contact</h4>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-orange-500" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-orange-500" />
              <span>support@foodx.io</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Cyber Hub, Gurugram, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FoodX Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for delicious food experiences
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
