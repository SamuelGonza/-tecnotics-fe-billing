/**
 * Modal para seleccionar o crear clientes
 */

import React, { useState, useEffect } from 'react';
import { useTecnotics } from '../hooks/useTecnotics';
import { Client, CreateClientDTO } from '../services/api';
import toast from 'react-hot-toast';
import { Modal } from './Modal';

export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: Client) => void;
}

type ViewMode = 'search' | 'create' | 'list';

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSelectClient,
}) => {
  const { api } = useTecnotics();
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newClient, setNewClient] = useState<CreateClientDTO>({
    name: '',
    email: '',
    phone: '',
    doc_type: 'Cc',
    doc_number: '',
    address: '',
    tipoPersona: '2',
  });

  useEffect(() => {
    if (isOpen) {
      loadClients();
      setViewMode('search');
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.doc_number.includes(searchTerm)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const loadClients = async () => {
    if (!api) return;
    setIsLoading(true);
    try {
      const { clients: data } = await api.getClients(1, 100);
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    onClose();
  };

  const handleCreateClient = async () => {
    if (!api) return;

    if (!newClient.name.trim() || !newClient.email.trim() || !newClient.phone.trim() || !newClient.doc_number.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsCreating(true);
    try {
      const createdClient = await api.createClient(newClient);
      toast.success('Cliente creado exitosamente');
      setClients([createdClient, ...clients]);
      onSelectClient(createdClient);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cliente');
    } finally {
      setIsCreating(false);
    }
  };

  const renderContent = () => {
    if (viewMode === 'search') {
      return (
        <div className="tecnotics-modal-content">
          <input
            type="text"
            className="tecnotics-input tecnotics-search-input"
            placeholder="Buscar cliente por nombre o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="tecnotics-modal-actions">
            <button
              className="tecnotics-btn tecnotics-btn-primary tecnotics-btn-block"
              onClick={() => setViewMode('create')}
              type="button"
            >
              Crear cliente nuevo
            </button>
          </div>

          <div className="tecnotics-results-list">
            {isLoading ? (
              <div className="tecnotics-loading-text">Cargando...</div>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client._id}
                  className="tecnotics-result-item"
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="tecnotics-result-name">{client.name}</div>
                  <div className="tecnotics-result-doc">
                    {client.doc_type}: {client.doc_number}
                  </div>
                  {client.email && (
                    <div className="tecnotics-result-detail">{client.email}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="tecnotics-empty-state">
                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === 'create') {
      return (
        <div className="tecnotics-modal-content">
          <button
            className="tecnotics-btn tecnotics-btn-link"
            onClick={() => setViewMode('search')}
            type="button"
          >
            ← Volver
          </button>

          <div className="tecnotics-form-section">
            <div className="tecnotics-form-row">
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Nombre completo *</label>
                <input
                  type="text"
                  className="tecnotics-input"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
            </div>

            <div className="tecnotics-form-row">
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Tipo de persona *</label>
                <select
                  className="tecnotics-input"
                  value={newClient.tipoPersona}
                  onChange={(e) => setNewClient({ ...newClient, tipoPersona: e.target.value as '1' | '2' })}
                >
                  <option value="2">Natural</option>
                  <option value="1">Jurídica</option>
                </select>
              </div>
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Tipo de documento *</label>
                <select
                  className="tecnotics-input"
                  value={newClient.doc_type}
                  onChange={(e) => setNewClient({ ...newClient, doc_type: e.target.value })}
                >
                  <option value="Cc">Cédula de Ciudadanía</option>
                  <option value="Nit">NIT</option>
                  <option value="Ce">Cédula de Extranjería</option>
                  <option value="Ti">Tarjeta de Identidad</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Pep">PEP</option>
                </select>
              </div>
            </div>

            <div className="tecnotics-form-row">
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Número de documento *</label>
                <input
                  type="text"
                  className="tecnotics-input"
                  value={newClient.doc_number}
                  onChange={(e) => setNewClient({ ...newClient, doc_number: e.target.value })}
                />
              </div>
            </div>

            <div className="tecnotics-form-row">
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Email *</label>
                <input
                  type="email"
                  className="tecnotics-input"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Teléfono *</label>
                <input
                  type="tel"
                  className="tecnotics-input"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="tecnotics-form-row">
              <div className="tecnotics-form-group">
                <label className="tecnotics-label">Dirección</label>
                <input
                  type="text"
                  className="tecnotics-input"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
            </div>

            <div className="tecnotics-modal-actions">
              <button
                className="tecnotics-btn tecnotics-btn-primary tecnotics-btn-block"
                onClick={handleCreateClient}
                type="button"
                disabled={isCreating}
              >
                {isCreating ? 'Creando...' : 'Crear Cliente'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Cliente" width="medium">
      {renderContent()}
    </Modal>
  );
};




