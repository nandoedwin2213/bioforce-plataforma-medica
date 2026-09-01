import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Search, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  FileText, 
  RefreshCw 
} from 'lucide-react';

export default function QuoteHistoryModal({ 
  isOpen, 
  onClose, 
  quotesHistory, 
  onLoadQuote, 
  onUpdateQuoteStatus 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredQuotes = quotesHistory.filter(q => 
    (q.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.cedula || '').includes(searchTerm) ||
    (q.quoteNum || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export CSV Handler
  const handleExportCSV = () => {
    if (quotesHistory.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No. Cotizacion,Fecha,Hora,Paciente,Cedula,Aseguradora,Diagnostico,Sesiones,Total Pago Hoy,Reembolso,Costo Neto,Estado Reembolso\n";

    quotesHistory.forEach(q => {
      const line = `"${q.quoteNum}","${q.date}","${q.time}","${q.patientName}","${q.cedula}","${q.providerName}","${q.diagnostico}",${q.totalSessions},${q.totalPayTodayAtBioforce},${q.reembolsoRefundAmt},${q.netFinalPatientCost},"${q.status || 'Atendido'}"`;
      csvContent += line + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bioforce_CRM_Cotizaciones_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    if (status === 'Cobrado') {
      return <span style={{ background: '#e6f7ef', color: '#00b865', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>🟢 Reembolso Cobrado</span>;
    } else if (status === 'Tramite') {
      return <span style={{ background: '#fff7ed', color: '#ea580c', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>🟠 Trámite en Aseguradora</span>;
    } else if (status === 'Facturado') {
      return <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>🔵 Factura Entregada</span>;
    }
    return <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>🟡 Atendido</span>;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <Database size={22} style={{ color: 'var(--brand-green)' }} /> Historial de Cotizaciones & CRM de Pacientes
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" onClick={handleExportCSV} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Download size={15} /> Exportar Excel / CSV
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Consulta el historial de pacientes cotizados, recarga sus expedientes en 1 clic y gestiona el seguimiento del cobro de sus reembolsos.
        </p>

        {/* Search Bar */}
        <div className="search-filter-box" style={{ marginBottom: '1rem' }}>
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="search-filter-input"
            placeholder="Buscar por Nombre del Paciente, Cédula o No. Cotización..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quotes Table */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#06152b', textAlign: 'left', borderBottom: '1.5px solid #cbd5e1' }}>
                <th style={{ padding: '8px 12px' }}>No. Cot</th>
                <th style={{ padding: '8px 12px' }}>Fecha</th>
                <th style={{ padding: '8px 12px' }}>Paciente / C.I.</th>
                <th style={{ padding: '8px 12px' }}>Aseguradora</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Sesiones</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Pago Hoy</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Costo Neto</th>
                <th style={{ padding: '8px 12px' }}>Estado Reembolso</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((q, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 'bold', color: 'var(--brand-green)' }}>{q.quoteNum}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{q.date}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{q.patientName || 'General'}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>C.I: {q.cedula || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '8px 12px', fontWeight: '600', color: '#0077ff' }}>{q.providerName || 'Saludsa'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 'bold' }}>{q.totalSessions}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#ea580c' }}>${(q.totalPayTodayAtBioforce || 0).toFixed(2)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#00b865' }}>${(q.netFinalPatientCost || 0).toFixed(2)}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <select
                      value={q.status || 'Atendido'}
                      onChange={(e) => onUpdateQuoteStatus(q.quoteNum, e.target.value)}
                      style={{ padding: '2px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                      <option value="Atendido">🟡 Atendido</option>
                      <option value="Facturado">🔵 Factura Entregada</option>
                      <option value="Tramite">🟠 Trámite Saludsa</option>
                      <option value="Cobrado">🟢 Reembolso Cobrado</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        onLoadQuote(q);
                        onClose();
                      }}
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      title="Cargar este expediente en la calculadora"
                    >
                      <RotateCcw size={12} /> Cargar
                    </button>
                  </td>
                </tr>
              ))}

              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    No hay cotizaciones guardadas en el historial.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Total Registros CRM: {quotesHistory.length} Cotizaciones
          </span>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
