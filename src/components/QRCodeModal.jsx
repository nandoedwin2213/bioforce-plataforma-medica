import React from 'react';
import { QrCode, X, Share2, MessageSquare, Download } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, patientInfo, summaryData }) {
  if (!isOpen) return null;

  const patientName = patientInfo?.fullName || patientInfo?.name || 'Paciente General';
  const quoteNum = patientInfo?.quoteNum || 'COT-001';

  const shareText = `*BIOFORCE MEDICAL CENTER - PROFORMA DE COBERTURA*\n` +
    `📌 *Cotización:* ${quoteNum}\n` +
    `👤 *Paciente:* ${patientName}\n` +
    `🆔 *C.I.:* ${patientInfo?.cedula || 'N/A'}\n` +
    `🏥 *Aseguradora:* ${patientInfo?.providerName || 'Saludsa'}\n` +
    `🩺 *Diagnóstico:* ${patientInfo?.diagnostico || 'Tratamiento Fisioterapéutico'}\n` +
    `---------------------------------------\n` +
    `📊 *Total Sesiones:* ${summaryData?.totalSessions || 0} sesiones\n` +
    `💳 *Pago Hoy en Caja Bioforce:* $${(summaryData?.totalPayTodayAtBioforce || 0).toFixed(2)}\n` +
    `🔄 *Reembolso Esperado:* $${(summaryData?.reembolsoRefundAmt || 0).toFixed(2)}\n` +
    `✨ *COSTO NETO FINAL PACIENTE:* $${(summaryData?.netFinalPatientCost || 0).toFixed(2)}\n` +
    `---------------------------------------\n` +
    `Dra. Elena Analuisa • Bioforce Fisioterapia & Biomecánica`;

  const encodedShareText = encodeURIComponent(shareText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedShareText}`;

  // Generate dynamic QR code URL
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`BIOFORCE ${quoteNum} - ${patientName} - Net: $${(summaryData?.netFinalPatientCost || 0).toFixed(2)}`)}`;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <QrCode size={22} style={{ color: 'var(--brand-green)' }} /> Enviar por WhatsApp & Código QR
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Escanea el código QR desde el celular del paciente o envía la proforma directamente por WhatsApp.
        </p>

        {/* QR Code Container */}
        <div style={{
          background: '#f8fafc',
          border: '2px dashed var(--brand-green)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'inline-block',
          marginBottom: '1.5rem'
        }}>
          <img 
            src={qrDataUrl} 
            alt="Código QR Cotización" 
            style={{ width: '200px', height: '200px', borderRadius: '12px' }}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: '800', color: 'var(--brand-navy)' }}>
            {quoteNum} • {patientName}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-success"
            style={{ justifyContent: 'center', fontSize: '0.95rem', padding: '0.85rem' }}
          >
            <MessageSquare size={20} /> Enviar Proforma por WhatsApp
          </a>

          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
