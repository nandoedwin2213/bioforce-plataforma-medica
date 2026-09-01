import React from 'react';
import { Printer, X } from 'lucide-react';

export default function PrintQuoteModal({ 
  isOpen, 
  onClose, 
  patientInfo, 
  summaryData, 
  copagoTreatments, 
  reembolsoTreatments, 
  copagoSessions, 
  reembolsoSessions, 
  pricesState 
}) {
  if (!isOpen) return null;

  const currentDate = patientInfo.date || new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
  const currentTime = patientInfo.time || '15:35';

  const {
    copagoSessionsCount,
    copagoTotalVal,
    copagoPatientPercent,
    copagoPatientAmt,
    copagoSaludsaDirectAmt,

    reembolsoSessionsCount,
    reembolsoTotalVal,
    reembolsoRefundPercent,
    reembolsoPaidToday,
    reembolsoRefundAmt,

    applyDeducible,
    effectiveDeducible,
    selectedSaludsaPlanName,

    totalSessions,
    grandTotalTreatmentValue,
    totalPayTodayAtBioforce,
    totalSaludsaBenefit,
    netFinalPatientCost
  } = summaryData;

  // Active items filter
  const activeCopagoItems = copagoTreatments.filter(t => (copagoSessions[t.id] || 0) > 0);
  const activeReembolsoItems = reembolsoTreatments.filter(t => (reembolsoSessions[t.id] || 0) > 0);

  // Dedicated 1-Page Print Handler
  const handlePrint = () => {
    const printElement = document.getElementById('printable-quote-area');
    if (!printElement) return;

    const printWin = window.open('', '_blank', 'width=900,height=1100');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Proforma Bioforce - ${patientInfo.quoteNum || 'COT-001'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 0;
              margin: 0;
              width: 100%;
            }
            .print-table-compact {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            .print-table-compact th, .print-table-compact td {
              border: 1px solid #cbd5e1;
              padding: 5px 8px;
              font-size: 11px;
            }
            .print-table-compact th {
              background-color: #f1f5f9;
              font-weight: bold;
              color: #06152b;
            }
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
      <div className="modal-card print-document" style={{ maxWidth: '820px', padding: '1.5rem' }}>
        <div className="modal-header no-print" style={{ marginBottom: '1rem', paddingBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <Printer size={18} style={{ color: 'var(--brand-green)' }} /> Proforma Clínico-Financiera (1 Hoja)
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Printer size={15} /> Imprimir / Guardar PDF (1 Hoja)
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area Container */}
        <div id="printable-quote-area">
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '2px solid #00b865',
            paddingBottom: '0.6rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img 
                src="/logo-bioforce.jpg" 
                alt="Bioforce Logo" 
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00b865' }} 
              />
              <div>
                <h1 style={{ fontSize: '1.4rem', color: '#06152b', fontWeight: '900', margin: 0, lineHeight: 1.1 }}>
                  BIOFORCE
                </h1>
                <p style={{ fontSize: '0.72rem', color: '#00b865', fontWeight: 'bold', margin: 0 }}>
                  BIOMECÁNICA DEPORTIVA & RENDIMIENTO FÍSICO MILITAR
                </p>
                <p style={{ fontSize: '0.68rem', color: '#475569', margin: 0 }}>
                  Convenio Oficial {patientInfo.providerName || 'Saludsa Medicina Prepagada'}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                background: '#e6f7ef', 
                color: '#00b865', 
                padding: '3px 10px', 
                borderRadius: '4px', 
                fontWeight: '800', 
                fontSize: '0.75rem',
                display: 'inline-block',
                marginBottom: '2px',
                border: '1px solid rgba(0, 184, 101, 0.3)'
              }}>
                PROFORMA CLÍNICA DE COBERTURA
              </div>
              <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>
                Fecha: {currentDate} | Hora: {currentTime}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>
                No. Cotización: {patientInfo.quoteNum || 'COT-001'}
              </div>
            </div>
          </div>

          {/* Complete Clinical Patient Filiación Box */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #cbd5e1', 
            borderRadius: '6px', 
            padding: '0.6rem 0.85rem', 
            marginBottom: '0.75rem',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '0.5rem 0.85rem',
            fontSize: '0.74rem'
          }}>
            <div>
              <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>PACIENTE (NOMBRES Y APELLIDOS)</span>
              <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{patientInfo.name || 'Paciente General'}</strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>CÉDULA DE IDENTIDAD</span>
              <strong style={{ color: '#0f172a' }}>{patientInfo.cedula || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>F. NACIMIENTO / EDAD</span>
              <strong style={{ color: '#0f172a' }}>{patientInfo.dob || 'N/A'} {patientInfo.calculatedAge ? `(${patientInfo.calculatedAge})` : ''}</strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>CONVENIO / PLAN</span>
              <strong style={{ color: '#0077ff' }}>{patientInfo.providerName || 'Saludsa'} ({patientInfo.saludsaPlanName || 'Estándar'})</strong>
            </div>

            <div style={{ gridColumn: 'span 3' }}>
              <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>DIAGNÓSTICO MÉDICO</span>
              <strong style={{ color: '#06152b' }}>{patientInfo.diagnostico || 'Evaluación e Indicación Fisioterapéutica'}</strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>CÓDIGO CIE-10</span>
              <strong style={{ color: '#00b865', background: 'rgba(0, 184, 101, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                {patientInfo.cie10 || 'N/A'}
              </strong>
            </div>
          </div>

          {/* Consolidated Table for Active Treatments */}
          <table className="print-table-compact" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.75rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#06152b', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Modalidad</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Prestación / Servicio</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Sesiones</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>P. Unit</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Subtotal</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Pago Hoy en Caja</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Reembolso Saludsa</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.73rem', color: '#1e293b' }}>
              {/* Active Copago Items */}
              {activeCopagoItems.map(t => {
                const s = copagoSessions[t.id];
                const price = pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice;
                const sub = s * price;
                const payToday = (sub * copagoPatientPercent) / 100;
                return (
                  <tr key={`print-copago-${t.id}`}>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#00b865' }}>COPAGO</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', fontWeight: '600' }}>{t.name}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }}>{s}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{price === 0 ? 'Gratis' : `$${price.toFixed(2)}`}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>${sub.toFixed(2)}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold', color: '#00b865' }}>${payToday.toFixed(2)}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#64748b' }}>- (Directo)</td>
                  </tr>
                );
              })}

              {/* Active Reembolso Items */}
              {activeReembolsoItems.map(t => {
                const s = reembolsoSessions[t.id];
                const price = pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice;
                const sub = s * price;
                return (
                  <tr key={`print-reemb-${t.id}`}>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#ff8c00' }}>REEMBOLSO</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', fontWeight: '600' }}>{t.name}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }}>{s}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>${price.toFixed(2)}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>${sub.toFixed(2)}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold', color: '#ff8c00' }}>${sub.toFixed(2)}</td>
                    <td style={{ padding: '3px 6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold', color: '#00b865' }}>${reembolsoRefundAmt.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {applyDeducible && effectiveDeducible > 0 && (
            <div style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 'bold', margin: '4px 0 8px 0', textAlign: 'right' }}>
              * Se aplicó un deducible anual de ${effectiveDeducible.toFixed(2)} a la primera cobertura del reclamo.
            </div>
          )}

          {/* Financial Totals Summary Bar */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1.5px solid #cbd5e1', 
            borderRadius: '6px', 
            padding: '0.5rem 0.75rem', 
            marginBottom: '0.85rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '0.5rem',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', display: 'block' }}>
                TOTAL SESIONES
              </span>
              <strong style={{ fontSize: '1.05rem', color: '#06152b' }}>{totalSessions} Sesiones</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', display: 'block' }}>
                PAGO HOY EN CAJA
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#ff8c00' }}>${totalPayTodayAtBioforce.toFixed(2)}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', display: 'block' }}>
                REEMBOLSO DE SALUDSA
              </span>
              <strong style={{ fontSize: '1.1rem', color: '#0077ff' }}>${reembolsoRefundAmt.toFixed(2)}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', display: 'block' }}>
                COSTO NETO FINAL
              </span>
              <strong style={{ fontSize: '1.2rem', color: '#00b865' }}>${netFinalPatientCost.toFixed(2)}</strong>
            </div>
          </div>

          {/* Signature Block for Dra. Elena Analuisa & Patient */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '1.2rem',
            paddingTop: '0.4rem'
          }}>
            <div style={{ textAlign: 'center', width: '230px' }}>
              <div style={{ borderBottom: '1.5px solid #06152b', marginBottom: '3px', height: '32px' }}></div>
              <strong style={{ fontSize: '0.76rem', color: '#06152b', display: 'block' }}>Dra. Elena Analuisa</strong>
              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block' }}>Especialista en Fisioterapia & Biomecánica</span>
              <span style={{ fontSize: '0.64rem', color: '#00b865', fontWeight: 'bold' }}>BIOFORCE MEDICAL CENTER</span>
            </div>

            <div style={{ textAlign: 'center', width: '230px' }}>
              <div style={{ borderBottom: '1.5px solid #06152b', marginBottom: '3px', height: '32px' }}></div>
              <strong style={{ fontSize: '0.76rem', color: '#06152b', display: 'block' }}>Aceptación del Paciente</strong>
              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block' }}>Firma / C.I.: {patientInfo.cedula || '--------------------'}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ marginTop: '0.6rem', fontSize: '0.62rem', color: '#94a3b8', textAlign: 'center' }}>
            Cotización oficial válida por 30 días. Cobertura sujeta a condiciones contractuales de Saludsa (Máx. 30 terapias/año). Documento emitido por Bioforce.
          </div>
        </div>
      </div>
    </div>
  );
}
