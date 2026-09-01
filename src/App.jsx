import React, { useState, useEffect } from 'react';
import SectionCalculator from './components/SectionCalculator';
import SummaryCard from './components/SummaryCard';
import PrintQuoteModal from './components/PrintQuoteModal';
import PriceSettingsModal from './components/PriceSettingsModal';
import QuoteHistoryModal from './components/QuoteHistoryModal';
import QRCodeModal from './components/QRCodeModal';
import ReceptionGuideModal from './components/ReceptionGuideModal';
import PrescriptionModal from './components/PrescriptionModal';
import StatsDashboardModal from './components/StatsDashboardModal';
import AdminLoginModal from './components/AdminLoginModal';
import LandingLoginPage from './components/LandingLoginPage';
import { 
  Printer, 
  Settings, 
  RotateCcw, 
  Sparkles, 
  User, 
  Calendar, 
  CreditCard, 
  Clock, 
  Stethoscope, 
  FileCode,
  Activity,
  Heart,
  ShieldCheck,
  Building2,
  Database,
  QrCode,
  AlertTriangle,
  Award,
  BookOpen,
  Info,
  FileText,
  TrendingUp,
  KeyRound,
  Lock,
  LogOut,
  Home
} from 'lucide-react';

export const COPAGO_TREATMENTS = [
  { id: 'evaluacion', name: 'EVALUACIÓN INICIAL', defaultPrice: 0 },
  { id: 'terapia', name: 'TERAPIA FÍSICA', defaultPrice: 17 },
  { id: 'puncion_fitback', name: 'PUNCIÓN FIT BACK (ARTICULAR)', defaultPrice: 15 },
  { id: 'magnetoterapia', name: 'MAGNETOTERAPIA', defaultPrice: 10 },
  { id: 'ultrasonido', name: 'ULTRASONIDO', defaultPrice: 10 },
  { id: 'electroterapia', name: 'ELECTROTERAPIA', defaultPrice: 10 },
  { id: 'ceragem', name: 'CAMA CERAGEM', defaultPrice: 12 },
  { id: 'cpm', name: 'C.P.M.', defaultPrice: 17 },
  { id: 'electropuncion', name: 'ELECTROPUNCIÓN', defaultPrice: 15 },
  { id: 'fortalecimiento', name: 'FORTALECIMIENTO MUSCULAR', defaultPrice: 10 },
  { id: 'acondicionamiento', name: 'ACONDICIONAMIENTO FÍSICO', defaultPrice: 8 },
  { id: 'gimnasio', name: 'GIMNASIO TERAPÉUTICO', defaultPrice: 8 },
  { id: 'masaje_descarga', name: 'MASAJE DE DESCARGA MUSCULAR', defaultPrice: 8 },
  { id: 'masaje_cyriax', name: 'MASAJE CYRIAX (TRANSVERSO PROFUNDO)', defaultPrice: 8 },
  { id: 'masaje_antistress', name: 'MASAJE ANTISTRESS', defaultPrice: 8 },
  { id: 'masaje_descontracturante', name: 'MASAJE DESCONTRACTURANTE', defaultPrice: 8 },
  { id: 'kinesiotaping', name: 'KINESIOTAPING', defaultPrice: 8 },
  { id: 'sueroterapia', name: 'SUEROTERAPIA', defaultPrice: 12 },
  { id: 'presoterapia', name: 'PRESOTERAPIA', defaultPrice: 12 }
];

export const REEMBOLSO_TREATMENTS = [
  { id: 'ondas', name: 'ONDAS DE CHOQUE', defaultPrice: 55 },
  { id: 'laser', name: 'LÁSER DE ALTA INTENSIDAD', defaultPrice: 25 },
  { id: 'prp', name: 'PLASMA RICO EN PLAQUETAS', defaultPrice: 35 }
];

// Multi-Aseguradoras Catalog & Rules
export const INSURANCE_PROVIDERS = [
  { id: 'saludsa', name: 'Saludsa Medicina Prepagada (Convenio Oficial)', copagoPct: 30, reembPct: 100 },
  { id: 'humana', name: 'Humana S.A. Medicina Prepagada', copagoPct: 20, reembPct: 80 },
  { id: 'ecuasanitas', name: 'Ecuasanitas S.A.', copagoPct: 30, reembPct: 80 },
  { id: 'confiamed', name: 'Confiamed Medicina Prepagada', copagoPct: 25, reembPct: 80 },
  { id: 'bmi', name: 'BMI Igualdad / Salud', copagoPct: 20, reembPct: 90 },
  { id: 'equinoccial', name: 'Seguros Equinoccial', copagoPct: 30, reembPct: 80 },
  { id: 'particular', name: 'Particular (Sin Convenio)', copagoPct: 100, reembPct: 0 }
];

