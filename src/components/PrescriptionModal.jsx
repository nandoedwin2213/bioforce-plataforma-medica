import React from 'react';
import { FileText, X, Printer, Stethoscope, ShieldCheck } from 'lucide-react';

export default function PrescriptionModal({ 
  isOpen, 
  onClose, 
  patientInfo, 
  summaryData, 
  copagoTreatments, 
  reembolsoTreatments, 
  copagoSessions, 
  reembolsoSessions 
}) {
  if (!isOpen) return null;

  const currentDate = patientInfo?.date || new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });

  // Filter active items
  const activeCopagoItems = copagoTreatments.filter(t => (copagoSessions[t.id] || 0) > 0);
  const activeReembolsoItems = reembolsoTreatments.filter(t => (reembolsoSessions[t.id] || 0) > 0);

  const handlePrintPrescription = () => {
    const printElement = document.getElementById('printable-prescription-area');
    if (!printElement) return;

    const printWin = window.open('', '_blank', 'width=900,height=1100');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Prescripción Médica Bioforce - ${patientInfo.quoteNum || 'COT-001'}</title>
          <style>
            @page { size: A4 portrait; margin: 8mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #0f172a; padding: 15px; }
            .presc-box { border: 1.5px solid #cbd5e1; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: #f8fafc; }
            .presc-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .presc-table th, .presc-table td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 11px; }
            .presc-table th { background: #f1f5f9; color: #06152b; font-weight: bold; text-align: left; }
          </style>
        </head>
        <body>
          ${printElement.innerHTML}
        </body>
      </html>
    `);

    printWin.document.close();
    printWin.focus();

    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 300);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '780px', padding: '1.75rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <FileText size={22} style={{ color: 'var(--brand-green)' }} /> Orden & Prescripción Fisioterapéutica Médica
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handlePrintPrescription} style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
              <Printer size={15} /> Imprimir Orden Médica
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area Container */}
        <div id="printable-prescription-area">
          <div style={{ borderBottom: '2px solid #00b865', paddingBottom: '0.6rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.3rem', color: '#06152b', fontWeight: '900', margin: 0 }}>BIOFORCE MEDICAL CENTER</h1>
              <p style={{ fontSize: '0.72rem', color: '#00b865', fontWeight: 'bold' }}>ORDEN DE REHABILITACIÓN FÍSICA & BIOMECÁNICA</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
              <strong>Convenio {patientInfo?.providerName || 'Saludsa'}</strong><br />
              Fecha: {currentDate}
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>PACIENTE</span>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{patientInfo?.fullName || 'Paciente General'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>CÉDULA DE IDENTIDAD</span>
              <strong>{patientInfo?.cedula || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>EDAD</span>
              <strong>{patientInfo?.calculatedAge || 'N/A'}</strong>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>DIAGNÓSTICO MÉDICO PRESUNTIVO/DEFINITIVO</span>
              <strong style={{ color: '#06152b' }}>{patientInfo?.diagnostico || 'Tratamiento Fisioterapéutico'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>CÓDIGO CIE-10</span>
              <strong style={{ color: '#00b865' }}>{patientInfo?.cie10 || 'N/A'}</strong>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#06152b', marginBottom: '0.5rem' }}>
            INDICACIÓN DE PRESTACIONES TERAPÉUTICAS PRESCRITAS:
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#06152b', borderBottom: '1.5px solid #cbd5e1' }}>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Modalidad</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Prestación / Técnica</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Sesiones Prescritas</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Frecuencia Sugerida</th>
              </tr>
            </thead>
            <tbody>
              {activeCopagoItems.map(t => (
                <tr key={`presc-copago-${t.id}`}>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#00b865' }}>Copago Directo</td>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: '600' }}>{t.name}</td>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }}>{copagoSessions[t.id]}</td>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', color: '#64748b' }}>Interdiaria (3 veces por semana)</td>
                </tr>
              ))}

              {activeReembolsoItems.map(t => (
                <tr key={`presc-reemb-${t.id}`}>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#ff8c00' }}>Reembolso</td>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: '600' }}>{t.name}</td>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }}>{reembolsoSessions[t.id]}</td>
                  <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', color: '#64748b' }}>Según protocolo de ondas/láser</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '0.5rem' }}>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <div style={{ borderBottom: '1.5px solid #06152b', height: '35px', marginBottom: '4px' }}></div>
              <strong style={{ fontSize: '0.78rem', color: '#06152b', display: 'block' }}>Dra. Elena Analuisa</strong>
              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block' }}>Especialista en Fisioterapia & Biomecánica</span>
              <span style={{ fontSize: '0.64rem', color: '#00b865', fontWeight: 'bold' }}>MSP Reg. Official Bioforce</span>
            </div>

            <div style={{ textAlign: 'center', width: '220px' }}>
              <div style={{ borderBottom: '1.5px solid #06152b', height: '35px', marginBottom: '4px' }}></div>
              <strong style={{ fontSize: '0.78rem', color: '#06152b', display: 'block' }}>Médico Tratante / Traumatólogo</strong>
              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block' }}>Firma y Sello Médico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
