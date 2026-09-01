import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

const getApiUrl = (endpoint) => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:5051${endpoint}`;
  }
  return endpoint;
};

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const AUTHORIZED_EMAIL = '2@bioforcemil.com';

  const [step, setStep] = useState(1); // 1: Email Request, 2: OTP Verification
  const [email, setEmail] = useState(AUTHORIZED_EMAIL);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNote, setSuccessNote] = useState('');

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
        onClose();
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
    <div className="modal-overlay" style={{ background: 'rgba(6, 21, 43, 0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-content card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', position: 'relative' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(0, 184, 101, 0.1)', color: 'var(--brand-green)', padding: '10px', borderRadius: '12px' }}>
            <KeyRound size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-navy)', fontWeight: '800', margin: 0 }}>Acceso de Administrador</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Autenticación por código OTP (Resend SDK)</span>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {successNote && (
          <div style={{ background: '#e6f7ef', border: '1px solid #00b865', color: '#00b865', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {successNote}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-field-group">
              <label><Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> Correo Electrónico Institucional</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="2@bioforcemil.com"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '0.85rem' }}>
              {loading ? 'Enviando Código...' : '📩 Solicitar Código OTP a mi Correo'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-field-group">
              <label><ShieldCheck size={13} style={{ display: 'inline', marginRight: 4 }} /> Código OTP (6 dígitos)</label>
              <input
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: '900', color: 'var(--brand-navy)' }}
                autoFocus
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                Atrás
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? 'Verificando...' : '🚀 Entrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
