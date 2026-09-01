import React, { useState } from 'react';
import { Settings, X, RotateCcw, ShieldCheck, Receipt } from 'lucide-react';

export default function PriceSettingsModal({ 
  isOpen, 
  onClose, 
  copagoTreatments, 
  reembolsoTreatments, 
  pricesState, 
  onUpdatePrice, 
  onResetPrices 
}) {
  const [activeTab, setActiveTab] = useState('copago');

  if (!isOpen) return null;

  const currentTreatments = activeTab === 'copago' ? copagoTreatments : reembolsoTreatments;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <Settings size={20} style={{ color: 'var(--brand-green)' }} /> Configuración de Tarifas Convenio Saludsa
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Puedes consultar o modificar los precios unitarios de cada prestación firmada en el convenio con Saludsa.
        </p>

        {/* Tabs for Copago / Reembolso */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            className={`btn ${activeTab === 'copago' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('copago')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <ShieldCheck size={16} /> Convenio Copago ({copagoTreatments.length})
          </button>
          <button
            className={`btn ${activeTab === 'reembolso' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reembolso')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Receipt size={16} /> Convenio Reembolso ({reembolsoTreatments.length})
          </button>
        </div>

        {/* Treatment Prices List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '1.5rem' }}>
          {currentTreatments.map(t => {
            const currentPrice = pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice;
            return (
              <div key={t.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)'
              }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--brand-navy)', display: 'block' }}>{t.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Convenio Oficial: {t.defaultPrice === 0 ? 'Gratuito' : `$${t.defaultPrice.toFixed(2)}`}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    style={{
                      width: '90px',
                      padding: '0.4rem 0.6rem',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--brand-navy)',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}
                    value={currentPrice}
                    onChange={(e) => onUpdatePrice(t.id, parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={onResetPrices}>
            <RotateCcw size={16} /> Restablecer Tarifas Firmadas
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
