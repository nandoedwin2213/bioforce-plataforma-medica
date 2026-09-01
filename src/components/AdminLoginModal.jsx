import React, { useState } from 'react';
import { KeyRound, Mail, X, CheckCircle, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState(1); // 1: Email Input, 2: OTP Input
  const [email, setEmail] = useState('admin@bioforce.com');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devCodeNote, setDevCodeNote] = useState('');

  if (!isOpen) return null;

  // Step 1: Send OTP Code via Resend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setDevCodeNote('');

    try {
      const response = await fetch('http://localhost:5051/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep(2);
        if (data.devCode) {
          setDevCodeNote(`Modo Dev (Código OTP generado): ${data.devCode}`);
        }
      } else {
        setErrorMsg(data.error || 'Error enviando el código OTP.');
      }
    } catch (err) {
      // Fallback dev mode code generator if API server is offline
      const devCode = Math.floor(100000 + Math.random() * 900000).toString();
      setStep(2);
      setDevCodeNote(`Código de prueba local: ${devCode}`);
      localStorage.setItem('temp_dev_otp', devCode);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Ingresa el código OTP de 6 dígitos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5051/api/auth/verify-otp', {
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
        // Fallback local check
        const savedDev = localStorage.getItem('temp_dev_otp');
        if (savedDev && savedDev === otpCode.trim()) {
          onLoginSuccess({ email, role: 'ADMIN', name: 'Administrador Bioforce' });
          onClose();
        } else {
          setErrorMsg(data.error || 'Código OTP incorrecto.');
        }
      }
    } catch (err) {
      // Fallback check
      const savedDev = localStorage.getItem('temp_dev_otp');
      if (savedDev && savedDev === otpCode.trim()) {
        onLoginSuccess({ email, role: 'ADMIN', name: 'Administrador Bioforce' });
        onClose();
      } else {
        setErrorMsg('Código OTP inválido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '460px', padding: '2rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <KeyRound size={22} style={{ color: 'var(--brand-green)' }} /> Acceso Administrador (Resend OTP)
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {step === 1 
            ? 'Ingresa tu correo institucional para recibir un código OTP de acceso enviado por Resend.'
            : `Ingresa el código OTP de 6 dígitos que enviamos a ${email}.`}
        </p>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {devCodeNote && (
          <div style={{ background: '#e6f7ef', border: '1px solid #00b865', color: '#00b865', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            {devCodeNote}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-field-group">
              <label><Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> Correo Electrónico Administrador</label>
              <input
                type="email"
                placeholder="admin@bioforce.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '0.85rem' }}>
              {loading ? 'Enviando Correo Resend...' : 'Enviar Código OTP con Resend'} <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-field-group">
              <label><ShieldCheck size={13} style={{ display: 'inline', marginRight: 4 }} /> Código OTP (6 dígitos)</label>
              <input
                type="text"
                placeholder="Ej. 849201"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '6px', fontWeight: 'bold' }}
                autoFocus
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                Atrás
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? 'Verificando...' : 'Verificar & Entrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
