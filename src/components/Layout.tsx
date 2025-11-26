/**
 * Layout principal para el componente de facturación
 */

import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface LayoutProps {
  children: ReactNode;
  theme: 'classic' | 'clean' | 'compact';
}

/**
 * Componente Layout que envuelve todo el contenido con el tema correspondiente
 */
export const Layout: React.FC<LayoutProps> = ({ children, theme }) => {
  return (
    <div className={`tecnotics-container tecnotics-theme-${theme}`}>
      <Header />
      <div className="tecnotics-layout">
        {children}
      </div>
      <Footer />
    </div>
  );
};

