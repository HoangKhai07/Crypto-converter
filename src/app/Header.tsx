'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeContext } from "@/app/ThemeContext";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const themeContext = useContext(ThemeContext);

  useEffect(()=> {
    setMounted(true)
  }, [])

  if(!themeContext) return null

  const { theme, toggleTheme } = themeContext;

  return (
    <header className='bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'>
      <div className='container mx-auto px-4'>
        <nav className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='text-3xl ml-8 font-bold'>
            <Link href='/'>Crypto Converter</Link>
          </div>

          {/* Desktop Navigation */}
          <ul className='hidden md:flex gap-12 mr-10 font-medium text-xl'>
            <li>
              <Link 
                href='/' 
                prefetch={true}
                className='hover:text-yellow-300 border-b border-transparent hover:border-yellow-300 transition-all duration-300'
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href='/history' 
                prefetch={true}
                className='hover:text-yellow-300 border-b border-transparent hover:border-yellow-300 transition-all duration-300'
              >
                History
              </Link>
            </li>
            <li>
              <Link 
                href='/about' 
                prefetch={true}
                className='hover:text-yellow-300 border-b border-transparent hover:border-yellow-300 transition-all duration-300'
              >
                About
              </Link>
            </li>

            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === 'dark' ? 
                  <MdOutlineDarkMode size={25}/> : 
                  <MdOutlineLightMode size={25}/>
                }
              </button>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button 
              onClick={() => setIsNavOpen(!isNavOpen)}
              className='focus:outline-none transform hover:scale-110 transition-transform duration-200'
              aria-label={isNavOpen ? "Đóng menu" : "Mở menu"}
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isNavOpen && (
          <div className='md:hidden'>
            {/* Backdrop */}
            <div 
              className='fixed inset-0 bg-black bg-opacity-50 z-40'
              onClick={() => setIsNavOpen(false)}
            ></div>
            
            {/* Menu Panel */}
            <ul className='absolute top-16 left-0 right-0 bg-white text-gray-800 shadow-lg z-50 overflow-hidden transition-all duration-300 ease-in-out'>
              <div className='px-4 py-2 flex items-center'>
                <span className='text-lg font-semibold'>Menu</span>
                <button 
                  onClick={() => setIsNavOpen(false)}
                  className='ml-auto text-2xl font-bold text-gray-600 hover:text-gray-900'
                >
                  ×
                </button>
              </div>
              <li>
                <Link 
                  href='/' 
                  onClick={() => setIsNavOpen(false)}
                  className='block px-4 py-3 hover:bg-gray-100 transition-colors'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href='/history' 
                  onClick={() => setIsNavOpen(false)}
                  className='block px-4 py-3 hover:bg-gray-100 transition-colors'
                >
                  History
                </Link>
              </li>
              <li>
                <Link 
                  href='/about' 
                  onClick={() => setIsNavOpen(false)}
                  className='block px-4 py-3 hover:bg-gray-100 transition-colors'
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}