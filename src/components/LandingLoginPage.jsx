import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Activity, 
  FileText, 
  Database, 
  Building2, 
  Zap,
  Lock,
  Heart,
  Award,
  Users,
  Stethoscope,
  ChevronRight,
  Download,
  Laptop,
  X
} from 'lucide-react';

const getApiUrl = (endpoint) => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:5051${endpoint}`;
  }
  return endpoint;
};

export default function LandingLoginPage({ onLoginSuccess }) {
  const DEFAULT_EMAIL = '2@bioforcemil.com';

  const [step, setStep] = useState(1); // 1: Email Request, 2: OTP Verification
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNote, setSuccessNote] = useState('');

  // PWA Install Prompt State & Modal
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  // Step 1: Request OTP via Resend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessNote('');

    try {
      const response = await fetch(getApiUrl('/api/auth/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep(2);
        setSuccessNote(`Código de verificación de 6 dígitos enviado a ${cleanEmail}`);
      } else {
        setErrorMsg(data.error || 'Error al enviar el código de seguridad.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servidor de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Ingresa el código OTP de 6 dígitos recibido en tu correo.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(getApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('bioforce_admin_token', data.token);
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Código OTP incorrecto o expirado.');
      }
    } catch (err) {
      setErrorMsg('Error al verificar el código OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
      padding: '2.5rem 1.5rem 5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Hero Banner Container */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        background: 'linear-gradient(135deg, #06152b 0%, #0a2540 60%, #0044aa 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 3.5rem',
        boxShadow: '0 20px 50px rgba(6, 21, 43, 0.3)',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Background Cadet PT Image Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, width: '55%',
          backgroundImage: 'url("/cadet_pt.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          <div className="logo-img-wrapper" style={{ width: '125px', height: '125px', borderWidth: '4px' }}>
            <img src="/logo-bioforce.jpg" alt="Logo Bioforce" className="logo-img" />
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 184, 101, 0.18)', border: '1.5px solid #00b865', color: '#00d06c', padding: '5px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
              <Sparkles size={15} /> BIOMECÁNICA DEPORTIVA & RENDIMIENTO FÍSICO MILITAR
            </div>
            
            <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.05', letterSpacing: '-0.5px' }}>
              BIO<span style={{ color: '#00b865' }}>FORCE</span> MEDICAL CENTER
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: '#e2e8f0', fontWeight: '500', marginTop: '0.6rem', maxWidth: '650px', lineHeight: '1.5' }}>
              Plataforma Especializada en Rehabilitación Traumatológica de Cadetes & Cotización de Convenios de Saludsa.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '700' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} style={{ color: '#00b865' }} /> Fisioterapia de Cadetes Militares
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} style={{ color: '#00b865' }} /> Convenios Saludsa / Humana / BMI
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} style={{ color: '#00b865' }} /> Acceso Protegido por Código OTP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Custom Cadet Photography Showcase vs Clean Login Portal */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: '2.5rem'
      }}>
        
        {/* Left Column: Custom Generated Cadet Photography Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Cadet Physical Therapy Card 1 */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: '220px 1fr'
          }}>
            <div style={{
              backgroundImage: 'url("/cadet_pt.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '180px'
            }}></div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#06152b', fontWeight: '800', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} style={{ color: '#00b865' }} /> Fisioterapia y Biomecánica para Cadetes
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6', fontWeight: '500' }}>
                Atención especializada en rehabilitación de lesiones deportivas y traumatológicas de cadetes. Recuperación funcional de rodilla, columna y hombro con fisioterapeutas certificados de <strong>Bioforce</strong>.
              </p>
            </div>
          </div>

          {/* Cadet Laser & Advanced Technology Card 2 */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: '220px 1fr'
          }}>
            <div style={{
              backgroundImage: 'url("/cadet_laser.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '180px'
            }}></div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#06152b', fontWeight: '800', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: '#0077ff' }} /> Tecnología Láser & Ondas de Choque
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b865', flexShrink: 0 }}></span>
                  <span><strong>Cotización Automática Saludsa</strong>: Cobertura ambulatoria y reembolsos.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b865', flexShrink: 0 }}></span>
                  <span><strong>Matriz de Planes Oficiales</strong>: Star30K, Star15K, Star Lite, Sky70K.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b865', flexShrink: 0 }}></span>
                  <span><strong>30 Patologías CIE-10</strong>: Catálogo por regiones anatómicas.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Install Desktop App Card */}
          <div style={{
            background: 'linear-gradient(135deg, #06152b 0%, #0a2540 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: '0 12px 30px rgba(6, 21, 43, 0.2)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#00b865', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Laptop size={14} /> APLICACIÓN DE ESCRITORIO WINDOWS
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0.2rem 0 0 0', color: '#ffffff' }}>
                INSTALAR EN LA BARRA DE TAREAS
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px', margin: 0 }}>
                Accede a la plataforma médica desde tu escritorio como una aplicación nativa.
              </p>
            </div>
            <button
              onClick={handleInstallPwa}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.2rem', fontSize: '0.85rem', fontWeight: '800', whiteSpace: 'nowrap' }}
            >
              <Download size={16} /> Instalar en Windows
            </button>
          </div>

        </div>

        {/* Right Column: Premium High-Tech Login Portal ONLY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            boxShadow: '0 20px 45px rgba(6, 21, 43, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #00b865 0%, #0077ff 100%)', color: '#ffffff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0, 184, 101, 0.3)' }}>
                <Lock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#06152b', fontWeight: '900', margin: 0 }}>Acceso Único Autorizado</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Autenticación obligatoria por código OTP</span>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{errorMsg}</div>
              </div>
            )}

            {successNote && (
              <div style={{ background: '#e6f7ef', border: '1px solid #00b865', color: '#00b865', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} /> {successNote}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-field-group">
                  <label><Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> Correo Electrónico Institucional</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="2@bioforcemil.com"
                    style={{ fontSize: '0.95rem', padding: '0.8rem 1rem' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '0.95rem', fontSize: '0.95rem', fontWeight: '800' }}>
                  {loading ? 'Enviando Código...' : '📩 Solicitar Código de Seguridad OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-field-group">
                  <label><ShieldCheck size={13} style={{ display: 'inline', marginRight: 4 }} /> Código OTP (6 dígitos)</label>
                  <input
                    type="text"
                    placeholder="• • • • • •"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '1.75rem', letterSpacing: '10px', fontWeight: '900', color: '#06152b', background: '#f8fafc', padding: '0.75rem' }}
                    autoFocus
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                    Atrás
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: '0.9rem', fontWeight: '800' }}>
                    {loading ? 'Verificando...' : '🚀 Entrar a la Plataforma'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
            <Lock size={12} style={{ display: 'inline', marginRight: 4 }} /> Sistema protegido con cifrado SSL & Resend OTP Auth
          </div>

        </div>

      </div>

      {/* Styled Windows PWA Installation Modal */}
      {showInstallModal && (
        <div className="modal-overlay" style={{ background: 'rgba(6, 21, 43, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999 }}>
          <div className="modal-content card" style={{ maxWidth: '520px', width: '100%', padding: '2.25rem', position: 'relative' }}>
            <button className="modal-close" onClick={() => setShowInstallModal(false)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(0, 184, 101, 0.1)', color: '#00b865', padding: '12px', borderRadius: '14px' }}>
                <Laptop size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#06152b', fontWeight: '900', margin: 0 }}>Instalar App de Escritorio Windows</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>PWA Oficial de Bioforce Medical Center</span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', fontWeight: '500', marginBottom: '1.25rem' }}>
              Para anclar el ícono oficial de <strong>Bioforce</strong> a tu Barra de Tareas de Windows y Escritorio:
            </p>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#0f172a', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ background: '#00b865', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.78rem', flexShrink: 0, marginTop: 2 }}>1</span>
                <span>En tu navegador (Chrome o Edge), haz clic en los <strong>3 puntos `...`</strong> arriba a la derecha.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ background: '#00b865', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.78rem', flexShrink: 0, marginTop: 2 }}>2</span>
                <span>Selecciona <strong>"Guardar y compartir"</strong> o <strong>"Aplicaciones"</strong>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ background: '#00b865', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.78rem', flexShrink: 0, marginTop: 2 }}>3</span>
                <span>Haz clic en <strong>"Instalar Bioforce Medical Center"</strong>.</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => setShowInstallModal(false)}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontWeight: '800' }}
            >
              Entendido 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
