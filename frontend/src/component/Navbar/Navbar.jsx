import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { LightMode, DarkMode, Menu, Close } from '@mui/icons-material'
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import logo from '../../assets/logo/pplogo.png'


const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Map', path: '/map' },
  {
    name: 'PariKrama', path: '/parikrama',
    sublinks: [
      {
        name: 'By Zone', path: '/parikrama/by-zone',
        sublinks: [
          { name: 'North Kolkata', path: '/parikrama/by-zone/north-kolkata' },
          { name: 'South Kolkata', path: '/parikrama/by-zone/South-kolkata' },
          { name: 'North East City', path: '/parikrama/by-zone/north-east-city' },
          { name: 'Behala', path: '/parikrama/by-zone/behala' },
          { name: 'HaridevPur & Others', path: '/parikrama/by-zone/haridevpur' },
          { name: 'SaltLake', path: '/parikrama/by-zone/SaltLake' },
        ],
      },
      { name: 'Bonedi Bari Pujas', path: '/parikrama/bonedi-bari-pujas' },
    ],
  },
  {
    name: 'Gallery',
    path: '/gallery',
    sublinks: [
      { name: 'Photos', path: '/gallery/photos' },
      { name: 'Videos', path: '/gallery/videos' },
    ],
  },
  { name: 'Awards', path: '/awards' },
  { name: 'Artist Collection', path: '/artists' },
  { name: 'Schedule', path: '/schedule' },
  {
    name: 'About', path: '/about'
  },
]

const Navbar = () => {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openMobileSubDropdown, setOpenMobileSubDropdown] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') setDarkMode(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const renderMobileLinks = (links, level = 1) => (
    <div className={`pl-${level * 4} mt-2 space-y-1`}>
      {links.map((link) => (
        <div key={link.name}>
          <Link
            to={link.path}
            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-700"
          >
            {link.name}
          </Link>
          {link.sublinks && renderMobileLinks(link.sublinks, level + 1)}
        </div>
      ))}
    </div>
  )

  return (
    <nav className="sticky top-0 z-100 bg-gray-100 dark:bg-neutral-900 border-b border-gray-300 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/"><img src={logo} alt="Praner Pujo Logo" className="h-12 w-auto object-contain" /></Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 relative">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className={`font-medium ${location.pathname === link.path ? 'text-red-600' : 'text-gray-700'
                    } hover:text-red-600 dark:text-white  transition-colors`}
                >
                  {link.name}
                </Link>

                {/* First-level dropdown */}
                {link.sublinks && (
                  <div className="absolute left-0 mt-4 w-48 bg-white  dark:bg-neutral-900 rounded-lg shadow-lg py-2 z-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {link.sublinks.map((sublink) => (
                      <div key={sublink.name} className="relative group/sub">
                        <Link
                          to={sublink.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                          {sublink.name}
                        </Link>

                        {/* Second-level dropdown (flyout to right) */}
                        {sublink.sublinks && (
                          <div className="absolute top-0 left-full ml-0 w-48 bg-white  dark:bg-neutral-900 rounded-lg shadow-lg py-2 z-100 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                            {sublink.sublinks.map((subsub) => (
                              <Link
                                key={subsub.name}
                                to={subsub.path}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                              >
                                {subsub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <div className="hidden md:flex items-center">
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <LightMode className="text-yellow-400" />
              ) : (
                <DarkMode className="text-gray-700" />
              )}
            </IconButton>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center md:hidden">
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <LightMode className="text-yellow-400" />
              ) : (
                <DarkMode className="text-gray-700" />
              )}
            </IconButton>

            <IconButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <Close className="text-gray-700 dark:text-white" />
              ) : (
                <Menu className="text-gray-700 dark:text-white" />
              )}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-950 px-4 py-4 space-y-2">
          {navLinks.map((link, index) => (
            <div key={link.name}>
              {/* First-level link */}
              <div
                className="flex justify-between items-center font-medium text-gray-700 dark:text-white hover:text-red-600 cursor-pointer"
                onClick={() =>
                  setOpenMobileDropdown(openMobileDropdown === index ? null : index)
                }
              >
                <Link to={link.path}>{link.name}</Link>
                {link.sublinks && (
                  <span className="ml-2">
                    {openMobileDropdown === index ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                )}
              </div>

              {/* First-level sublinks */}
              {link.sublinks && openMobileDropdown === index && (
                <div className="pl-4 mt-2 space-y-1">
                  {link.sublinks.map((sublink, subIndex) => (
                    <div key={sublink.name}>
                      <div
                        className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 cursor-pointer"
                        onClick={() =>
                          setOpenMobileSubDropdown(
                            openMobileSubDropdown === subIndex ? null : subIndex
                          )
                        }
                      >
                        <Link to={sublink.path}>{sublink.name}</Link>
                        {sublink.sublinks && (
                          <span className="ml-2">
                            {openMobileSubDropdown === subIndex ? (
                              <FaAngleUp />
                            ) : (
                              <FaAngleDown />
                            )}
                          </span>
                        )}
                      </div>

                      {/* Second-level sublinks */}
                      {sublink.sublinks && openMobileSubDropdown === subIndex && (
                        <div className="pl-8 mt-2 space-y-1">
                          {sublink.sublinks.map((subsub) => (
                            <Link
                              key={subsub.name}
                              to={subsub.path}
                              className="block text-sm text-gray-500 dark:text-gray-400 hover:text-red-600"
                            >
                              {subsub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}


    </nav>
  )
}

export default Navbar
