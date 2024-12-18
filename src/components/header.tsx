'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="w-full fixed top-0 bg-white/80 backdrop-blur-sm border-b border-black/5 dark:bg-gray-950/75 dark:border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold font-mono"
            >
              Timothy Putra Prasetio
            </motion.span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map(
              (item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
                >
                  {item}
                </motion.a>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-2 pb-3"
          >
            {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              )
            )}
          </motion.nav>
        )}
      </div>
    </header>
  );
}
