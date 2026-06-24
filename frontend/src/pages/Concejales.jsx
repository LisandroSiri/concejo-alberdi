import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, Award, Phone } from 'lucide-react';
import { Facebook, Instagram } from '../components/SocialIcons';
import './Concejales.css';

const Concejales = () => {
  const [selectedBlock, setSelectedBlock] = useState('Todos');

   const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const blocks = ['Todos', 'Cambia Alberdi', 'Bloque Tucumán Primero', 'Bloque Alberdi Primero', 'Bloque Justicia y Kompromiso', 'Construyendo Futuro', 'Trabajando por Alberdi'];

  const concejalesList = [
    {
      id: 1,
      name: "José Romano",
      role: "Presidente",
      block: "Bloque Tucumán Primero",
      email: "joseromano@concejo.com.ar",
      phone: "",
      image: "src/assets/concejales/presidente.png",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 2,
      name: "Adolfo Diaz Chavero",
      role: "Vicepresidente 1º",
      block: "Cambia Alberdi",
      email: "chavero@concejo.com.ar",
      phone: "+54 (381) 455-6678",
      image: "src/assets/concejales/cocejal2.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 3,
      name: "Cintia Melik Matar",
      role: "Vicepresidente 2º",
      block: "Construyendo Futuro",
      email: "cmelikmatar@concejo.com.ar",
      phone: "+54 (381) 455-6679",
      image: "src/assets/concejales/default.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 4,
      name: "Martina Siri",
      role: "Concejal",
      block: "Cambia Alberdi",
      email: "martinasiri@concejo.com.ar",
      phone: "+54 (381) 455-6680",
      image: "/src/assets/concejales/concejal1.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 5,
      name: "Ana Campos",
      role: "Concejal",
      block: "Bloque Tucumán Primero",
      email: "anacampos@concejo.com.ar",
      phone: "+54 (381) 455-6681",
      image: "src/assets/concejales/default.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 6,
      name: "José Calderón",
      role: "Concejal",
      block: "Bloque Alberdi Primero",
      email: "josecalderon@concejo.com.ar",
      phone: "+54 (381) 455-6682",
      image: "src/assets/concejales/concejal4.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 7,
      name: "Ramiro Aguilera",
      role: "Concejal",
      block: "Cambia Alberdi",
      email: "ramiroaguilera@concejo.com.ar",
      phone: "+54 (381) 455-6678",
      image: "src/assets/concejales/concejal3.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 8,
      name: "Sergio Muray",
      role: "Concejal",
      block: "Bloque Justicia y Kompromiso",
      email: "sergiomuray@concejo.com.ar",
      phone: "+54 (381) 455-6678",
      image: "src/assets/concejales/concejal5.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 9,
      name: "Nanci Cuenca",
      role: "Concejal",
      block: "Trabajando por Alberdi",
      email: "nancycuenca@concejo.com.ar",
      phone: "+54 (381) 455-6678",
      image: "src/assets/concejales/default.jpg",
      socials: { facebook: "#", instagram: "#" }
    },
    {
      id: 10,
      name: "Marcelo Ogas",
      role: "Concejal",
      block: "Bloque Tucumán Primero",
      email: "marceloogas@concejo.com.ar",
      phone: "+54 (381) 455-6678",
      image: "src/assets/concejales/default.jpg",
      socials: { facebook: "#", instagram: "#" }
    }
  ];

  const filteredConcejales = selectedBlock === 'Todos'
    ? concejalesList
    : concejalesList.filter(c => c.block === selectedBlock);

  return (
    <motion.div
      className="concejales-page container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-title">
        <span className="badge badge-primary">Cuerpo Legislativo</span>
        <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Nuestros Concejales</h2>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-container">
        <div className="filter-tabs">
          {blocks.map((block) => (
            <button
              key={block}
              className={`filter-btn ${selectedBlock === block ? 'active' : ''}`}
              onClick={() => setSelectedBlock(block)}
            >
              {block}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Councillors */}
      <div
        className="grid grid-3"
        style={{ marginTop: '2rem' }}
      >
        <AnimatePresence mode="wait">
          {filteredConcejales.map((c) => (
            <motion.div 
              key={c.id}
              className="card concejal-card"
              layout= "position"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="concejal-header">
                <img src={c.image} alt={c.name} className="concejal-photo" />
                <div className="concejal-meta">
                  <span className="concejal-badge">{c.role}</span>
                  <span className="concejal-block-badge">{c.block}</span>
                </div>
              </div>

              <div className="concejal-body">
                <h3 className="serif-title">{c.name}</h3>

                <div className="concejal-contact">
                  <div className="contact-item">
                    <Mail size={16} />
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </div>
                  <div className="contact-item">

                  </div>
                </div>

                {c.socials && (
                  <div className="concejal-socials" style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem', marginBottom: '1rem' }}>
                    {c.socials.facebook && <a href={c.socials.facebook} className="social-link" style={{ color: 'var(--text-muted)' }}><Facebook size={18} /></a>}
                    {c.socials.instagram && <a href={c.socials.instagram} className="social-link" style={{ color: 'var(--text-muted)' }}><Instagram size={18} /></a>}
                  </div>
                )}


              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Concejales;
