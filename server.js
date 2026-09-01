import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;
const JWT_SECRET = process.env.JWT_SECRET || 'bioforce_secret_2026';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// Initialize Prisma
let prisma;
try {
  prisma = new PrismaClient();
} catch (err) {
  console.warn('Prisma initial connection pending config:', err.message);
}

const resend = new Resend(RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// In-Memory Fallbacks for seamless dev operation
const memoryOtpCodes = new Map();
const memoryQuotes = [];
const memoryPrices = {};

// Helper to generate 6-digit OTP
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Authorized Admin Emails for esmabioforce.com
const AUTHORIZED_EMAILS = [
  'admin@esmabioforce.com',
  'info@esmabioforce.com',
  '2@bioforcemil.com',
  'nandoedwin2213@gmail.com',
  (process.env.ADMIN_EMAIL || '2@bioforcemil.com').toLowerCase()
];

// --- AUTH ENDPOINTS (Resend OTP Login) ---

// 1. Send OTP Code via Resend
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'El correo electrónico es requerido.' });
    }

    const inputEmail = email.trim().toLowerCase();

    // Check authorization (allow any @esmabioforce.com email or listed admin email)
    const isAuthorized = inputEmail.endsWith('@esmabioforce.com') || AUTHORIZED_EMAILS.includes(inputEmail);

    if (!isAuthorized) {
      return res.status(403).json({ 
        error: `Acceso Denegado: La plataforma está restringida a administradores del dominio esmabioforce.com` 
      });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Store OTP in memory & DB
    memoryOtpCodes.set(inputEmail, {
      code: otpCode,
      expiresAt,
      used: false
    });

    if (prisma) {
      try {
        await prisma.otpCode.create({
          data: {
            email: inputEmail,
            code: otpCode,
            expiresAt,
            used: false
          }
        });
      } catch (e) {
        console.log('Prisma OTP store note:', e.message);
      }
    }

    // Send Email via Resend SDK with esmabioforce.com sender
    let emailSent = false;

    if (RESEND_API_KEY && RESEND_API_KEY.startsWith('re_')) {
      try {
        const sendResult = await resend.emails.send({
          from: 'Bioforce Medical Center <info@esmabioforce.com>',
          to: [inputEmail],
          subject: `🔐 Tu código de acceso esmabioforce.com es ${otpCode}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #06152b; margin-top: 0;">BIOFORCE MEDICAL CENTER</h2>
              <p style="font-size: 14px; color: #475569;">Has solicitado un código de verificación para ingresar a la plataforma <strong>esmabioforce.com</strong>.</p>
              <div style="background: #f8fafc; border: 2px dashed #00b865; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 12px; color: #64748b; font-weight: bold; display: block; text-transform: uppercase;">CÓDIGO DE SEGURIDAD OTP</span>
                <strong style="font-size: 32px; color: #00b865; letter-spacing: 5px;">${otpCode}</strong>
              </div>
              <p style="font-size: 12px; color: #94a3b8;">Este código expira en 5 minutos. Dominio Oficial: esmabioforce.com</p>
            </div>
          `
        });

        if (sendResult && sendResult.data && sendResult.data.id) {
          emailSent = true;
        }
      } catch (resendErr) {
        console.error('Error enviando correo con Resend:', resendErr);
      }
    }

    return res.json({
      success: true,
      emailSent,
      message: `Código OTP de verificación enviado a ${inputEmail}`
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: 'Error al procesar el código OTP' });
  }
});

// 2. Verify OTP Code and return Auth Token
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email y Código son requeridos.' });
    }

    const inputEmail = email.trim().toLowerCase();
    const record = memoryOtpCodes.get(inputEmail);
    
    let isValid = false;
    if (record && record.code === code.trim() && new Date() < record.expiresAt && !record.used) {
      isValid = true;
      record.used = true;
    }

    // Try DB check
    if (!isValid && prisma) {
      try {
        const dbCode = await prisma.otpCode.findFirst({
          where: {
            email: inputEmail,
            code: code.trim(),
            used: false,
            expiresAt: { gte: new Date() }
          },
          orderBy: { createdAt: 'desc' }
        });

        if (dbCode) {
          isValid = true;
          await prisma.otpCode.update({
            where: { id: dbCode.id },
            data: { used: true }
          });
        }
      } catch (dbErr) {
        console.log('DB OTP verification note:', dbErr.message);
      }
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Código OTP inválido o expirado.' });
    }

    // Generate JWT Token
    const token = jwt.sign({ email: inputEmail, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      success: true,
      token,
      user: {
        email: inputEmail,
        role: 'ADMIN',
        name: 'Administrador Bioforce (esmabioforce.com)'
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ error: 'Error al verificar el código OTP' });
  }
});