// Saludsa Specific Plans from User Official Contract Table
export const SALUDSA_PLANS = [
  { id: 'star_30k', name: 'Star Plus (Star30K)', ambulatorioPct: 80, deducibleDefault: 90, maxTherapies: 30 },
  { id: 'star_15k', name: 'Star Plus (Star15K)', ambulatorioPct: 70, deducibleDefault: 70, maxTherapies: 30 },
  { id: 'star_30k_lite', name: 'Star 30k Lite', ambulatorioPct: 50, deducibleDefault: 90, maxTherapies: 30 },
  { id: 'star_15k_lite', name: 'Star 15k Lite', ambulatorioPct: 50, deducibleDefault: 70, maxTherapies: 30 },
  { id: 'sky_70k', name: 'Sky70K Plus', ambulatorioPct: 80, deducibleDefault: 100, maxTherapies: 30 },
  { id: 'custom', name: 'Plan Personalizado / Convenio Estándar Bioforce', ambulatorioPct: 100, deducibleDefault: 0, maxTherapies: 30 }
];

// Catalog of 30 Top Traumatology & Orthopedic Pathologies grouped by Region
export const TRAUMATOLOGY_PATHOLOGIES = [
  {
    region: '🦴 RODILLA',
    items: [
      { code: 'M76.5', diag: 'Tendinitis Rotuliana (Rodilla del Saltador)' },
      { code: 'M22.4', diag: 'Síndrome de Dolor Patelofemoral / Condromalacia Rotuliana' },
      { code: 'M23.2', diag: 'Lesión / Rotura Meniscal (Interno/Externo)' },
      { code: 'S83.5', diag: 'Esguince / Lesión Ligamento Cruzado Anterior (LCA)' },
      { code: 'M17.9', diag: 'Gonartrosis / Artrosis de Rodilla' },
      { code: 'Z98.8', diag: 'Posquirúrgico de Reconstrucción de Ligamento Cruzado (LCA)' },
      { code: 'Z98.8', diag: 'Posquirúrgico de Menisectomía / Artroscopia de Rodilla' },
      { code: 'Z96.6', diag: 'Posquirúrgico de Prótesis Total de Rodilla (PTR)' }
    ]
  },
  {
    region: '💪 HOMBRO',
    items: [
      { code: 'M75.1', diag: 'Síndrome del Manguito Rotador / Tendinitis Supraespinoso' },
      { code: 'M75.5', diag: 'Bursitis Subacromial / Pinzamiento de Hombro' },
      { code: 'M75.0', diag: 'Capsulitis Adhesiva (Hombro Congelado)' },
      { code: 'M75.2', diag: 'Tendinitis Bicipital / Porción Larga del Bíceps' },
      { code: 'Z98.8', diag: 'Posquirúrgico de Reparación Manguito Rotador / Acromioplastia' }
    ]
  },
  {
    region: '🧘 COLUMNA (LUMBAR Y CERVICAL)',
    items: [
      { code: 'M54.5', diag: 'Lumbalgia Mecánica Aguda / Crónica' },
      { code: 'M51.1', diag: 'Hernia Discal Lumbar con Radiculopatía (Lumbociática)' },
      { code: 'M54.2', diag: 'Cervicalgia / Cervicobraquialgia' },
      { code: 'M41.9', diag: 'Escoliosis / Dorsalgia Mecánica' },
      { code: 'Z98.8', diag: 'Posquirúrgico de Discectomía / Artrodesis Lumbar' }
    ]
  },
  {
    region: '🦶 TOBILLO Y PIE',
    items: [
      { code: 'M72.2', diag: 'Fascitis Plantar / Espolón Calcáneo' },
      { code: 'M76.6', diag: 'Tendinitis Aquilea / Aquilodinia' },
      { code: 'S93.4', diag: 'Esguince de Tobillo (Ligamento Peroneo Astronagalino)' },
      { code: 'Z98.8', diag: 'Posquirúrgico de Tenorrafia Aquiles / Osteosíntesis Tobillo' }
    ]
  },
  {
    region: '🖐️ CODO, MUÑECA Y MANO',
    items: [
      { code: 'M77.1', diag: 'Epicondilitis Lateral (Codo de Tenista)' },
      { code: 'M77.0', diag: 'Epitrocleitis Medial (Codo de Golfista)' },
      { code: 'G56.0', diag: 'Síndrome del Túnel Carpiano' },
      { code: 'M65.4', diag: 'Tenosinovitis de De Quervain (Muñeca)' },
      { code: 'Z98.8', diag: 'Posquirúrgico de Liberación Túnel Carpiano / Radio Distal' }
    ]
  },
  {
    region: '🦵 CADERA Y PELVIS',
    items: [
      { code: 'M70.6', diag: 'Bursitis Trocantérica / Trocanteritis de Cadera' },
      { code: 'M16.9', diag: 'Coxartrosis / Artrosis de Cadera' },
      { code: 'Z96.6', diag: 'Posquirúrgico de Prótesis Total de Cadera (PTC)' }
    ]
  }
];

