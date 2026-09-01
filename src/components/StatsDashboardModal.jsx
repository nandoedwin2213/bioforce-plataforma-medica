import React from 'react';
import { TrendingUp, X, DollarSign, Users, Award, ShieldCheck, PieChart, Activity } from 'lucide-react';

export default function StatsDashboardModal({ isOpen, onClose, quotesHistory }) {
  if (!isOpen) return null;

  const totalQuotesCount = quotesHistory.length;
  let totalQuotedValue = 0;
  let totalSavedByPatients = 0;
  let totalSessionsSum = 0;

  const pathologyMap = {};

  quotesHistory.forEach(q => {
    totalQuotedValue += q.grandTotalTreatmentValue || 0;
    totalSavedByPatients += q.reembolsoRefundAmt || 0;
    totalSessionsSum += q.totalSessions || 0;

    const diag = q.diagnostico || 'General';
    pathologyMap[diag] = (pathologyMap[diag] || 0) + 1;
  });

  const avgValuePerQuote = totalQuotesCount > 0 ? (totalQuotedValue / totalQuotesCount) : 0;

  // Sorted top pathologies
  const sortedPathologies = Object.entries(pathologyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '850px', padding: '2rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <TrendingUp size={24} style={{ color: 'var(--brand-green)' }} /> Dashboard Gerencial & Analíticas de Cotización
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Métricas clave acumuladas del centro médico Bioforce basadas en las cotizaciones emitidas a aseguradoras.
        </p>

        {/* 4 Executive KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>TOTAL COTIZACIONES</span>
            <strong style={{ fontSize: '1.8rem', color: '#06152b' }}>{totalQuotesCount}</strong>
          </div>

          <div style={{ background: '#e6f7ef', border: '1.5px solid rgba(0, 184, 101, 0.4)', borderRadius: '12px', padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#00b865', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>VALOR ACUMULADO</span>
            <strong style={{ fontSize: '1.8rem', color: '#00b865' }}>${totalQuotedValue.toFixed(2)}</strong>
          </div>

          <div style={{ background: '#eff6ff', border: '1.5px solid rgba(0, 119, 255, 0.4)', borderRadius: '12px', padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#0077ff', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>AHORRO PACIENTES</span>
            <strong style={{ fontSize: '1.8rem', color: '#0077ff' }}>${totalSavedByPatients.toFixed(2)}</strong>
          </div>

          <div style={{ background: '#fff7ed', border: '1.5px solid rgba(255, 140, 0, 0.4)', borderRadius: '12px', padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>PROMEDIO COTIZACIÓN</span>
            <strong style={{ fontSize: '1.8rem', color: '#ea580c' }}>${avgValuePerQuote.toFixed(2)}</strong>
          </div>
        </div>

        {/* Top Pathologies Table */}
        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#06152b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={18} style={{ color: 'var(--brand-green)' }} /> Patologías Traumatológicas Más Cotizadas en Bioforce
          </h4>

          {sortedPathologies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {sortedPathologies.map(([diag, count], idx) => {
                const pct = totalQuotesCount > 0 ? ((count / totalQuotesCount) * 100).toFixed(0) : 0;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                      {idx + 1}. {diag}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--brand-green)' }}>{count} Cotizaciones</span>
                      <span style={{ background: 'rgba(0, 184, 101, 0.1)', color: 'var(--brand-green)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
              Sin suficientes registros en el historial CRM.
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
