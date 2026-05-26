import React from 'react';
import { Facebook, Instagram } from './SocialIcons';
import { motion } from 'framer-motion';
import './FloatingSocials.css';

const FloatingSocials = () => {
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="floating-socials"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.a variants={itemVariants} href="https://www.facebook.com/people/Concejo-Deliberante-Juan-B-Alberdi/61577484064394/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="floating-social-btn">
        <Facebook size={20} />
      </motion.a>
      <motion.a variants={itemVariants} href="https://www.instagram.com/hcdalberdi/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="floating-social-btn">
        <Instagram size={20} />
      </motion.a>
    </motion.div>
  );
};

export default FloatingSocials;
