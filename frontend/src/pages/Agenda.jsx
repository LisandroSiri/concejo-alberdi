import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users } from 'lucide-react';
import { agendaData } from '../data/agendaData';
import './Agenda.css';

const Agenda = () => {
  const sessions = agendaData;

  return (
    <motion.div
      className="agenda-page container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-title">
        <span className="badge badge-primary">Calendario Oficial</span>
        <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Agenda de Sesiones</h2>
      </div>

      <div className="agenda-list">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            className="card agenda-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="agenda-date">
              <span className="day">{session.day}</span>
              <span className="month">{session.month}</span>
            </div>

            <div className="agenda-details">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <h3 className="serif-title agenda-title">{session.title}</h3>
                <span className={`badge ${session.type === 'Especial' ? 'badge-accent' : 'badge-teal'}`}>
                  {session.type}
                </span>
              </div>

              <div className="agenda-meta">
                <span><Clock size={16} /> {session.time}</span>
                <span><MapPin size={16} /> {session.location}</span>
              </div>

              <p className="agenda-desc">{session.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Agenda;
