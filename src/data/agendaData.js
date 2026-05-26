export const agendaData = [
  {
    id: 1,
    title: "Sesión Ordinaria N° 12",
    date: "2026-06-05",
    day: "05",
    month: "Jun",
    time: "08:00 PM",
    location: "Recinto del Concejo Deliberante",
    type: "Ordinaria",
    status: "Completada",
    description: "Tratamiento de proyectos de ordenanza sobre desarrollo urbano y presupuesto participativo."
  },
  {
    id: 2,
    title: "Sesión Especial: Aniversario de la Ciudad",
    date: "2026-05-22",
    day: "12",
    month: "Jun",
    time: "09:00 AM",
    location: "Recinto del Concejo Deliberante",
    type: "Especial",
    status: "Próxima",
    description: "Sesión conmemorativa por el bicentenario de la fundación de nuestra ciudad. Entrega de reconocimientos a ciudadanos ilustres."
  },
  {
    id: 3,
    title: "Sesión Ordinaria N° 13",
    date: "2026-06-19",
    day: "19",
    month: "Jun",
    time: "08:00 PM",
    location: "Recinto del Concejo Deliberante",
    type: "Ordinaria",
    status: "Próxima",
    description: "Debate sobre normativas ambientales y control de residuos sólidos urbanos."
  },
  {
    id: 4,
    title: "Sesión Ordinaria N° 14",
    date: "2026-07-05",
    day: "05",
    month: "Jul",
    time: "08:00 PM",
    location: "Recinto del Concejo Deliberante",
    type: "Ordinaria",
    status: "Próxima",
    description: "Debate sobre normativas ambientales y control de residuos sólidos urbanos."
  },
  {
    id: 5,
    title: "Sesión Ordinaria N° 15",
    date: "2026-07-05",
    day: "05",
    month: "Jul",
    time: "08:00 PM",
    location: "Recinto del Concejo Deliberante",
    type: "Ordinaria",
    status: "Próxima",
    description: "Debate sobre normativas ambientales y control de residuos sólidos urbanos."
  }
];

const getNombreMes = (monthAbbr) => {
  const meses = {
    'Ene': 'Enero', 'Feb': 'Febrero', 'Mar': 'Marzo', 'Abr': 'Abril',
    'May': 'Mayo', 'Jun': 'Junio', 'Jul': 'Julio', 'Ago': 'Agosto',
    'Sep': 'Septiembre', 'Oct': 'Octubre', 'Nov': 'Noviembre', 'Dic': 'Diciembre'
  };
  return meses[monthAbbr] || monthAbbr;
};

export const getSesionesRecientes = (cantidad = 4) => {
  return [...agendaData]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // descendente (más nueva primero)
    .slice(0, cantidad)
    .map(session => ({
      id: session.id,
      title: session.title,
      // Formato: "05 de Junio, 2026" (sin abreviaturas)
      fechaDisplay: `${session.day} de ${getNombreMes(session.month)}, ${session.date.split('-')[0]}`,
      fechaOriginal: session.date,
      status: session.status,
      description: session.description  // descripción completa (para detalle si querés)
    }));
};