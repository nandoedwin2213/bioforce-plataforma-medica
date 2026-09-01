import React from 'react';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';

export default function TreatmentRow({ treatment, sessions, unitPrice, onSessionsChange }) {
  const subtotal = sessions * unitPrice;
  const isActive = sessions > 0;

  const handleDecrement = () => {
    if (sessions > 0) {
      onSessionsChange(sessions - 1);
    }
  };

  const handleIncrement = () => {
    onSessionsChange(sessions + 1);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) {
      onSessionsChange(0);
    } else {
      onSessionsChange(val);
    }
  };

  return (
    <div className={`treatment-row ${isActive ? 'active' : ''}`}>
      <div>
        <div className="treatment-name" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.3rem' }}>
          {isActive && <CheckCircle2 size={15} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />}
          <span>{treatment}</span>
          {isActive && (
            <span className="badge-session-pill">
              {sessions} {sessions === 1 ? 'Sesión' : 'Sesiones'}
            </span>
          )}
        </div>
        <div className="unit-price">
          Valor Unitario: {unitPrice === 0 ? 'Gratuito' : `$${unitPrice.toFixed(2)}`}
        </div>
      </div>

      <div className="stepper-control">
        <button 
          type="button" 
          className="stepper-btn" 
          onClick={handleDecrement}
          title="Disminuir sesión"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          min="0"
          className="stepper-input"
          value={sessions}
          onChange={handleInputChange}
        />
        <button 
          type="button" 
          className="stepper-btn" 
          onClick={handleIncrement}
          title="Aumentar sesión"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="row-total-val">
        ${subtotal.toFixed(2)}
      </div>
    </div>
  );
}
