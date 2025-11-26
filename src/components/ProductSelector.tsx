/**
 * Componente para seleccionar productos y agregarlos a la factura
 */

import React, { useState, useEffect } from 'react';
import { useTecnotics } from '../hooks/useTecnotics';
import { Product, CreateProductDTO } from '../services/api';
import toast from 'react-hot-toast';
import { formatCurrencyWithSymbol } from '../utils/formatters';

export interface ProductSelectorProps {
  onAddProduct: (product: Product, quantity: number) => void;
}

/**
 * Selector de productos con cantidad y creación
 */
export const ProductSelector: React.FC<ProductSelectorProps> = ({
  onAddProduct,
}) => {
  const { api } = useTecnotics();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Estado del formulario de creación
  const [newProduct, setNewProduct] = useState<CreateProductDTO>({
    name: '',
    price: 0,
    quantity: 1,
    description: '',
    kind: 'product',
    code: '',
    taxes: {
      iva: 19,
      other: 0,
    },
  });

  useEffect(() => {
    const loadProducts = async () => {
      if (!api) return;

      setIsLoading(true);
      try {
        const { items } = await api.getProducts();
        setProducts(items);
      } catch (error) {
        toast.error('Error al cargar productos');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [api]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.external_id && product.external_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setShowDropdown(false);
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

    onAddProduct(selectedProduct, quantity);
    setSelectedProduct(null);
    setSearchTerm('');
    setQuantity(1);
    toast.success('Producto agregado');
  };

  const handleCreateProduct = async () => {
    if (!api) return;

    // Validaciones
    if (!newProduct.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (newProduct.price <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }
    if (newProduct.quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }
    if (!newProduct.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }

    setIsCreating(true);
    try {
      const createdProduct = await api.createProduct(newProduct);
      toast.success('Item creado exitosamente');
      
      // Agregar el nuevo producto a la lista
      setProducts([createdProduct, ...products]);
      
      // Seleccionar automáticamente el nuevo producto
      setSelectedProduct(createdProduct);
      
      // Limpiar formulario y cerrar
      setNewProduct({
        name: '',
        price: 0,
        quantity: 1,
        description: '',
        kind: 'product',
        code: '',
        taxes: {
          iva: 19,
          other: 0,
        },
      });
      setShowCreateForm(false);
      setSearchTerm(createdProduct.name);
    } catch (error: any) {
      toast.error(error.message || 'Error al crear item');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowDropdown(false);
  };

  return (
    <div className="tecnotics-product-selector">
      <div className="tecnotics-label-row">
        <label className="tecnotics-label">Agregar Producto/Servicio</label>
        <button
          className="tecnotics-btn tecnotics-btn-link"
          onClick={toggleCreateForm}
          type="button"
        >
          {showCreateForm ? '← Volver' : '+ Nuevo Item'}
        </button>
      </div>

      {!showCreateForm ? (
        <>
          <div className="tecnotics-product-selector-row">
        <div className="tecnotics-product-search">
          <input
            type="text"
            className="tecnotics-input"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (selectedProduct) setSelectedProduct(null);
            }}
            onFocus={() => setShowDropdown(true)}
            disabled={isLoading}
          />
          
          {showDropdown && searchTerm && !selectedProduct && (
            <div className="tecnotics-dropdown">
              {isLoading ? (
                <div className="tecnotics-dropdown-item">Cargando...</div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="tecnotics-dropdown-item"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="tecnotics-dropdown-item-name">
                      {product.name}
                    </div>
                    <div className="tecnotics-dropdown-item-doc">
                      {(product.code || product.external_id) ? `Código: ${product.code || product.external_id} | ` : ''}{formatCurrencyWithSymbol(product.price, 'COP')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="tecnotics-dropdown-item">
                  No se encontraron productos
                </div>
              )}
            </div>
          )}
        </div>

        <div className="tecnotics-quantity-input">
          <label className="tecnotics-label">Cantidad</label>
          <input
            type="number"
            className="tecnotics-input"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            step="1"
          />
        </div>

            <button
              className="tecnotics-btn tecnotics-btn-primary"
              onClick={handleAddProduct}
              type="button"
              disabled={!selectedProduct}
            >
              Agregar
            </button>
          </div>

          {selectedProduct && (
            <div className="tecnotics-product-preview">
              <strong>{selectedProduct.name}</strong>
              <span className="tecnotics-product-price">
                {formatCurrencyWithSymbol(selectedProduct.price, 'COP')} | Tipo: {selectedProduct.kind === 'product' ? 'Producto' : 'Servicio'}
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="tecnotics-create-form">
          <h3 className="tecnotics-form-title">Crear Nuevo Item</h3>
          
          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Nombre *</label>
              <input
                type="text"
                className="tecnotics-input"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Ej: Laptop HP Core i7"
              />
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Tipo *</label>
              <select
                className="tecnotics-input"
                value={newProduct.kind}
                onChange={(e) => setNewProduct({ ...newProduct, kind: e.target.value as 'product' | 'service' })}
              >
                <option value="product">Producto</option>
                <option value="service">Servicio</option>
              </select>
            </div>
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Código/SKU</label>
              <input
                type="text"
                className="tecnotics-input"
                value={newProduct.code}
                onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                placeholder="LAP-001"
              />
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Precio unitario *</label>
              <input
                type="number"
                className="tecnotics-input"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Cantidad inicial *</label>
              <input
                type="number"
                className="tecnotics-input"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Descripción *</label>
              <textarea
                className="tecnotics-input tecnotics-textarea"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Descripción detallada del producto o servicio"
                rows={3}
              />
            </div>
          </div>

          <div className="tecnotics-form-actions">
            <button
              className="tecnotics-btn tecnotics-btn-secondary"
              onClick={toggleCreateForm}
              type="button"
              disabled={isCreating}
            >
              Cancelar
            </button>
            <button
              className="tecnotics-btn tecnotics-btn-primary"
              onClick={handleCreateProduct}
              type="button"
              disabled={isCreating}
            >
              {isCreating ? 'Creando...' : 'Crear Item'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

