import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Facebook, Instagram } from './SocialIcons';
import logoConsejo from '../assets/logo-consejo.jpg';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Check initial preference (strictly light mode as default primary)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
    }
    return 'light';
  });

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/concejales', label: 'Concejales' },
    { path: '/agenda', label: 'Agenda' },
    { path: '/comisiones', label: 'Comisiones' },
    { path: '/normativas', label: 'Digesto' },
    { path: '/reglamento', label: 'Reglamento' },
    { path: '/tramites', label: 'Mesa de Entrada' },
  ];

  return (
    <header className="glass main-header">
      <div className="container header-container">
        {/* Logo Branding */}
        <Link to="/" className="brand-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-icon-wrapper">
            <img src={logoConsejo} alt="Honorable Concejo Deliberante" className="header-logo-img" />
          </div>
          <div className="brand-text">
            <span className="brand-title serif-title">Concejo Deliberante</span>
            <span className="brand-subtitle">Portal Oficial Legislativo</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  end={link.path === '/'}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          className="active-indicator"
                          layoutId="activeNavIndicator"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme and Drawer controls */}
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Alternar tema"
          >
            <motion.div
              key={theme}
              initial={{ y: -10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
          </button>

          {/* Hamburger button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu principal"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav-drawer glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                    end={link.path === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
