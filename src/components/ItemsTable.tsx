/**
 * Tabla de items de la factura con soporte para edición inline de items temporales
 */

import React from 'react';
import { Product } from '../services/api';
import { formatCurrencyWithSymbol } from '../utils/formatters';

export interface InvoiceItem {
  product: Product;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
  isTemporary?: boolean; // Flag para items temporales
  taxRate?: number; // Tasa de IVA editable para items temporales
}

export interface ItemsTableProps {
  items: InvoiceItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdateTemporaryItem?: (index: number, field: string, value: any) => void;
  onSyncTemporaryItem?: (index: number) => void;
  currency?: string; // Código de moneda para formateo
}

/**
 * Tabla que muestra los items de la factura con opciones de edición
 * Soporta edición inline para items temporales
 */
export const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateTemporaryItem,
  onSyncTemporaryItem,
  currency = 'COP',
}) => {
  return (
    <div className="tecnotics-items-table-container">
      <table className="tecnotics-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto/Servicio</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>IVA (%)</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className="tecnotics-table-empty">
                No hay items agregados
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={index} className={item.isTemporary ? 'tecnotics-table-row-temporary' : ''}>
                <td>
                  {item.isTemporary && onUpdateTemporaryItem ? (
                    <input
                      type="text"
                      className="tecnotics-input tecnotics-input-xs"
                      value={item.product.code || ''}
                      onChange={(e) => onUpdateTemporaryItem(index, 'code', e.target.value)}
                      placeholder="Código"
                    />
                  ) : (
                    item.product.code || item.product.external_id || '-'
                  )}
                </td>
                <td>
                  {item.isTemporary && onUpdateTemporaryItem ? (
                    <div>
                      <input
                        type="text"
                        className="tecnotics-input tecnotics-input-xs"
                        value={item.product.name}
                        onChange={(e) => onUpdateTemporaryItem(index, 'name', e.target.value)}
                        placeholder="Nombre del producto/servicio"
                      />
                      <textarea
                        className="tecnotics-input tecnotics-input-xs tecnotics-textarea-sm"
                        value={item.product.description}
                        onChange={(e) => onUpdateTemporaryItem(index, 'description', e.target.value)}
                        placeholder="Descripción"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="tecnotics-table-product-name">
                        {item.product.name}
                      </div>
                      {item.product.description && (
                        <div className="tecnotics-table-product-desc">
                          {item.product.description}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    className="tecnotics-input tecnotics-input-sm"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(index, Number(e.target.value))
                    }
                    min="1"
                  />
                </td>
                <td>
                  {item.isTemporary && onUpdateTemporaryItem ? (
                    <input
                      type="number"
                      className="tecnotics-input tecnotics-input-xs"
                      value={item.product.price}
                      onChange={(e) => onUpdateTemporaryItem(index, 'price', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    formatCurrencyWithSymbol(item.product.price, currency)
                  )}
                </td>
                <td>
                  {item.isTemporary && onUpdateTemporaryItem ? (
                    <input
                      type="number"
                      className="tecnotics-input tecnotics-input-xs"
                      value={item.taxRate || 19}
                      onChange={(e) => onUpdateTemporaryItem(index, 'taxRate', Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  ) : (
                    `${item.taxRate || 19}%`
                  )}
                </td>
                <td>{formatCurrencyWithSymbol(item.subtotal, currency)}</td>
                <td className="tecnotics-table-total">
                  {formatCurrencyWithSymbol(item.total, currency)}
                </td>
                <td>
                  <div className="tecnotics-table-actions">
                    {item.isTemporary && onSyncTemporaryItem ? (
                      <>
                        <button
                          className="tecnotics-btn tecnotics-btn-success tecnotics-btn-sm"
                          onClick={() => onSyncTemporaryItem(index)}
                          type="button"
                          title="Sincronizar con el backend"
                        >
                          ✓ Sincronizar
                        </button>
                        <button
                          className="tecnotics-btn tecnotics-btn-danger tecnotics-btn-sm"
                          onClick={() => onRemoveItem(index)}
                          type="button"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        className="tecnotics-btn tecnotics-btn-danger tecnotics-btn-sm"
                        onClick={() => onRemoveItem(index)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

