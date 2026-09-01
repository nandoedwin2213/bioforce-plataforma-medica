import React, { useState } from 'react';
import { 
  CreditCard, 
  RefreshCw, 
  ShieldCheck, 
  Wallet, 
  MessageSquareQuote, 
  Copy, 
  Check, 
  Volume2, 
  PieChart, 
  TrendingDown, 
  Sparkles 
} from 'lucide-react';

export default function SummaryCard({ summaryData, patientInfo, onShowToast }) {
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
    reembolsoNetPatientCost,

    totalSessions,
    grandTotalTreatmentValue,
    totalPayTodayAtBioforce,
    totalSaludsaBenefit,
    netFinalPatientCost
  } = summaryData;

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Generate spoken script for patient presentation
  const patientName = patientInfo?.fullName?.trim() || patientInfo?.name?.trim() || 'Estimado Paciente';
  
  const explanationScript = `Hola ${patientName}, traumatología te recetó un tratamiento de ${totalSessions} sesiones en total (${copagoSessionsCount} por convenio Copago y ${reembolsoSessionsCount} por Reembolso). El costo total del paquete sin seguro es de $${grandTotalTreatmentValue.toFixed(2)}. Sin embargo, con tu seguro Saludsa, hoy en caja de Bioforce únicamente pagas $${totalPayTodayAtBioforce.toFixed(2)} ($${copagoPatientAmt.toFixed(2)} de tu copago más $${reembolsoPaidToday.toFixed(2)} del reembolso). Saludsa te devolverá $${reembolsoRefundAmt.toFixed(2)} directamente a tu cuenta bancaria, por lo que tu costo real final por este tratamiento completo será de solo $${netFinalPatientCost.toFixed(2)} (Saludsa asume $${totalSaludsaBenefit.toFixed(2)} de tu tratamiento).`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(explanationScript);
    setCopied(true);
    if (onShowToast) onShowToast('✨ Texto explicativo copiado al portapapeles');
    setTimeout(() => setCopied(false), 2500);
  };

  // Speech Synthesis Audio Player
  const handleToggleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(explanationScript);
        utterance.lang = 'es-EC';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      if (onShowToast) onShowToast('Audio no soportado en este navegador');
    }
  };

  // SVG Donut Calculations
  const totalValForChart = grandTotalTreatmentValue || 1;
  const copagoPatientPct = (copagoPatientAmt / totalValForChart) * 100;
  const copagoSaludsaPct = (copagoSaludsaDirectAmt / totalValForChart) * 100;
  const reembolsoRefundPct = (reembolsoRefundAmt / totalValForChart) * 100;

  // Savings Comparison Calculation
  const totalSavingsDollars = grandTotalTreatmentValue - netFinalPatientCost;
  const totalSavingsPercentage = grandTotalTreatmentValue > 0 ? ((totalSavingsDollars / grandTotalTreatmentValue) * 100).toFixed(1) : 0;

  return (
    <div className="summary-dashboard">
      <div className="dashboard-title">
        <div>
          <h2>Resumen Clínico-Financiero de Cobertura</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Consolidado inteligente de lo que el paciente paga en caja hoy, lo que le devuelve Saludsa y el costo final neto.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="summary-cards-grid">
        {/* Card 1: What Patient Pays TODAY at Bioforce */}
        <div className="summary-card accent-patient">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-label">1. PAGO HOY EN CAJA BIOFORCE</span>
            <CreditCard size={24} style={{ color: 'var(--brand-green)' }} />
          </div>
          <div className="card-value patient">${totalPayTodayAtBioforce.toFixed(2)}</div>
          <div className="card-breakdown-sub">
            <span>Copago Hoy: ${copagoPatientAmt.toFixed(2)}</span>
            <span>Reembolso Hoy: ${reembolsoPaidToday.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 2: What Saludsa REIMBURSES to Patient */}
        <div className="summary-card accent-saludsa">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-label">2. REEMBOLSO SALUDSA A TU CUENTA</span>
            <RefreshCw size={24} style={{ color: 'var(--brand-blue)' }} />
          </div>
          <div className="card-value saludsa">${reembolsoRefundAmt.toFixed(2)}</div>
          <div className="card-breakdown-sub">
            <span>Reembolso ({reembolsoRefundPercent}%): ${reembolsoRefundAmt.toFixed(2)}</span>
            <span>Dinero que Recuperas</span>
          </div>
        </div>

        {/* Card 3: Total Saludsa Direct + Refund Benefit */}
        <div className="summary-card accent-saludsa">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-label">3. COBERTURA TOTAL SALUDSA</span>
            <ShieldCheck size={24} style={{ color: 'var(--brand-blue)' }} />
          </div>
          <div className="card-value saludsa">${totalSaludsaBenefit.toFixed(2)}</div>
          <div className="card-breakdown-sub">
            <span>Aporte Directo: ${copagoSaludsaDirectAmt.toFixed(2)}</span>
            <span>+ Reembolso: ${reembolsoRefundAmt.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 4: Net Final Out-of-Pocket Cost for Patient */}
        <div className="summary-card accent-total">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-label">4. COSTO NETO FINAL PACIENTE</span>
            <Wallet size={24} style={{ color: 'var(--brand-navy)' }} />
          </div>
          <div className="card-value total">${netFinalPatientCost.toFixed(2)}</div>
          <div className="card-breakdown-sub">
            <span>Costo Real Final tras Reembolso</span>
            <span>{totalSessions} Sesiones Totales</span>
          </div>
        </div>
      </div>

      {/* NEW WOW FEATURE: Live Patient Savings Comparison Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #06152b 0%, #0044aa 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 1.75rem',
        marginBottom: '1.75rem',
        boxShadow: '0 15px 35px rgba(6, 21, 43, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sparkles size={20} style={{ color: '#00d06c' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#ffffff' }}>
              SIMULADOR DE AHORRO REAL DEL PACIENTE
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            Comparativa directa de costo particular sin seguro vs. costo neto real con el convenio Bioforce.
          </p>

          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', display: 'block' }}>VALOR PARTICULAR SIN SEGURO</span>
              <strong style={{ fontSize: '1.25rem', color: '#ff6b6b', textDecoration: 'line-through' }}>${grandTotalTreatmentValue.toFixed(2)}</strong>
            </div>

            <div style={{ fontSize: '1.5rem', color: '#cbd5e1' }}>→</div>

            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#00d06c', fontWeight: 'bold', display: 'block' }}>COSTO NETO CON CONVENIO</span>
              <strong style={{ fontSize: '1.4rem', color: '#00d06c' }}>${netFinalPatientCost.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 208, 108, 0.15)',
          border: '2px solid #00d06c',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          textAlign: 'center',
          minWidth: '220px'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', display: 'block' }}>AHORRO TOTAL PACIENTE</span>
          <strong style={{ fontSize: '2rem', color: '#00d06c', fontFamily: 'Outfit, sans-serif', display: 'block', lineHeight: 1.1 }}>
            ${totalSavingsDollars.toFixed(2)}
          </strong>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff', background: '#00b865', padding: '2px 10px', borderRadius: '12px', display: 'inline-block', marginTop: '4px' }}>
            ¡Ahorra {totalSavingsPercentage}% de su tratamiento!
          </span>
        </div>
      </div>

      {/* Holographic Ring Donut Chart */}
      <div className="donut-chart-container">
        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="140" height="140" viewBox="0 0 42 42" className="donut">
            <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#ffffff"></circle>
            <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e8f0" strokeWidth="4"></circle>
            
            {/* Copago Patient Segment */}
            <circle 
              cx="21" cy="21" r="15.91549430918954" 
              fill="transparent" 
              stroke="#00b865" 
              strokeWidth="4.5"
              strokeDasharray={`${copagoPatientPct} ${100 - copagoPatientPct}`}
              strokeDashoffset="25"
            />
            {/* Saludsa Direct Segment */}
            <circle 
              cx="21" cy="21" r="15.91549430918954" 
              fill="transparent" 
              stroke="#0077ff" 
              strokeWidth="4.5"
              strokeDasharray={`${copagoSaludsaPct} ${100 - copagoSaludsaPct}`}
              strokeDashoffset={`${25 - copagoPatientPct}`}
            />
            {/* Reembolso Refund Segment */}
            <circle 
              cx="21" cy="21" r="15.91549430918954" 
              fill="transparent" 
              stroke="#ff8c00" 
              strokeWidth="4.5"
              strokeDasharray={`${reembolsoRefundPct} ${100 - reembolsoRefundPct}`}
              strokeDashoffset={`${25 - copagoPatientPct - copagoSaludsaPct}`}
            />
          </svg>

          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '800', display: 'block' }}>TOTAL</span>
            <strong style={{ fontSize: '1rem', color: 'var(--brand-navy)' }}>${grandTotalTreatmentValue.toFixed(0)}</strong>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--brand-navy)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PieChart size={18} style={{ color: 'var(--brand-green)' }} /> Gráfico de Proporciones Financieras
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Visualización gráfica de la inversión del paciente vs. el ahorro cubierto por el seguro Saludsa.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-green)' }} />
              <strong>Copago Hoy:</strong> ${copagoPatientAmt.toFixed(2)} ({copagoPatientPct.toFixed(0)}%)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-blue)' }} />
              <strong>Saludsa Directo:</strong> ${copagoSaludsaDirectAmt.toFixed(2)} ({copagoSaludsaPct.toFixed(0)}%)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-orange)' }} />
              <strong>Reembolso a Devuelver:</strong> ${reembolsoRefundAmt.toFixed(2)} ({reembolsoRefundPct.toFixed(0)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Spoken Script Box for Staff / Patient Explanation with Speech Player */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 184, 101, 0.08) 0%, rgba(0, 119, 255, 0.06) 100%)',
        border: '1.5px solid rgba(0, 184, 101, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
            <MessageSquareQuote size={20} style={{ color: 'var(--brand-green)' }} /> Explicación Rápida para el Paciente:
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn ${isPlayingAudio ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleToggleSpeak}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              title="Escuchar locución automática"
            >
              <Volume2 size={14} className={isPlayingAudio ? 'pulse-dot' : ''} />
              {isPlayingAudio ? 'Detener Voz' : 'Escuchar Voz'}
            </button>

            <button 
              className="btn btn-outline" 
              onClick={handleCopyScript} 
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado' : 'Copiar Texto'}
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: '1.6', fontWeight: '500' }}>
          "{explanationScript}"
        </p>
      </div>
    </div>
  );
}
