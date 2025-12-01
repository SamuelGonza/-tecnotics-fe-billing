/**
 * Footer del componente de facturación con créditos
 */

import React from 'react';

/**
 * Footer con créditos de Tecnotics y SIMBA
 */
export const Footer: React.FC = () => {
  return (
    <div className="tecnotics-footer-wrapper">
      <div className="tecnotics-footer-container">
        <div className="tecnotics-footer-content">
          <div className="tecnotics-footer-credits">
            <p className="tecnotics-footer-text">
              © {new Date().getFullYear()} <a href="https://tecnotics.com" target="_blank" rel="noopener noreferrer" className="tecnotics-footer-link">Tecnotics</a> - Todos los derechos reservados
            </p>
            <p className="tecnotics-footer-alliance">
              En alianza con SIMBA Electronics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

