import React, { useState } from 'react';
import TreatmentRow from './TreatmentRow';
import { ShieldCheck, Receipt, Search } from 'lucide-react';

export default function SectionCalculator({
  title,
  type, // 'copago' | 'reembolso'
  badgeText,
  treatments,
  sessionsState,
  pricesState,
  patientPercent,
  onSessionChange,
  onPercentChange,
  showSearch = false
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter treatments if search query is entered
  const filteredTreatments = treatments.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate Section Subtotals
  let totalSessions = 0;
  let totalPackageValue = 0;
  let activeTreatmentsCount = 0;

  treatments.forEach(t => {
    const s = sessionsState[t.id] || 0;
    const p = pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice;
    if (s > 0) activeTreatmentsCount++;
    totalSessions += s;
    totalPackageValue += s * p;
  });

  return (
    <div className={`calc-card ${type}`}>
      <div className="calc-card-header">
        <div className="calc-title">
          <div className="calc-title-icon">
            {type === 'copago' ? <ShieldCheck size={24} /> : <Receipt size={24} />}
          </div>
          <div>
            <h2>{title}</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {type === 'copago' 
                ? 'Saludsa cubre su parte directo en Bioforce (Tú solo pagas el copago)' 
                : 'Pagas hoy en Bioforce y Saludsa te reembolsa el dinero a tu cuenta'}
            </div>
          </div>
        </div>
        <span className="calc-badge">{badgeText}</span>
      </div>

      {/* Search Input Box with Icon Properly Centered */}
      {showSearch && (
        <div className="search-filter-box">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="search-filter-input"
            placeholder="Buscar prestación (ej. Terapia, Masaje, Punción...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Treatments List */}
      <div className="treatment-list">
        {filteredTreatments.map(t => (
          <TreatmentRow
            key={t.id}
            treatment={t.name}
            unitPrice={pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice}
            sessions={sessionsState[t.id] || 0}
            onSessionsChange={(newVal) => onSessionChange(t.id, newVal)}
          />
        ))}

        {filteredTreatments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No se encontraron prestaciones con "{searchQuery}"
          </div>
        )}
      </div>

      {/* Subtotal Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.9rem 1.1rem',
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.25rem',
        border: '1px solid #e2e8f0'
      }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '700' }}>
            SESIONES EN ESTA MODALIDAD ({activeTreatmentsCount} SERVICIOS)
          </span>
          <strong style={{ fontSize: '1.15rem', color: 'var(--brand-navy)' }}>{totalSessions} Sesiones</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '700' }}>
            VALOR TOTAL MODALIDAD
          </span>
          <strong style={{ fontSize: '1.3rem', color: type === 'copago' ? 'var(--brand-green)' : 'var(--accent-orange)' }}>
            ${totalPackageValue.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Coverage Controls Box */}
      <div className="percentage-control-box">
        {type === 'copago' ? (
          <>
            <div className="percentage-header">
              <span>PORCENTAJE DE COPAGO (PAGO DIRECTO)</span>
              <span style={{ color: 'var(--brand-green)' }}>
                Paciente Paga: {patientPercent}% / Cobertura Directa: {100 - patientPercent}%
              </span>
            </div>

            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="range-slider"
                value={patientPercent}
                onChange={(e) => onPercentChange(Number(e.target.value))}
              />
            </div>

            <div className="percent-split-display">
              <div className="split-item">
                <span className="split-label">Copago Paciente en Caja ({patientPercent}%)</span>
                <span className="split-val" style={{ color: 'var(--brand-green)' }}>
                  ${((totalPackageValue * patientPercent) / 100).toFixed(2)}
                </span>
              </div>

              <div className="split-item" style={{ textAlign: 'right' }}>
                <span className="split-label">Aporte Directo Aseguradora ({100 - patientPercent}%)</span>
                <span className="split-val" style={{ color: 'var(--brand-blue)' }}>
                  ${((totalPackageValue * (100 - patientPercent)) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="percentage-header">
              <span>PORCENTAJE DE REEMBOLSO ASEGURADORA</span>
              <span style={{ color: 'var(--accent-orange)' }}>
                Reembolso Devuelto: {patientPercent}%
              </span>
            </div>

            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="range-slider"
                value={patientPercent}
                onChange={(e) => onPercentChange(Number(e.target.value))}
              />
            </div>

            <div className="percent-split-display">
              <div className="split-item">
                <span className="split-label">Pago Hoy en Bioforce (100%)</span>
                <span className="split-val" style={{ color: 'var(--accent-orange)' }}>
                  ${totalPackageValue.toFixed(2)}
                </span>
              </div>

              <div className="split-item" style={{ textAlign: 'right' }}>
                <span className="split-label">Reembolso que recibes ({patientPercent}%)</span>
                <span className="split-val" style={{ color: 'var(--brand-green)' }}>
                  ${((totalPackageValue * patientPercent) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
