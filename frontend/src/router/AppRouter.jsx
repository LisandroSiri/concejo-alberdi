import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Concejales from '../pages/Concejales';
import Normativas from '../pages/Normativas';
import Tramites from '../pages/Tramites';
import Agenda from '../pages/Agenda';
import Comisiones from '../pages/Comisiones';
import Reglamento from '../pages/Reglamento';
import EnConstruccion from '../pages/EnConstruccion';
import FloatingSocials from '../components/FloatingSocials';
import Admin from '../pages/Admin';

// Wrapper to enable route-driven key transitions if needed
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/concejales" element={<Concejales />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/comisiones" element={<Comisiones />} />
        <Route path="/normativas" element={<Normativas />} />
        <Route path="/reglamento" element={<Reglamento />} />
        <Route path="/tramites" element={<Tramites />} />
        <Route path="/en-construccion" element={<EnConstruccion />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouterContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <FloatingSocials />}
      <div className={isAdmin ? "admin-content-layout" : "main-content-layout"} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatedRoutes />
      </div>
      {!isAdmin && <Footer />}
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
};

export default AppRouter;
