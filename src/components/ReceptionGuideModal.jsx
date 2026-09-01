import React from 'react';
import { HelpCircle, X, CheckCircle, AlertCircle, ShieldCheck, Award, BookOpen } from 'lucide-react';

export default function ReceptionGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '850px', padding: '2rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--brand-navy)' }}>
            <BookOpen size={24} style={{ color: 'var(--brand-green)' }} /> Guía Rápida de Recepción: Reglas & Normativa Saludsa Bioforce
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.88rem', color: '#1e293b' }}>
          
          {/* Regla 1: 30 Terapias de Cada Tipo */}
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #00b865', borderRadius: '8px', padding: '1rem 1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#06152b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#00b865' }} /> 1. Regla de las 30 Terapias DE CADA TIPO por Año
            </h3>
            <p style={{ lineHeight: '1.5', color: '#475569' }}>
              Saludsa <strong>NO suma todas las terapias en un solo tope</strong>. Cada procedimiento tiene su propio cupo independiente de 30 sesiones al año por persona:
            </p>
            <ul style={{ marginTop: '0.4rem', marginLeft: '1.2rem', color: '#0f172a', fontWeight: '600' }}>
              <li>✅ 30 Terapia Física (Copago $17.00)</li>
              <li>✅ 30 Ondas de Choque (Reembolso $55.00)</li>
              <li>✅ 30 Láser de Alta Intensidad (Reembolso $25.00)</li>
            </ul>
            <div style={{ marginTop: '0.5rem', background: '#e6f7ef', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.82rem', color: '#00b865', fontWeight: 'bold' }}>
              💡 Moraleja para Recepción: Un paquete con 12 Terapias + 6 Ondas + 2 Láser entra 100% en cobertura porque no supera 30 en ninguna técnica por separado.
            </div>
          </div>

          {/* Regla 2: Cambios de Diagnóstico (CIE-10) */}
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #0077ff', borderRadius: '8px', padding: '1rem 1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#06152b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: '#0077ff' }} /> 2. Diagnóstico Diferente (Código CIE-10) = Nuevo Cupo
            </h3>
            <p style={{ lineHeight: '1.5', color: '#475569' }}>
              La cobertura de Saludsa se liquida <strong>por enfermedad o evento médico</strong>. Si el paciente tuvo <i>Tendinitis Rotuliana (Rodilla - CIE M76.5)</i> en Junio y regresa en Octubre por <i>Fascitis Plantar (Pie - CIE M72.2)</i>:
            </p>
            <div style={{ marginTop: '0.5rem', background: '#eff6ff', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.82rem', color: '#0077ff', fontWeight: 'bold' }}>
              💡 Saludsa le autoriza NUEVAMENTE un cupo de hasta 30 terapias por tratarse de un código CIE-10 y un diagnóstico distinto.
            </div>
          </div>

          {/* Regla 3: ¿Qué es el Deducible Anual? */}
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #ff8c00', borderRadius: '8px', padding: '1rem 1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#06152b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ color: '#ff8c00' }} /> 3. ¿Cómo Explicar el Deducible al Paciente?
            </h3>
            <p style={{ lineHeight: '1.5', color: '#475569' }}>
              El deducible (ej. $90 en Plan Star30K) es el valor anual que el paciente asume de su bolsillo en su primer reclamo del año antes de recibir reembolsos.
            </p>
            <div style={{ marginTop: '0.5rem', background: '#fff7ed', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.82rem', color: '#ea580c', fontWeight: 'bold' }}>
              💡 Ejemplo para el Paciente: "De tu primer paquete de $330 en ondas, el seguro resta $90 de deducible y sobre los $240 restantes te reembolsa el 80% ($192). En tus siguientes reclamos del año ya no pagarás deducible."
            </div>
          </div>

        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Entendido, Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
}