// --- CRM QUOTES ENDPOINTS (Prisma & Neon Postgres) ---

// Get all quotes
app.get('/api/quotes', async (req, res) => {
  try {
    if (prisma) {
      try {
        const quotes = await prisma.quote.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return res.json(quotes);
      } catch (dbErr) {
        console.warn('Using memory fallback for GET quotes:', dbErr.message);
      }
    }
    return res.json(memoryQuotes);
  } catch (error) {
    return res.json(memoryQuotes);
  }
});

// Save or Update Quote
app.post('/api/quotes', async (req, res) => {
  try {
    const q = req.body;
    if (!q || !q.quoteNum) {
      return res.status(400).json({ error: 'Número de cotización requerido' });
    }

    // Update memory
    const existingIdx = memoryQuotes.findIndex(item => item.quoteNum === q.quoteNum);
    if (existingIdx >= 0) {
      memoryQuotes[existingIdx] = q;
    } else {
      memoryQuotes.unshift(q);
    }

    // Save to Neon DB via Prisma
    if (prisma) {
      try {
        await prisma.quote.upsert({
          where: { quoteNum: q.quoteNum },
          update: {
            date: q.date || '',
            time: q.time || '',
            patientName: q.patientName || 'Paciente General',
            nombres: q.nombres || '',
            apellidos: q.apellidos || '',
            cedula: q.cedula || '',
            dob: q.dob || '',
            diagnostico: q.diagnostico || '',
            cie10: q.cie10 || '',
            providerId: q.providerId || 'saludsa',
            providerName: q.providerName || 'Saludsa',
            planName: q.planName || '',
            totalSessions: q.totalSessions || 0,
            grandTotalTreatmentValue: q.grandTotalTreatmentValue || 0,
            totalPayTodayAtBioforce: q.totalPayTodayAtBioforce || 0,
            reembolsoRefundAmt: q.reembolsoRefundAmt || 0,
            netFinalPatientCost: q.netFinalPatientCost || 0,
            status: q.status || 'Atendido',
            jsonData: JSON.stringify(q)
          },
          create: {
            quoteNum: q.quoteNum,
            date: q.date || '',
            time: q.time || '',
            patientName: q.patientName || 'Paciente General',
            nombres: q.nombres || '',
            apellidos: q.apellidos || '',
            cedula: q.cedula || '',
            dob: q.dob || '',
            diagnostico: q.diagnostico || '',
            cie10: q.cie10 || '',
            providerId: q.providerId || 'saludsa',
            providerName: q.providerName || 'Saludsa',
            planName: q.planName || '',
            totalSessions: q.totalSessions || 0,
            grandTotalTreatmentValue: q.grandTotalTreatmentValue || 0,
            totalPayTodayAtBioforce: q.totalPayTodayAtBioforce || 0,
            reembolsoRefundAmt: q.reembolsoRefundAmt || 0,
            netFinalPatientCost: q.netFinalPatientCost || 0,
            status: q.status || 'Atendido',
            jsonData: JSON.stringify(q)
          }
        });
      } catch (dbErr) {
        console.warn('Prisma upsert note:', dbErr.message);
      }
    }

    return res.json({ success: true, quote: q });
  } catch (error) {
    return res.status(500).json({ error: 'Error guardando cotización' });
  }
});

// Update Quote Reimbursement Status
app.patch('/api/quotes/:quoteNum/status', async (req, res) => {
  try {
    const { quoteNum } = req.params;
    const { status } = req.body;

    const item = memoryQuotes.find(q => q.quoteNum === quoteNum);
    if (item) item.status = status;

    if (prisma) {
      try {
        await prisma.quote.update({
          where: { quoteNum },
          data: { status }
        });
      } catch (e) {
        console.warn('Prisma status update note:', e.message);
      }
    }

    return res.json({ success: true, quoteNum, status });
  } catch (error) {
    return res.status(500).json({ error: 'Error actualizando estado' });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor API Bioforce (esmabioforce.com) escuchando en http://localhost:${PORT}`);
  });
}

export default app;
