import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Users, FileText, Leaf, Shield, BookOpen, Calendar, HardHat } from 'lucide-react';
import './Comisiones.css';

const Comisiones = () => {
  const comisionesList = [
    {
      id: 1,
      title: "Presupuesto y Hacienda",
      icon: <Scale size={24} />,
      description: "Encargada de dictaminar sobre el Presupuesto General de Gastos y Cálculo de Recursos, ordenanzas impositivas y todo asunto relativo a las finanzas municipales.",
      members: [
        { name: "Ramiro Aguilera", role: "Presidente" },
        { name: "Cintia Melik Matar", role: "Vocal" },
        { name: "Ana Campos", role: "Vocal" },
        { name: "José Romano", role: "Vocal" },
        { name: "Nanci Cuenca", role: "Vocal" },
      ],
      schedule: "Martes 9hs"
    },
    {
      id: 2,
      title: "Obras Públicas y Transporte",
      icon: <Users size={24} />,
      description: "Interviene en proyectos referidos a urbanismo, zonificación, loteos, edificación, pavimentación y planificación del desarrollo urbano.",
      members: [
        { name: "José Romano", role: "Presidente" },
        { name: "Ana Campos", role: "Vocal" },
        { name: "Nanci Cuenca", role: "Vocal" },
        { name: "Martina Siri", role: "Vocal" },
        { name: "José Calderón", role: "Vocal" },
      ],
      schedule: "Martes 11hs"
    },
    {
      id: 3,
      title: "Educacion y Cultura, Turismo y Deportes, Salud y Consevacion Ambiental",
      icon: <Leaf size={24} />,
      description: "Entiende en normativas vinculadas a la educación, cultura, turismo, deportes, salud, medio ambiente y espacios verdes.",
      members: [
        { name: "José Calderón", role: "Presidente" },
        { name: "Nanci Cuenca", role: "Vocal" },
        { name: "Cintia Melik Matar", role: "Vocal" },
        { name: "Martina Siri", role: "Vocal" },
        { name: "Ana Campos", role: "Vocal" },
      ],
      schedule: "Lunes 9hs"
    },
    {
      id: 4,
      title: "Relaciones laborales, Politica Ocupacional, Seguridad e Higiene en el Trabajo",
      icon: <HardHat size={24} />,
      description: "Aborda temáticas sobre relaciones laborales, politica ocupacional, y seguridad e higiene en el trabajo.",
      members: [
        { name: "Nanci Cuenca", role: "Presidenta" },
        { name: "Ramiro Aguilera", role: "Vocal" },
        { name: "Ana Campos", role: "Vocal" },
        { name: "José Calderón", role: "Vocal" },
        { name: "Adolfo Diaz Chavero", role: "Vocal" }
      ],
      schedule: "Lunes 11hs"
    },
    {
      id: 5,
      title: "Preservacion del patrimonio de  la ciudad",
      icon: <BookOpen size={24} />,
      description: "Estudia iniciativas referidas a establecimientos educativos municipales, actividades culturales, patrimonio histórico e inclusión social.",
      members: [
        { name: "Cintia Melik Matar", role: "Presidenta" },
        { name: "Martina Siri", role: "Vocal" },
        { name: "Nanci Cuenca", role: "Vocal" },
        { name: "José Calderón", role: "Vocal" },
        { name: "Adolfo Diaz Chavero", role: "Vocal" }
      ],
      schedule: "Miercoles 11hs"
    },
    {
      id: 6,
      title: "Legislación y Peticiones",
      icon: <FileText size={24} />,
      description: "Analiza y despacha las peticiones particulares, evalúa títulos de los concejales y propone reformas al reglamento interno.",
      members: [
        { name: "Martina Siri", role: "Presidenta" },
        { name: "José Romano", role: "Vocal" },
        { name: "Cintia Melik Matar", role: "Vocal" },
        { name: "Ramiro Aguilera", role: "Vocal" },
        { name: "José Calderón", role: "Vocal" }
      ],
      schedule: "Miercoles 9hs"
    },
    {
      id: 7,
      title: "Politicas de Genero, mujeres y diversidad",
      icon: <FileText size={24} />,
      description: "Aborda temáticas sobre politicas de género, mujeres y diversidad.",
      members: [
        { name: "Cintia Melik Matar", role: "Presidenta" },
        { name: "Martina Siri", role: "Vocal" },
        { name: "Nanci Cuenca", role: "Vocal" },
        { name: "Ana Campos", role: "Vocal" },
        { name: "Adolfo Diaz Chavero", role: "Vocal" }
      ],
      schedule: "Jueves 11hs"
    }
  ];

  return (
    <motion.div
      className="comisiones-page container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-title">
        <span className="badge badge-primary">Trabajo Legislativo</span>
        <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Comisiones de Trabajo</h2>
      </div>

      <div className="grid grid-3">
        {comisionesList.map((com, index) => (
          <motion.div
            key={com.id}
            className="card comision-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="comision-header">
              <div className="comision-icon-wrapper">
                {com.icon}
              </div>
              <h3 className="serif-title comision-title">{com.title}</h3>
            </div>

            <div className="comision-body">
              <p className="comision-desc">{com.description}</p>

              <div className="comision-members">
                <h4>Integrantes</h4>
                <ul>
                  {com.members.map((member, i) => (
                    <li key={i}>
                      {member.name}
                      {member.role === "Presidente" || member.role === "Presidenta" ?
                        <span className="president-badge">{member.role}</span> : null
                      }
                    </li>
                  ))}
                </ul>
                <div className="schedule">
                  <span className="schedule-label"><Calendar size={16} /> Horario:</span>
                  <p>{com.schedule}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Comisiones;
