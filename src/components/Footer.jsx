import React from "react";
import { Link } from "react-router-dom";
import { portfolio } from "../data/portfolio.js";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {portfolio.profile.name}
            </h3>
            <p className="text-white/60 text-sm">{portfolio.profile.role}</p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">Links</p>
            <div className="space-y-1">
              <a href="#projects" className="block text-white/60 hover:text-white transition text-sm">
                Projects
              </a>
              <a href="#contact" className="block text-white/60 hover:text-white transition text-sm">
                Contact
              </a>
              <a href="/resume" className="block text-white/60 hover:text-white transition text-sm">
                Resume
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">Legal</p>
            <div className="space-y-1">
              <Link to="/privacy" className="block text-white/60 hover:text-white transition text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-white/60 hover:text-white transition text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © {currentYear} {portfolio.profile.name}. All rights reserved.
          </p>
          <p className="text-white/60 text-sm">
            {portfolio.footer?.text || "Crafted with ❤️ using React & Firebase"}
          </p>
        </div>
      </div>
    </footer>
  );
}