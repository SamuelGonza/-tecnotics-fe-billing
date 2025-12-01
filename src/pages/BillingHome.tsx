/**
 * Página principal de facturación
 */

import React, { useState } from 'react';
import { ClientModal } from '../components/ClientModal';
import { ProductModal } from '../components/ProductModal';
import { ItemsTable, InvoiceItem } from '../components/ItemsTable';
import { Client, Product, InvoicePayload } from '../services/api';
import { useTecnotics } from '../hooks/useTecnotics';
import toast from 'react-hot-toast';
import { formatCurrencyWithSymbol } from '../utils/formatters';
import { numberToWords } from '../utils/numberToWords';
import { TipoDocElectronico } from '../types/enums';

import logo_fe from '../assets/favicon.png'

/**
 * Página principal con el formulario completo de facturación
 */
export const BillingHome: React.FC = () => {
  const { api, companyData } = useTecnotics();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('1'); // 1 = Contado, 2 = Crédito
  const [currency, setCurrency] = useState('COP');
  const [documentType, setDocumentType] = useState(TipoDocElectronico.FACTURA); // 01 = Factura, 02 = Nota débito, 03 = Nota crédito
  const [reference, setReference] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState(companyData?.prefixes?.[0] || '');
  const [elaborationDate, setElaborationDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [next_consecutive, set_next_consecutive] = useState(0);
  
  // Estados para los modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Contador para IDs temporales
  const [tempIdCounter, setTempIdCounter] = useState(1);

  // Verificar si el documento es nota débito o crédito
  const isDebitOrCreditNote = documentType === TipoDocElectronico.NOTA_DEBITO || documentType === TipoDocElectronico.NOTA_CREDITO;

  // Actualizar prefijo cuando cambie companyData
  React.useEffect(() => {
    if (companyData?.prefixes && companyData.prefixes.length > 0 && !selectedPrefix) {
      setSelectedPrefix(companyData.prefixes[0]);
    }
  }, [companyData, selectedPrefix]);

  React.useEffect(() => {
    if (selectedPrefix) {
      api?.getNextConsecutive(documentType, companyData?.company_id || '', selectedPrefix).then((numero) => {
        set_next_consecutive(numero);
      }).catch((error) => {
        toast.error(error.message);
      });
    }
  }, [documentType, selectedPrefix ,companyData?.company_id]);

  // Agregar producto normal a la lista
  const handleAddProduct = (product: Product, quantity: number) => {
    const taxRate = 19; // IVA por defecto (Colombia)
    const subtotal = product.price * quantity;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const newItem: InvoiceItem = {
      product,
      quantity,
      subtotal,
      tax: taxAmount,
      total,
      isTemporary: false,
      taxRate,
    };

    setItems([...items, newItem]);
  };

  // Crear item temporal para edición inline
  const handleCreateTemporaryItem = (type: 'product' | 'service') => {
    const tempProduct: Product = {
      _id: `temp_${tempIdCounter}`,
      company_id: companyData?.company_id || '',
      name: '',
      price: 0,
      quantity: 1,
      total: 0,
      description: '',
      kind: type,
      code: '',
      taxes: {
        iva: 19,
        other: 0,
      },
    };

    const newItem: InvoiceItem = {
      product: tempProduct,
      quantity: 1,
      subtotal: 0,
      tax: 0,
      total: 0,
      isTemporary: true,
      taxRate: 19,
    };

    setItems([...items, newItem]);
    setTempIdCounter(tempIdCounter + 1);
    toast.success(`Item temporal creado. Completa los datos y sincroniza.`);
  };

  // Eliminar item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Actualizar cantidad de un item
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return;

    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const taxRate = item.taxRate || 19;
        const subtotal = item.product.price * quantity;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;
        return {
          ...item,
          quantity,
          subtotal,
          tax: taxAmount,
          total,
        };
      }
      return item;
    });

    setItems(updatedItems);
  };

  // Actualizar campo de item temporal
  const handleUpdateTemporaryItem = (index: number, field: string, value: any) => {
    const updatedItems = items.map((item, i) => {
      if (i === index && item.isTemporary) {
        const updatedProduct = { ...item.product };
        let taxRate = item.taxRate || 19;

        if (field === 'name' || field === 'description' || field === 'code') {
          updatedProduct[field] = value;
        } else if (field === 'price') {
          updatedProduct.price = value;
        } else if (field === 'taxRate') {
          taxRate = value;
          // Actualizar también en el objeto taxes del producto
          if (updatedProduct.taxes) {
            updatedProduct.taxes.iva = value;
          }
        }

        // Recalcular totales
        const subtotal = updatedProduct.price * item.quantity;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;

        return {
          ...item,
          product: updatedProduct,
          taxRate,
          subtotal,
          tax: taxAmount,
          total,
        };
      }
      return item;
    });

    setItems(updatedItems);
  };

  // Sincronizar item temporal con el backend
  const handleSyncTemporaryItem = async (index: number) => {
    const item = items[index];
    
    if (!item.isTemporary) return;
    if (!api) {
      toast.error('API no disponible');
      return;
    }

    // Validaciones
    if (!item.product.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (item.product.price <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }
    if (!item.product.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }

    try {
      const createdProduct = await api.createProduct({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        description: item.product.description,
        kind: item.product.kind,
        code: item.product.code || undefined,
        taxes: {
          iva: item.taxRate || 19,
          other: 0,
        },
      });

      // Actualizar el item con el producto real del backend
      const updatedItems = items.map((itm, i) => {
        if (i === index) {
          return {
            ...itm,
            product: createdProduct,
            isTemporary: false,
          };
        }
        return itm;
      });

      setItems(updatedItems);
      toast.success('Producto sincronizado exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al sincronizar producto');
    }
  };

  // Calcular totales detallados
  const calculateTotals = () => {
    const valorBruto = items.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentos = 0; // Por ahora sin descuentos
    const subtotal = valorBruto - descuentos;
    const impuestos = items.reduce((sum, item) => sum + item.tax, 0);
    const total = subtotal + impuestos;
    return { valorBruto, descuentos, subtotal, impuestos, total };
  };
  
  // Calcular base imponible para IVA (usando tasa fija del 19%)
  const calculateTaxBase = () => {
    const taxRate = 19; // IVA fijo
    const taxGroups = items.reduce((acc, item) => {
      if (!acc[taxRate]) {
        acc[taxRate] = { base: 0, tax: 0, total: 0 };
      }
      acc[taxRate].base += item.subtotal;
      acc[taxRate].tax += item.tax;
      acc[taxRate].total += item.total;
      return acc;
    }, {} as Record<number, { base: number; tax: number; total: number }>);
    
    return Object.entries(taxGroups).map(([rate, values]) => ({
      rate: Number(rate),
      base: values.base,
      tax: values.tax,
      total: values.total
    }));
  };

  // Crear factura
  const handleCreateInvoice = async () => {
    if (!selectedClient) {
      toast.error('Selecciona un cliente');
      return;
    }

    if (items.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }

    if (!api) {
      toast.error('API no disponible');
      return;
    }

    setIsSubmitting(true);

    const payload: InvoicePayload = {
      headers: {
        prefijo: selectedPrefix,
        tipo_documento: documentType,
        f_elaboracion: elaborationDate,
        f_vencimiento: dueDate,
        forma_pago: paymentMethod,
        moneda: currency,
        valor_letras: numberToWords(totals.total, currency),
        observaciones: notes || undefined,
        ...(isDebitOrCreditNote && reference ? { referencia: reference } : {}),
      },
      totales: {
        TotalMonetario: {
          ValorBruto: {
            IdMoneda: currency,
            Value: totals.valorBruto,
          },
          ValorBaseImpuestos: {
            IdMoneda: currency,
            Value: totals.subtotal,
          },
          TotalMasImpuestos: {
            IdMoneda: currency,
            Value: totals.total,
          },
          ValorAPagar: {
            IdMoneda: currency,
            Value: totals.total,
          },
        },
      },
      client_id: selectedClient._id,
      items: items.map((item) => ({
        itemId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        tax: item.taxRate || 19,
      })),
    };

    try {
      const result = await api.createInvoice(payload);

      if (result.success) {
        toast.success(
          `Factura creada exitosamente: ${selectedPrefix}-${next_consecutive}`
        );
        // Limpiar formulario
        setSelectedClient(null);
        setItems([]);
        setNotes('');
        setPaymentMethod('1');
        setReference('');
        setDueDate('');
      } else {
        toast.error(result.message || 'Error al crear factura');
      }
    } catch (error) {
      toast.error('Error al crear factura');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();
  const taxBases = calculateTaxBase();

  // Función helper para obtener textos según el tipo de documento
  const getDocumentTypeInfo = () => {
    switch (documentType) {
      case TipoDocElectronico.NOTA_DEBITO:
        return {
          title: 'NOTA DÉBITO',
          prefix: selectedPrefix,
          description: 'Nueva nota débito'
        };
      case TipoDocElectronico.NOTA_CREDITO:
        return {
          title: 'NOTA CRÉDITO',
          prefix: selectedPrefix,
          description: 'Nueva nota crédito'
        };
      case TipoDocElectronico.FACTURA:
      default:
        return {
          title: 'FACTURA ELECTRÓNICA',
          prefix: selectedPrefix,
          description: 'Nueva factura electrónica'
        };
    }
  };

  const documentInfo = getDocumentTypeInfo();

  return (
    <div className="tecnotics-billing-home">
      {/* Header con logo y número de factura */}
      <div className="tecnotics-invoice-header">
        <div className="tecnotics-logo-container">
          <img 
            src={logo_fe} 
            alt="Facturación Electrónica" 
            className="tecnotics-billing-logo"
            draggable={false}
          />
        </div>
        <div className="tecnotics-invoice-info">
          <h1 className="tecnotics-invoice-title">{documentInfo.title}</h1>
          {next_consecutive && (
            <p className="tecnotics-invoice-number">{documentInfo.prefix} #{next_consecutive}</p>
          )}
          <p className="tecnotics-invoice-date">{documentInfo.description}-{new Date().toISOString().split('T')[0]}</p>
        </div>
      </div>

      {/* Información de la empresa */}
      <div className="tecnotics-company-info">
        <h2 className="tecnotics-company-name">{companyData?.razon_social}</h2>
      </div>

      {/* Banner informativo */}
      <div className="tecnotics-info-banner">
        Factura productos o servicios para tus clientes y entregar a la DIAN
      </div>

      {/* Información de la factura */}
      <div className="tecnotics-invoice-details">
        {/* Selector de prefijo */}
        {companyData?.prefixes && companyData.prefixes.length > 0 && (
          <div className="tecnotics-invoice-row">
            <div className="tecnotics-field-group">
              <label className="tecnotics-label">Prefijo:</label>
              <select
                className="tecnotics-select tecnotics-input-inline"
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
              >
                {companyData.prefixes.map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tipo de documento - justo debajo del prefijo */}
        <div className="tecnotics-invoice-row">
          <div className="tecnotics-field-group">
            <label className="tecnotics-label">Tipo de documento:</label>
            <select
              className="tecnotics-select tecnotics-input-inline"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as TipoDocElectronico)}
            >
              <option value={TipoDocElectronico.FACTURA}>Factura de venta</option>
              <option value={TipoDocElectronico.FACTURA}>Factura POS</option>
              <option value={TipoDocElectronico.NOTA_DEBITO}>Nota débito</option>
              <option value={TipoDocElectronico.NOTA_CREDITO}>Nota crédito</option>
            </select>
          </div>
        </div>

        <div className="tecnotics-invoice-row">
          <div className="tecnotics-field-group">
            <label className="tecnotics-label">Fecha Elaboración:</label>
            <input
              type="date"
              className="tecnotics-input tecnotics-input-inline"
              value={elaborationDate}
              onChange={(e) => setElaborationDate(e.target.value)}
            />
          </div>
          <div className="tecnotics-field-group">
            <label className="tecnotics-label">Forma de pago:</label>
            <select
              className="tecnotics-select tecnotics-input-inline"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="1">Contado</option>
              <option value="2">Crédito</option>
            </select>
          </div>
        </div>

        <div className="tecnotics-invoice-row">
          <div className="tecnotics-field-group">
            <label className="tecnotics-label">Fecha Vencimiento:</label>
            <input
              type="date"
              className="tecnotics-input tecnotics-input-inline"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="tecnotics-field-group">
            <label className="tecnotics-label">Moneda:</label>
            <select
              className="tecnotics-select tecnotics-input-inline"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Mostrar referencia solo si es nota débito o crédito */}
        {isDebitOrCreditNote && (
          <div className="tecnotics-invoice-row">
            <div className="tecnotics-field-group tecnotics-field-full">
              <label className="tecnotics-label">Referencia de factura a quien se asigna la nota:</label>
              <input
                type="text"
                className="tecnotics-input"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ingrese el número de factura de referencia"
                required
              />
            </div>
          </div>
        )}
      </div>

      <div className="tecnotics-header">
        <h2 className="tecnotics-subtitle">Cliente y Productos</h2>
      </div>

      {/* Botón para agregar cliente */}
      <div className="tecnotics-section">
        <button
          className="tecnotics-btn tecnotics-btn-primary tecnotics-btn-block"
          onClick={() => setShowClientModal(true)}
          type="button"
        >
          {selectedClient ? `SELECCIONADO: ${selectedClient.name}` : 'Seleccionar cliente'}
        </button>
        {selectedClient && (
          <div className="tecnotics-client-summary">
            <p><strong>Documento:</strong> {selectedClient.doc_type} {selectedClient.doc_number}</p>
            <p><strong>Email:</strong> {selectedClient.email}</p>
            <p><strong>Teléfono:</strong> {selectedClient.phone}</p>
          </div>
        )}
      </div>

      {/* Botón para agregar productos */}
      <div className="tecnotics-section">
        <button
          className="tecnotics-btn tecnotics-btn-secondary tecnotics-btn-block"
          onClick={() => setShowProductModal(true)}
          type="button"
        >
          Agregar Producto/Servicio
        </button>
      </div>

      {/* Tabla de items */}
      <div className="tecnotics-section">
        <ItemsTable
          items={items}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateTemporaryItem={handleUpdateTemporaryItem}
          onSyncTemporaryItem={handleSyncTemporaryItem}
          currency={currency}
        />
      </div>

      {/* Modales */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSelectClient={(client) => {
          setSelectedClient(client);
          setShowClientModal(false);
        }}
      />
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelectProduct={handleAddProduct}
        onCreateTemporary={handleCreateTemporaryItem}
        currency={currency}
      />

      {/* Sección de impuestos */}
      {items.length > 0 && (
        <div className="tecnotics-section">
          <h3 className="tecnotics-section-title">IMPUESTO</h3>
          <table className="tecnotics-tax-table">
            <thead>
              <tr>
                <th>IMPUESTO</th>
                <th>BASE</th>
                <th>TASA</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {taxBases.map((taxGroup, index) => (
                <tr key={index}>
                  <td>IVA</td>
                  <td>{formatCurrencyWithSymbol(taxGroup.base, currency)}</td>
                  <td>{taxGroup.rate}%</td>
                  <td>{formatCurrencyWithSymbol(taxGroup.tax, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="tecnotics-section tecnotics-footer-section">
        <div className="tecnotics-footer-left">
          <div className="tecnotics-form-group">
            <label className="tecnotics-label">Observaciones...</label>
            <textarea
              className="tecnotics-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones adicionales de la factura..."
              rows={4}
            />
          </div>
        </div>

        <div className="tecnotics-footer-right">
          <div className="tecnotics-totals-detailed">
            <h3 className="tecnotics-totals-title">Totales</h3>
            <div className="tecnotics-totals-row">
              <span className="tecnotics-totals-label">Valor bruto:</span>
              <span className="tecnotics-totals-value">{formatCurrencyWithSymbol(totals.valorBruto, currency)}</span>
            </div>
            <div className="tecnotics-totals-row">
              <span className="tecnotics-totals-label">Descuentos:</span>
              <span className="tecnotics-totals-value">{formatCurrencyWithSymbol(totals.descuentos, currency)}</span>
            </div>
            <div className="tecnotics-totals-row">
              <span className="tecnotics-totals-label">Subtotal:</span>
              <span className="tecnotics-totals-value">{formatCurrencyWithSymbol(totals.subtotal, currency)}</span>
            </div>
            <div className="tecnotics-totals-row">
              <span className="tecnotics-totals-label">Impuestos:</span>
              <span className="tecnotics-totals-value">{formatCurrencyWithSymbol(totals.impuestos, currency)}</span>
            </div>
            <div className="tecnotics-totals-row tecnotics-totals-row-total">
              <span className="tecnotics-totals-label tecnotics-totals-label-total">TOTAL:</span>
              <span className="tecnotics-totals-value tecnotics-totals-value-total">{formatCurrencyWithSymbol(totals.total, currency)}</span>
            </div>
            <div className="tecnotics-totals-words">
              <em>{numberToWords(totals.total, currency)}</em>
            </div>
          </div>

          <button
            className="tecnotics-btn tecnotics-btn-primary tecnotics-btn-lg"
            onClick={handleCreateInvoice}
            disabled={
              !selectedClient || items.length === 0 || isSubmitting
            }
            type="button"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar y enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

