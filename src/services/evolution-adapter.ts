import axios from 'axios';
import { config } from '../config.js';

const api = axios.create({
  baseURL: config.evolutionApiUrl,
  headers: {
    apikey: config.evolutionApiKey,
    'Content-Type': 'application/json'
  }
});

/**
 * 1. CRIAR INSTÂNCIA E CONECTAR
 * Cria ou recupera uma instância e pega seu QR Code se necessário
 */
export async function createInstance(
  name: string
): Promise<{ ok: boolean; instance: string; qr?: string; error?: string }> {
  try {
    const status = await getConnectionStatus(name);
    if (status === 'connected') return { ok: true, instance: name };
    if (status === 'qr') {
      const qrData = await api.get(`/instance/connect/${name}`);
      return { ok: true, instance: name, qr: qrData.data?.base64 };
    }

    try {
      await api.post('/instance/create', {
        instanceName: name,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      });
    } catch (e: any) {
      const msg = e.response?.data?.response?.message || e.response?.data?.message;
      if (msg !== 'Instance already exists' && !msg?.includes('already exists')) {
        throw e;
      }
    }

    const qrData = await api.get(`/instance/connect/${name}`);
    return { ok: true, instance: name, qr: qrData.data?.base64 };
  } catch (err: any) {
    const errorMsg = err.response?.data?.response?.message || err.response?.data?.message || err.message;
    return { ok: false, instance: name, error: errorMsg };
  }
}

/**
 * STATUS DA CONEXÃO
 */
export async function getConnectionStatus(name: string): Promise<'connecting' | 'connected' | 'disconnected' | 'qr'> {
  try {
    const res = await api.get(`/instance/connectionState/${name}`);
    const state = res.data?.instance?.state || res.data?.state;
    if (state === 'open') return 'connected';
    if (state === 'connecting') return 'qr';
    return 'disconnected';
  } catch {
    return 'disconnected';
  }
}

/**
 * LISTAR TODAS AS INSTÂNCIAS
 */
export async function getAllInstances() {
  try {
    const res = await api.get('/instance/fetchInstances');
    return Array.isArray(res.data) ? res.data : (res.data?.instances || []);
  } catch {
    return [];
  }
}

export async function getQRCode(name: string): Promise<string | null> {
  try {
    const res = await api.get(`/instance/connect/${name}`);
    return res.data?.base64 || null;
  } catch {
    return null;
  }
}

export async function disconnectInstance(name: string): Promise<boolean> {
  return true; // Na evolution o logout resolve isso, ou restart
}

export async function logoutInstance(name: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await api.delete(`/instance/logout/${name}`);
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function removeInstance(name: string): Promise<boolean> {
  try {
    await api.delete(`/instance/delete/${name}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * ENVIAR MENSAGENS DE TEXTO
 */
export async function sendTextMessage(instance: string, data: { number: string; text: string }) {
  const res = await api.post(`/message/sendText/${instance}`, data);
  return res.data;
}

/**
 * ENVIAR BOTÕES
 */
export async function sendButtonsMessage(
  instance: string,
  data: { number: string; title: string; description?: string; footer?: string; buttons: any[] }
) {
  const res = await api.post(`/message/sendButtons/${instance}`, data);
  return res.data;
}

/**
 * ENVIAR LISTAS
 */
export async function sendListMessage(
  instance: string,
  data: { number: string; title: string; description?: string; buttonText: string; footerText?: string; sections: any[] }
) {
  const res = await api.post(`/message/sendList/${instance}`, data);
  return res.data;
}

/**
 * ENVIAR ENQUETES
 */
export async function sendPollMessage(
  instance: string,
  data: { number: string; name: string; values: string[]; selectableCount: number }
) {
  const res = await api.post(`/message/sendPoll/${instance}`, data);
  return res.data;
}

/**
 * ENVIAR CARROSSEL (Midia com botões ou semelhante na API de mídias)
 */
export async function sendMediaCarousel(
  instance: string,
  data: { number: string; mediatype: string; media: string; caption: string; fileName?: string }
) {
  const res = await api.post(`/message/sendMedia/${instance}`, data);
  return res.data;
}
