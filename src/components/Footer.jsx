import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin, Globe, MessageSquare, Video, ExternalLink } from 'lucide-react';
import logoConsejo from '../assets/logo-consejo.jpg';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        {/* Column 1: Institutional Intro */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src={logoConsejo} alt="Logo Consejo" />
            <span className="serif-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Concejo Deliberante</span>
          </div>
          <p className="footer-desc" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Órgano legislativo municipal comprometido con la transparencia activa, la participación vecinal y el desarrollo democrático sustentable de nuestra ciudad.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="#" className="social-icon-btn" aria-label="Facebook"><Globe size={20} /></a>
            <a href="#" className="social-icon-btn" aria-label="Youtube"><Video size={20} /></a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="footer-col">
          <h4 className="footer-title">Mapa del Sitio</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/concejales">Nuestros Concejales</Link></li>
            <li><Link to="/agenda">Agenda de Sesiones</Link></li>
            <li><Link to="/comisiones">Comisiones</Link></li>
            <li><Link to="/normativas">Digesto Jurídico</Link></li>
            <li><Link to="/reglamento">Reglamento Interno</Link></li>
            <li><Link to="/tramites">Mesa de Entradas</Link></li>
          </ul>
        </div>

        {/* Column 3: Useful Resources */}
        <div className="footer-col">
          <h4 className="footer-title">Gobierno Abierto</h4>
          <ul className="footer-links">
            <li>
              <Link to="/en-construccion" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Boletín Oficial <ExternalLink size={12} />
              </Link>
            </li>
            <li>
              <Link to="/en-construccion" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Presupuesto Participativo <ExternalLink size={12} />
              </Link>
            </li>
            <li>
              <Link to="/en-construccion" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Municipalidad Digital <ExternalLink size={12} />
              </Link>
            </li>
            <li>
              <Link to="/en-construccion" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Transmisiones En Vivo <ExternalLink size={12} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact details */}
        <div className="footer-col">
          <h4 className="footer-title">Contacto Oficial</h4>
          <ul className="footer-contact-list" style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <MapPin size={18} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              <span>Lidoro Quinteros - Juan Bautista Alberdi</span>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Phone size={18} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              <span>+54 (381) 888-8888</span>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Mail size={18} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              <a href="mailto:info@consejo.gob.ar" style={{ color: 'inherit' }}>info@consejo.gob.ar</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom" style={{ borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        <div className="container footer-bottom-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>&copy; {currentYear} Honorable Concejo Deliberante. Todos los derechos reservados.</span>
          <span>Desarrollado para la Transparencia y Participación Ciudadana</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
