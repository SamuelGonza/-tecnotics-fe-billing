/**
 * Modal para seleccionar o crear productos/servicios
 */

import React, { useState, useEffect } from 'react';
import { useTecnotics } from '../hooks/useTecnotics';
import { Product } from '../services/api';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { formatCurrencyWithSymbol } from '../utils/formatters';

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product, quantity: number) => void;
  onCreateTemporary: (type: 'product' | 'service') => void;
  currency?: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onCreateTemporary,
  currency = 'COP',
}) => {
  const { api } = useTecnotics();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
      setSearchTerm('');
      setSelectedProduct(null);
      setQuantity(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.external_id && product.external_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    if (!api) return;
    setIsLoading(true);
    try {
      const { items } = await api.getProducts(1, 100);
      setProducts(items);
      setFilteredProducts(items);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error('Selecciona un producto');
      return;
    }
    if (quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }
    onSelectProduct(selectedProduct, quantity);
    onClose();
  };

  const handleCreateTemporary = (type: 'product' | 'service') => {
    onCreateTemporary(type);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Producto/Servicio" width="medium">
      <div className="tecnotics-modal-content">
        <input
          type="text"
          className="tecnotics-input tecnotics-search-input"
          placeholder="Buscar producto/servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        <div className="tecnotics-modal-actions">
          <button
            className="tecnotics-btn tecnotics-btn-primary"
            onClick={() => handleCreateTemporary('product')}
            type="button"
          >
            Crear producto nuevo
          </button>
          <button
            className="tecnotics-btn tecnotics-btn-primary"
            onClick={() => handleCreateTemporary('service')}
            type="button"
          >
            Crear servicio nuevo
          </button>
        </div>

        <div className="tecnotics-results-list">
          {isLoading ? (
            <div className="tecnotics-loading-text">Cargando...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`tecnotics-result-item ${selectedProduct?._id === product._id ? 'tecnotics-result-item-selected' : ''}`}
                onClick={() => handleSelectProduct(product)}
              >
                <div className="tecnotics-result-name">{product.name}</div>
                <div className="tecnotics-result-doc">
                  {(product.code || product.external_id) && `Código: ${product.code || product.external_id} | `}
                  {formatCurrencyWithSymbol(product.price, currency)}
                </div>
                {product.description && (
                  <div className="tecnotics-result-detail">{product.description}</div>
                )}
                <div className="tecnotics-result-badge">
                  {product.kind === 'product' ? 'Producto' : 'Servicio'}
                </div>
              </div>
            ))
          ) : (
            <div className="tecnotics-empty-state">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </div>
          )}
        </div>

        {selectedProduct && (
          <div className="tecnotics-product-selection">
            <div className="tecnotics-selected-product">
              <strong>{selectedProduct.name}</strong>
              <span>{formatCurrencyWithSymbol(selectedProduct.price, currency)}</span>
            </div>
            <div className="tecnotics-quantity-selector">
              <label className="tecnotics-label">Cantidad:</label>
              <input
                type="number"
                className="tecnotics-input tecnotics-input-sm"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </div>
            <button
              className="tecnotics-btn tecnotics-btn-primary tecnotics-btn-block"
              onClick={handleAddProduct}
              type="button"
            >
              Agregar a la factura
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

