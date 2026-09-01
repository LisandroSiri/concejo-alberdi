import React, { useState, useEffect, useCallback } from 'react';
import './Admin.css';

// Import subcomponents
import LoginOverlay from '../components/admin/LoginOverlay';
import DashboardSection from '../components/admin/DashboardSection';
import NormasSection from '../components/admin/NormasSection';
import TemasSection from '../components/admin/TemasSection';
import ConcejalesSection from '../components/admin/ConcejalesSection';
import BloquesSection from '../components/admin/BloquesSection';
import SeguimientosSection from '../components/admin/SeguimientosSection';
import CatalogosSection from '../components/admin/CatalogosSection';
import UsuariosSection from '../components/admin/UsuariosSection';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOAST_DURATION = 4000;

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast System
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      // Fade out effect simulation: remove from list
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  // API Client Helper
  const api = useCallback(
    async (method, path, body, isFile = false) => {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (!isFile) headers['Content-Type'] = 'application/json';

      const opts = { method, headers };
      if (body) opts.body = isFile ? body : JSON.stringify(body);

      const res = await fetch(`${API_BASE_URL}${path}`, opts);

      if (res.status === 401) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        showToast('Sesión expirada', 'error');
        throw new Error('Sesión expirada');
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || res.statusText);
      }

      if (res.status === 204) return null;
      return res.json();
    },
    [token, showToast]
  );

  // Authenticate & Decode JWT Token
  const initUser = useCallback(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        showToast('✅ Sesión restaurada', 'success');
      } catch (err) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  }, [token, showToast]);

  useEffect(() => {
    initUser();
  }, [initUser]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    showToast('✅ Sesión iniciada correctamente', 'success');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    showToast('👋 Sesión cerrada', 'info');
  };

  const handleNavigation = (section) => {
    setCurrentSection(section);
    setMobileOpen(false);
  };

  // Utility helpers passed to sections
  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const badge = (type, text) => {
    const map = {
      ORDENANZA: 'badge-ordenanza',
      DECRETO: 'badge-decreto',
      RESOLUCION: 'badge-resolucion',
      COMUNICACION: 'badge-comunicacion',
      ADMIN: 'badge-admin',
      OPERADOR: 'badge-operador',
      true: 'badge-vigente',
      false: 'badge-no-vigente',
      activo: 'badge-activo',
      inactivo: 'badge-inactivo',
    };
    const cls = map[String(type).toUpperCase()] || map[String(type).toLowerCase()] || 'badge-operador';
    return `<span class="badge ${cls}">${text || type}</span>`;
  };

  const truncate = (str, max = 40) => {
    if (!str) return '—';
    return str.length > max ? str.slice(0, max) + '…' : str;
  };

  // Render correct panel section based on state
  const renderActiveSection = () => {
    const props = { api, userRole: user?.rol, badge, formatDate, truncate, showToast };
    switch (currentSection) {
      case 'dashboard':
        return <DashboardSection {...props} />;
      case 'normas':
        return <NormasSection {...props} />;
      case 'temas':
        return <TemasSection {...props} />;
      case 'concejales':
        return <ConcejalesSection {...props} />;
      case 'bloques':
        return <BloquesSection {...props} />;
      case 'seguimientos':
        return <SeguimientosSection {...props} />;
      case 'catalogos':
        return <CatalogosSection {...props} />;
      case 'usuarios':
        return <UsuariosSection {...props} />;
      default:
        return <DashboardSection {...props} />;
    }
  };

  // Render Auth Check
  if (!token || !user) {
    return (
      <div className="admin-panel-root">
        <LoginOverlay api={api} onLoginSuccess={handleLoginSuccess} />
        {/* Toast List */}
        <div className="toast-container" id="toasts">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-root">
      {/* ─── TOAST CONTAINER ─── */}
      <div className="toast-container" id="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* ─── HEADER ─── */}
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            ☰
          </button>
          <div className="brand">
            <div className="brand-icon">⚖</div>
            <span>Concejo Alberdi</span>
          </div>
        </div>
        <div className="header-actions">
          <span className="user-badge" id="user-badge">
            👤 <span id="user-name">{`${user.rol} · ${user.email}`}</span>
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="app-layout">
        {/* ─── SIDEBAR ─── */}
        <nav id="sidebar" className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
          <span className="nav-label">General</span>
          <a
            className={currentSection === 'dashboard' ? 'active' : ''}
            onClick={() => handleNavigation('dashboard')}
          >
            <span className="icon">📊</span> Dashboard
          </a>

          <span className="nav-label">Normativa</span>
          <a
            className={currentSection === 'normas' ? 'active' : ''}
            onClick={() => handleNavigation('normas')}
          >
            <span className="icon">📄</span> Normas
          </a>
          <a
            className={currentSection === 'temas' ? 'active' : ''}
            onClick={() => handleNavigation('temas')}
          >
            <span className="icon">🏷️</span> Temas
          </a>

          <span className="nav-label">Actores</span>
          <a
            className={currentSection === 'concejales' ? 'active' : ''}
            onClick={() => handleNavigation('concejales')}
          >
            <span className="icon">👤</span> Concejales
          </a>
          <a
            className={currentSection === 'bloques' ? 'active' : ''}
            onClick={() => handleNavigation('bloques')}
          >
            <span className="icon">🏛️</span> Bloques
          </a>

          <span className="nav-label">Seguimiento</span>
          <a
            className={currentSection === 'seguimientos' ? 'active' : ''}
            onClick={() => handleNavigation('seguimientos')}
          >
            <span className="icon">📋</span> Seguimientos
          </a>
          <a
            className={currentSection === 'catalogos' ? 'active' : ''}
            onClick={() => handleNavigation('catalogos')}
          >
            <span className="icon">⚙️</span> Catálogos
          </a>

          {user.rol === 'ADMIN' && (
            <>
              <span className="nav-label">Sistema</span>
              <a
                className={currentSection === 'usuarios' ? 'active' : ''}
                onClick={() => handleNavigation('usuarios')}
              >
                <span className="icon">🔐</span> Usuarios
              </a>
            </>
          )}

          <div className="nav-spacer"></div>
          <span style={{ fontSize: '0.6rem', color: 'var(--admin-text-muted)', padding: '0.75rem' }}>
            v1.0.0 (React Migrated)
          </span>
        </nav>

        {/* ─── MAIN CONTENT ─── */}
        <main className="admin-main">{renderActiveSection()}</main>
      </div>
    </div>
  );
};

export default Admin;