// Helper to calculate age automatically
const calculateAge = (dobString) => {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? `${age} años` : '';
};

export default function App() {
  const now = new Date();
  const currentTimeString = now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

  // View state: 'landing' vs 'app'
  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('bioforce_admin_user');
    return savedUser ? 'app' : 'landing';
  });

  // Admin User Auth State (Resend OTP)
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('bioforce_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Selected Insurance Provider
  const [selectedProviderId, setSelectedProviderId] = useState('saludsa');
  const currentProvider = INSURANCE_PROVIDERS.find(p => p.id === selectedProviderId) || INSURANCE_PROVIDERS[0];

  // Selected Saludsa Specific Plan
  const [selectedSaludsaPlanId, setSelectedSaludsaPlanId] = useState('custom');
  const currentSaludsaPlan = SALUDSA_PLANS.find(p => p.id === selectedSaludsaPlanId) || SALUDSA_PLANS[5];

  // Deducible State
  const [applyDeducible, setApplyDeducible] = useState(false);
  const [deducibleAmount, setDeducibleAmount] = useState(currentSaludsaPlan.deducibleDefault);

  // Patient clinical data state
  const [patientInfo, setPatientInfo] = useState({
    nombres: 'Edwin',
    apellidos: 'Ayala',
    cedula: '1716626435',
    dob: '1982-01-25',
    date: now.toISOString().split('T')[0],
    time: currentTimeString,
    diagnostico: 'Tendinitis Rotuliana (Rodilla del Saltador)',
    cie10: 'M76.5',
    quoteNum: 'COT-' + Math.floor(1000 + Math.random() * 9000)
  });

  // Derived age calculation
  const calculatedAge = calculateAge(patientInfo.dob);
  const fullName = `${patientInfo.nombres} ${patientInfo.apellidos}`.trim();

  // Sessions state (Default: 12 Terapias + 6 Ondas + 2 PRP + 2 Laser)
  const [copagoSessions, setCopagoSessions] = useState({
    evaluacion: 1,
    terapia: 12
  });

  const [reembolsoSessions, setReembolsoSessions] = useState({
    ondas: 6,
    prp: 2,
    laser: 2
  });

  // Percentage splits
  const [copagoPatientPercent, setCopagoPatientPercent] = useState(30);
  const [reembolsoRefundPercent, setReembolsoRefundPercent] = useState(100);

  // CRM Quotes History Persistence
  const [quotesHistory, setQuotesHistory] = useState(() => {
    const saved = localStorage.getItem('bioforce_crm_quotes_v7');
    return saved ? JSON.parse(saved) : [];
  });

  // Price overrides
  const [pricesState, setPricesState] = useState(() => {
    const saved = localStorage.getItem('bioforce_saludsa_prices_v14');
    return saved ? JSON.parse(saved) : {};
  });

  // Modals state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Fetch quotes from API Server on load
  useEffect(() => {
    fetch('http://localhost:5051/api/quotes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setQuotesHistory(data);
        }
      })
      .catch(() => {});
  }, []);

  // Handle Provider Change
  const handleProviderChange = (providerId) => {
    const prov = INSURANCE_PROVIDERS.find(p => p.id === providerId);
    if (prov) {
      setSelectedProviderId(providerId);
      setCopagoPatientPercent(prov.copagoPct);
      setReembolsoRefundPercent(prov.reembPct);
      triggerToast(`Aseguradora cambiada a: ${prov.name}`);
    }
  };

  // Synchronized Saludsa Plan Selection
  const handleSaludsaPlanChange = (planId) => {
    const plan = SALUDSA_PLANS.find(p => p.id === planId);
    if (plan) {
      setSelectedSaludsaPlanId(planId);
      setDeducibleAmount(plan.deducibleDefault);
      if (planId !== 'custom') {
        const patientCopagoCalculated = Math.max(0, 100 - plan.ambulatorioPct);
        setCopagoPatientPercent(patientCopagoCalculated);
        setReembolsoRefundPercent(plan.ambulatorioPct);
        triggerToast(`Plan Saludsa Configurado: ${plan.name} -> Copago Paciente: ${patientCopagoCalculated}% | Reembolso Saludsa: ${plan.ambulatorioPct}%`);
      } else {
        setCopagoPatientPercent(30);
        setReembolsoRefundPercent(100);
        triggerToast('Plan Convenio Estándar Bioforce: Copago 30% | Reembolso 100%');
      }
    }
  };

  // Persist quotes history & prices
  useEffect(() => {
    localStorage.setItem('bioforce_crm_quotes_v7', JSON.stringify(quotesHistory));
  }, [quotesHistory]);

  useEffect(() => {
    localStorage.setItem('bioforce_saludsa_prices_v14', JSON.stringify(pricesState));
  }, [pricesState]);

  // Auth Success Handler
  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    localStorage.setItem('bioforce_admin_user', JSON.stringify(user));
    setCurrentView('app');
    triggerToast(`🔓 Sesión de Administrador activada para ${user.email}`);
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('bioforce_admin_user');
    localStorage.removeItem('bioforce_admin_token');
    setCurrentView('landing');
    triggerToast('🔒 Sesión de Administrador cerrada');
  };

  // Handlers for session updates
  const handleCopagoSessionChange = (id, value) => {
    setCopagoSessions(prev => ({ ...prev, [id]: value }));
  };

  const handleReembolsoSessionChange = (id, value) => {
    setReembolsoSessions(prev => ({ ...prev, [id]: value }));
  };

  // Price override handlers
  const handleUpdatePrice = (id, price) => {
    setPricesState(prev => ({ ...prev, [id]: price }));
  };

  const handleResetPrices = () => {
    setPricesState({});
    triggerToast('Tarifas restablecidas al convenio original');
  };

  // Reset all session counters
  const handleResetAll = () => {
    setCopagoSessions({});
    setReembolsoSessions({});
    triggerToast('Calculadora limpiada');
  };

  // Quick Presets
  const loadPreset = (presetType) => {
    if (presetType === 'receta_tipica') {
      setCopagoSessions({ evaluacion: 1, terapia: 12 });
      setReembolsoSessions({ ondas: 6, prp: 2, laser: 2 });
      triggerToast('🌟 Receta Típica Cargada: 12 Terapias + 6 Ondas + 2 PRP + 2 Láser');
    } else if (presetType === '10_terapias_2_ondas') {
      setCopagoSessions({ evaluacion: 1, terapia: 10 });
      setReembolsoSessions({ ondas: 2 });
      triggerToast('Paquete 10 Terapias + 2 Ondas Cargado');
    } else if (presetType === 'solo_copago') {
      setCopagoSessions({ evaluacion: 1, terapia: 12, magnetoterapia: 6, presoterapia: 6 });
      setReembolsoSessions({});
      triggerToast('Paquete 100% Copago Cargado');
    }
  };

  // Pathology Selector Handler
  const handleSelectPathologyFromDropdown = (e) => {
    const selectedVal = e.target.value;
    if (!selectedVal) return;
    const [code, ...diagParts] = selectedVal.split('|||');
    const diagText = diagParts.join('|||');
    setPatientInfo(prev => ({
      ...prev,
      cie10: code,
      diagnostico: diagText
    }));
    triggerToast(`Diagnóstico seleccionado: ${code} - ${diagText}`);
  };

  // Compute Copago Section
  let copagoSessionsCount = 0;
  let copagoTotalVal = 0;
  COPAGO_TREATMENTS.forEach(t => {
    const s = copagoSessions[t.id] || 0;
    const p = pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice;
    copagoSessionsCount += s;
    copagoTotalVal += s * p;
  });
  const copagoPatientAmt = (copagoTotalVal * copagoPatientPercent) / 100;
  const copagoSaludsaDirectAmt = (copagoTotalVal * (100 - copagoPatientPercent)) / 100;

  // Compute Reembolso Section
  let reembolsoSessionsCount = 0;
  let reembolsoTotalVal = 0;
  REEMBOLSO_TREATMENTS.forEach(t => {
    const s = reembolsoSessions[t.id] || 0;
    const p = pricesState[t.id] !== undefined ? pricesState[t.id] : t.defaultPrice;
    reembolsoSessionsCount += s;
    reembolsoTotalVal += s * p;
  });
  const reembolsoPaidToday = reembolsoTotalVal;

  // Calculation taking Deducible into consideration
  const effectiveDeducible = applyDeducible ? Number(deducibleAmount || 0) : 0;
  const reembValSubjectToCoverage = Math.max(0, reembolsoTotalVal - effectiveDeducible);
  const reembolsoRefundAmt = (reembValSubjectToCoverage * reembolsoRefundPercent) / 100;
  const reembolsoNetPatientCost = reembolsoTotalVal - reembolsoRefundAmt;

  // Combined Summary Metrics
  const totalSessions = copagoSessionsCount + reembolsoSessionsCount;
  const grandTotalTreatmentValue = copagoTotalVal + reembolsoTotalVal;
  const totalPayTodayAtBioforce = copagoPatientAmt + reembolsoPaidToday;
  const totalSaludsaBenefit = copagoSaludsaDirectAmt + reembolsoRefundAmt;
  const netFinalPatientCost = totalPayTodayAtBioforce - reembolsoRefundAmt;

  // Check 30 Therapies Yearly Limit Alert
  const isTherapyLimitExceeded = copagoSessionsCount > 30 || totalSessions > 30;

  const summaryData = {
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

    applyDeducible,
    effectiveDeducible,
    selectedSaludsaPlanName: currentSaludsaPlan.name,

    totalSessions,
    grandTotalTreatmentValue,
    totalPayTodayAtBioforce,
    totalSaludsaBenefit,
    netFinalPatientCost
  };

  const patientFullObj = {
    ...patientInfo,
    fullName,
    name: fullName,
    calculatedAge,
    providerName: currentProvider.name,
    saludsaPlanName: currentSaludsaPlan.name
  };

  // Auto-Save Quote to CRM History & Sync with Neon DB via Prisma API
  const handleSaveToCrm = () => {
    const newQuoteRecord = {
      quoteNum: patientInfo.quoteNum,
      date: patientInfo.date,
      time: patientInfo.time,
      patientName: fullName || 'Paciente General',
      nombres: patientInfo.nombres,
      apellidos: patientInfo.apellidos,
      cedula: patientInfo.cedula,
      dob: patientInfo.dob,
      diagnostico: patientInfo.diagnostico,
      cie10: patientInfo.cie10,
      providerId: selectedProviderId,
      providerName: currentProvider.name,
      planName: currentSaludsaPlan.name,
      totalSessions,
      grandTotalTreatmentValue,
      totalPayTodayAtBioforce,
      reembolsoRefundAmt,
      netFinalPatientCost,
      status: 'Atendido',
      copagoSessions,
      reembolsoSessions,
      copagoPatientPercent,
      reembolsoRefundPercent
    };

    setQuotesHistory(prev => {
      const idx = prev.findIndex(q => q.quoteNum === patientInfo.quoteNum);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newQuoteRecord;
        return updated;
      } else {
        return [newQuoteRecord, ...prev];
      }
    });

    // Send to Node API / Neon DB
    fetch('http://localhost:5051/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuoteRecord)
    }).catch(() => {});

    triggerToast('📋 Cotización guardada en Neon DB & CRM');
  };

  // Load Past Quote from CRM
  const handleLoadQuoteFromCrm = (quoteRecord) => {
    setPatientInfo({
      nombres: quoteRecord.nombres || '',
      apellidos: quoteRecord.apellidos || '',
      cedula: quoteRecord.cedula || '',
      dob: quoteRecord.dob || '',
      date: quoteRecord.date || now.toISOString().split('T')[0],
      time: quoteRecord.time || currentTimeString,
      diagnostico: quoteRecord.diagnostico || '',
      cie10: quoteRecord.cie10 || '',
      quoteNum: quoteRecord.quoteNum || 'COT-' + Math.floor(1000 + Math.random() * 9000)
    });

    if (quoteRecord.providerId) setSelectedProviderId(quoteRecord.providerId);
    if (quoteRecord.copagoSessions) setCopagoSessions(quoteRecord.copagoSessions);
    if (quoteRecord.reembolsoSessions) setReembolsoSessions(quoteRecord.reembolsoSessions);
    if (quoteRecord.copagoPatientPercent !== undefined) setCopagoPatientPercent(quoteRecord.copagoPatientPercent);
    if (quoteRecord.reembolsoRefundPercent !== undefined) setReembolsoRefundPercent(quoteRecord.reembolsoRefundPercent);

    triggerToast(`Expediente ${quoteRecord.quoteNum} cargado correctamente`);
  };

  // Update Quote Status
  const handleUpdateQuoteStatus = (quoteNum, newStatus) => {
    setQuotesHistory(prev => prev.map(q => q.quoteNum === quoteNum ? { ...q, status: newStatus } : q));
    
    // Update API
    fetch(`http://localhost:5051/api/quotes/${quoteNum}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});

    triggerToast(`Estado del reembolso actualizado a: ${newStatus}`);
  };

  // Render Landing Page if currentView is 'landing'
  if (currentView === 'landing') {
    return (
      <LandingLoginPage 
        onLoginSuccess={handleLoginSuccess}
        onGuestAccess={() => setCurrentView('app')}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-floating">
          <Sparkles size={16} style={{ color: 'var(--brand-green)' }} />
          {toastMessage}
        </div>
      )}

      {/* Futuristic Header */}
      <header className="app-header">
        <div className="brand-badge">
          <div className="logo-img-wrapper">
            <img src="/logo-bioforce.jpg" alt="Logo Bioforce" className="logo-img" />
          </div>
          <div className="brand-title">
            <h1>BIO<span className="green">FORCE</span></h1>
            <div className="brand-subtitle">
              <span className="pulse-dot"></span>
              Plataforma Médica & Convenios de Salud • Neon DB & Resend Auth
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setCurrentView('landing')} title="Ir a la portada de inicio">
            <Home size={16} /> Inicio / Landing
          </button>

          {/* Resend Admin Auth Status Badge */}
          {adminUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#e6f7ef', border: '1px solid #00b865', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', color: '#00b865' }}>
              <ShieldCheck size={16} /> Admin ({adminUser.email})
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ea580c', marginLeft: '4px' }} title="Cerrar sesión admin">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-outline" onClick={() => setCurrentView('landing')} style={{ borderColor: 'var(--brand-green)', color: 'var(--brand-navy)' }}>
              <KeyRound size={16} style={{ color: 'var(--brand-green)' }} /> Login Admin Resend
            </button>
          )}

          <button className="btn btn-outline" onClick={() => setIsStatsModalOpen(true)} style={{ borderColor: '#0077ff', color: '#0077ff' }}>
            <TrendingUp size={16} /> Analíticas
          </button>
          <button className="btn btn-outline" onClick={() => setIsPrescriptionModalOpen(true)} style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
            <FileText size={16} /> Orden Médica
          </button>
          <button className="btn btn-outline" onClick={() => setIsGuideModalOpen(true)} style={{ borderColor: 'var(--brand-green)', color: 'var(--brand-green)' }}>
            <BookOpen size={16} /> Guía Recepción
          </button>
          <button className="btn btn-outline" onClick={() => setIsCrmModalOpen(true)}>
            <Database size={16} /> Historial CRM ({quotesHistory.length})
          </button>

          {/* Price settings protected or open */}
          <button className="btn btn-secondary" onClick={() => {
            if (!adminUser) {
              triggerToast('🔒 Requiere autenticación de administrador (2@bioforcemil.com)');
              setCurrentView('landing');
            } else {
              setIsSettingsModalOpen(true);
            }
          }}>
            <Settings size={16} /> Precios {adminUser ? '' : '🔒'}
          </button>

          <button className="btn btn-outline" onClick={handleResetAll}>
            <RotateCcw size={16} /> Limpiar
          </button>
          <button className="btn btn-primary" onClick={() => {
            handleSaveToCrm();
            setIsPrintModalOpen(true);
          }}>
            <Printer size={16} /> Generar Cotización / PDF
          </button>
        </div>
      </header>

      {/* Multi-Aseguradoras & Saludsa Plan Selector Bar */}
      <div className="insurance-selector-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', flex: 1 }}>
          <div className="insurance-label">
            <Building2 size={20} style={{ color: 'var(--brand-green)' }} />
            <span>ASEGURADORA:</span>
          </div>

          <select 
            className="insurance-select"
            value={selectedProviderId}
            onChange={(e) => handleProviderChange(e.target.value)}
          >
            {INSURANCE_PROVIDERS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Saludsa Plan Specific Selector */}
          {selectedProviderId === 'saludsa' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#00d2ff' }}>
                <Award size={15} style={{ display: 'inline', marginRight: 3 }} /> PLAN SALUDSA:
              </span>
              <select 
                className="insurance-select"
                style={{ borderColor: '#00d2ff' }}
                value={selectedSaludsaPlanId}
                onChange={(e) => handleSaludsaPlanChange(e.target.value)}
              >
                {SALUDSA_PLANS.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} ({plan.ambulatorioPct}% Amb. | Ded. ${plan.deducibleDefault})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Saludsa Deducible & Cobertura Ambulatoria Bar */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: 'var(--radius-lg)',
        padding: '1.1rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: '800', fontSize: '0.88rem', color: 'var(--brand-navy)' }}>
            <input 
              type="checkbox"
              checked={applyDeducible}
              onChange={(e) => {
                setApplyDeducible(e.target.checked);
                if (e.target.checked) triggerToast(`Deducible anual de $${deducibleAmount} aplicado al primer reclamo`);
              }}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-green)', cursor: 'pointer' }}
            />
            <span>¿Aplicar Deducible Anual al Reclamo?</span>
          </label>

          {applyDeducible && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Monto Deducible: $</span>
              <input
                type="number"
                value={deducibleAmount}
                onChange={(e) => setDeducibleAmount(Number(e.target.value))}
                style={{ width: '80px', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontWeight: '800' }}
              />
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ background: 'rgba(0, 184, 101, 0.1)', color: 'var(--brand-green)', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', border: '1px solid rgba(0, 184, 101, 0.3)' }}>
            Copago Paciente en Caja: {copagoPatientPercent}% (Saludsa Paga {100 - copagoPatientPercent}% Directo)
          </span>
          <span style={{ background: '#eff6ff', color: '#0077ff', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', border: '1px solid rgba(0, 119, 255, 0.3)' }}>
            Reembolso Saludsa: {reembolsoRefundPercent}%
          </span>
        </div>
      </div>

      {/* Educational Banner for Reception */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 184, 101, 0.06) 0%, rgba(0, 119, 255, 0.06) 100%)',
        border: '1px solid rgba(0, 184, 101, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1.25rem',
        marginBottom: '1.5rem',
        fontSize: '0.83rem',
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Info size={18} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />
          <span>
            <strong>💡 Sincronización Automática:</strong> Al elegir el plan del paciente (ej. Star 30K, Star 15K, Star Lite), el sistema configura automáticamente el <strong>% de Copago</strong> y el <strong>% de Reembolso</strong> exactos de su contrato.
          </span>
        </div>

        <button 
          onClick={() => setIsGuideModalOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--brand-green)', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
        >
          Ver Ejemplos Rápidos →
        </button>
      </div>

      {/* 30-Therapy Limit Alert Notification */}
      {isTherapyLimitExceeded && (
        <div style={{
          background: '#fff7ed',
          border: '1.5px solid #ff8c00',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#c2410c',
          fontWeight: '700',
          fontSize: '0.88rem'
        }}>
          <AlertTriangle size={22} style={{ color: '#ff8c00', flexShrink: 0 }} />
          <div>
            <strong>ALERTA DE LÍMITE ANUAL SALUDSA:</strong> El tratamiento cotizado ({totalSessions} sesiones) supera o alcanza el límite máximo contractual de <strong>30 terapias de cada tipo por año por persona</strong> contemplado en los planes de Saludsa.
          </div>
        </div>
      )}

      {/* Comprehensive Clinical Patient Header Bar */}
      <div className="patient-bar-clinical">
        <div className="patient-bar-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--brand-green)' }} />
            FICHA Y DATOS DE FILIACIÓN CLÍNICA DEL PACIENTE
          </span>
          <span className="quote-badge-tag">{patientInfo.quoteNum}</span>
        </div>

        <div className="patient-bar-grid">
          {/* NOMBRES */}
          <div className="input-field-group">
            <label><User size={13} style={{ display: 'inline', marginRight: 4 }} /> Nombres</label>
            <input
              type="text"
              placeholder="Ej. Edwin"
              value={patientInfo.nombres}
              onChange={(e) => setPatientInfo({ ...patientInfo, nombres: e.target.value })}
            />
          </div>

          {/* APELLIDOS */}
          <div className="input-field-group">
            <label><User size={13} style={{ display: 'inline', marginRight: 4 }} /> Apellidos</label>
            <input
              type="text"
              placeholder="Ej. Ayala"
              value={patientInfo.apellidos}
              onChange={(e) => setPatientInfo({ ...patientInfo, apellidos: e.target.value })}
            />
          </div>

          {/* Cédula de Identidad */}
          <div className="input-field-group">
            <label><CreditCard size={13} style={{ display: 'inline', marginRight: 4 }} /> Cédula de Identidad</label>
            <input
              type="text"
              placeholder="Ej. 1716626435"
              value={patientInfo.cedula}
              onChange={(e) => setPatientInfo({ ...patientInfo, cedula: e.target.value })}
            />
          </div>

          {/* Fecha Nacimiento */}
          <div className="input-field-group">
            <label><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> Fecha Nacimiento</label>
            <input
              type="date"
              value={patientInfo.dob}
              onChange={(e) => setPatientInfo({ ...patientInfo, dob: e.target.value })}
            />
          </div>

          {/* Dedicated Edad Display Box */}
          <div className="input-field-group">
            <label><Heart size={13} style={{ display: 'inline', marginRight: 4 }} /> Edad Calculada</label>
            <div className="age-display-box">
              {calculatedAge || '-- años'}
            </div>
          </div>

          {/* Fecha Cotización */}
          <div className="input-field-group">
            <label><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> Fecha Cotización</label>
            <input
              type="date"
              value={patientInfo.date}
              onChange={(e) => setPatientInfo({ ...patientInfo, date: e.target.value })}
            />
          </div>

          {/* Hora Cotización */}
          <div className="input-field-group">
            <label><Clock size={13} style={{ display: 'inline', marginRight: 4 }} /> Hora Cotización</label>
            <input
              type="text"
              value={patientInfo.time}
              onChange={(e) => setPatientInfo({ ...patientInfo, time: e.target.value })}
            />
          </div>
        </div>

        {/* Dropdown Selector for 30 Top Traumatology Pathologies grouped by Region */}
        <div style={{ marginTop: '1.25rem' }}>
          <div className="input-field-group">
            <label style={{ color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={14} /> Seleccionar Patología Traumatológica (30 Diagnósticos & Posquirúrgicos por Región):
            </label>
            <select
              className="pathology-dropdown-select"
              onChange={handleSelectPathologyFromDropdown}
              value={patientInfo.cie10 ? `${patientInfo.cie10}|||${patientInfo.diagnostico}` : ''}
            >
              <option value="" disabled>-- Seleccionar patología traumatológica o posquirúrgica --</option>
              {TRAUMATOLOGY_PATHOLOGIES.map((group, idx) => (
                <optgroup key={idx} label={group.region}>
                  {group.items.map((item, itemIdx) => (
                    <option key={itemIdx} value={`${item.code}|||${item.diag}`}>
                      {item.code} - {item.diag}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Diagnostic & CIE-10 Detail Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.25rem', marginTop: '1rem' }}>
          <div className="input-field-group">
            <label><FileCode size={13} style={{ display: 'inline', marginRight: 4 }} /> Código CIE-10</label>
            <input
              type="text"
              placeholder="Ej. M76.5"
              value={patientInfo.cie10}
              onChange={(e) => setPatientInfo({ ...patientInfo, cie10: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="input-field-group">
            <label><Stethoscope size={13} style={{ display: 'inline', marginRight: 4 }} /> Diagnóstico Médico</label>
            <input
              type="text"
              placeholder="Ej. Tendinitis Rotuliana (Rodilla del Saltador)"
              value={patientInfo.diagnostico}
              onChange={(e) => setPatientInfo({ ...patientInfo, diagnostico: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Presets & Quick Buttons Bar */}
      <div className="presets-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--brand-navy)', fontWeight: '800', textTransform: 'uppercase' }}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: 4, color: 'var(--brand-green)' }} /> Receta Típica Bioforce:
          </span>
          <button className="preset-chip" onClick={() => loadPreset('receta_tipica')}>
            🌟 Receta Típica: 12 Terapias + 6 Ondas + 2 PRP + 2 Láser
          </button>
          <button className="preset-chip" onClick={() => loadPreset('10_terapias_2_ondas')}>
            10 Terapias Físicas + 2 Ondas
          </button>
          <button className="preset-chip" onClick={() => loadPreset('solo_copago')}>
            Paquete 100% Copago
          </button>
        </div>

        {/* WhatsApp & QR Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={() => setIsQrModalOpen(true)} style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
            <QrCode size={16} /> QR / WhatsApp
          </button>
        </div>
      </div>

      {/* Main Dual Calculator Grid */}
      <div className="calculator-grid">
        <SectionCalculator
          title="1. MODALIDAD COPAGO"
          type="copago"
          badgeText="Pago Directo en Caja"
          treatments={COPAGO_TREATMENTS}
          sessionsState={copagoSessions}
          pricesState={pricesState}
          patientPercent={copagoPatientPercent}
          onSessionChange={handleCopagoSessionChange}
          onPercentChange={setCopagoPatientPercent}
          showSearch={true}
        />

        <SectionCalculator
          title="2. MODALIDAD REEMBOLSO"
          type="reembolso"
          badgeText="El Seguro se lo Devuelve"
          treatments={REEMBOLSO_TREATMENTS}
          sessionsState={reembolsoSessions}
          pricesState={pricesState}
          patientPercent={reembolsoRefundPercent}
          onSessionChange={handleReembolsoSessionChange}
          onPercentChange={setReembolsoRefundPercent}
          showSearch={false}
        />
      </div>

      {/* Financial Executive Summary & Patient Explanation Script */}
      <SummaryCard summaryData={summaryData} patientInfo={patientFullObj} onShowToast={triggerToast} />

      {/* Modals */}
      <PrintQuoteModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        patientInfo={patientFullObj}
        summaryData={summaryData}
        copagoTreatments={COPAGO_TREATMENTS}
        reembolsoTreatments={REEMBOLSO_TREATMENTS}
        copagoSessions={copagoSessions}
        reembolsoSessions={reembolsoSessions}
        pricesState={pricesState}
      />

      <PriceSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        copagoTreatments={COPAGO_TREATMENTS}
        reembolsoTreatments={REEMBOLSO_TREATMENTS}
        pricesState={pricesState}
        onUpdatePrice={handleUpdatePrice}
        onResetPrices={handleResetPrices}
      />

      {/* Quote History & CRM Modal */}
      <QuoteHistoryModal
        isOpen={isCrmModalOpen}
        onClose={() => setIsCrmModalOpen(false)}
        quotesHistory={quotesHistory}
        onLoadQuote={handleLoadQuoteFromCrm}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
      />

      {/* WhatsApp & Dynamic QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        patientInfo={patientFullObj}
        summaryData={summaryData}
      />

      {/* Reception Training & Reference Modal */}
      <ReceptionGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Official Prescription Medical Order Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patientInfo={patientFullObj}
        summaryData={summaryData}
        copagoTreatments={COPAGO_TREATMENTS}
        reembolsoTreatments={REEMBOLSO_TREATMENTS}
        copagoSessions={copagoSessions}
        reembolsoSessions={reembolsoSessions}
      />

      {/* Executive Analytics Stats Dashboard Modal */}
      <StatsDashboardModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        quotesHistory={quotesHistory}
      />

      {/* Admin Login Modal (Resend OTP) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
