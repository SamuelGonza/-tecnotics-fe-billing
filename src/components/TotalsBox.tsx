/**
 * Componente que muestra los totales de la factura
 */

import React from 'react';

export interface TotalsBoxProps {
  subtotal: number;
  totalTax: number;
  total: number;
}

/**
 * Caja de totales con subtotal, IVA y total
 */
export const TotalsBox: React.FC<TotalsBoxProps> = ({
  subtotal,
  totalTax,
  total,
}) => {
  return (
    <div className="tecnotics-totals-box">
      <div className="tecnotics-totals-row">
        <span className="tecnotics-totals-label">Subtotal:</span>
        <span className="tecnotics-totals-value">${subtotal.toFixed(2)}</span>
      </div>
      <div className="tecnotics-totals-row">
        <span className="tecnotics-totals-label">IVA:</span>
        <span className="tecnotics-totals-value">${totalTax.toFixed(2)}</span>
      </div>
      <div className="tecnotics-totals-row tecnotics-totals-row-total">
        <span className="tecnotics-totals-label">Total:</span>
        <span className="tecnotics-totals-value">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};



