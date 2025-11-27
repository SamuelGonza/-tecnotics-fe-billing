/**
 * Router interno encapsulado usando MemoryRouter
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BillingHome } from '../pages/BillingHome';

/**
 * Router interno que maneja las rutas del componente
 * Usa rutas relativas y no interfiere con el router del usuario
 */
export const InternalRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BillingHome />} />
      {/* Se pueden agregar más rutas internas aquí si es necesario */}
    </Routes>
  );
};




