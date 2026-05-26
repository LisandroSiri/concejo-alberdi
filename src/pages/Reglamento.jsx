import React from 'react';
import { motion } from 'framer-motion';
import { Book, Download } from 'lucide-react';
import './Reglamento.css';

const Reglamento = () => {
  return (
    <motion.div
      className="reglamento-page container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-title">
        <span className="badge badge-primary">Marco Normativo</span>
        <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Reglamento Interno</h2>
        <p>Normas y procedimientos que rigen el funcionamiento del Honorable Concejo Deliberante.</p>

        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-primary">
            <Download size={18} /> Descargar PDF
          </button>
        </div>
      </div>


    </motion.div>
  );
};

export default Reglamento;
