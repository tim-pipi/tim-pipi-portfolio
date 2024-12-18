"use client"

import React from 'react'
import { Menu } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className="w-full fixed top-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Timothy Putra Prasetio</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-gray-900">About</a>
            <a href="#projects" className="text-gray-700 hover:text-gray-900">Projects</a>
            <a href="#skills" className="text-gray-700 hover:text-gray-900">Skills</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden px-2 pb-3">
            <a href="#about" className="block py-2 text-gray-700 hover:text-gray-900">About</a>
            <a href="#projects" className="block py-2 text-gray-700 hover:text-gray-900">Projects</a>
            <a href="#skills" className="block py-2 text-gray-700 hover:text-gray-900">Skills</a>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-gray-900">Contact</a>
          </nav>
        )}
      </div>
    </header>
  )
}