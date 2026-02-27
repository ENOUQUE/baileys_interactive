import { Router, type Request, type Response } from 'express';
import {
  getConnectionStatus,
  sendTextMessage,
  sendButtonsMessage,
  sendListMessage,
  sendPollMessage,
  sendMediaCarousel
} from '../services/evolution-adapter.js';
import { toJid } from '../utils/helpers.js';
import { config } from '../config.js';

const router = Router();

async function validateInstance(instanceName: string, res: Response): Promise<string | undefined> {
  try {
    const status = await getConnectionStatus(instanceName);
    if (status === 'disconnected') {
      res.status(404).json({ ok: false, error: 'instance_not_found' });
      return undefined;
    }
    if (status !== 'connected') {
      res.status(400).json({ ok: false, error: 'instance_not_connected', status });
      return undefined;
    }
    return instanceName;
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
    return undefined;
  }
}

// --- 1. MENU TEXTO (opções numeradas) ---
router.post('/send_menu', async (req: Request, res: Response) => {
  try {
    const { instance = 'main', to, title, text, options, footer } = req.body as any;

    if (!to || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ ok: false, error: 'missing to/options' });
    }

    const evoInstance = await validateInstance(instance, res);
    if (!evoInstance) return;

    const jid = toJid(to);
    if (!jid) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    let menuText = '';
    if (title) menuText += `*${title}*\n\n`;
    if (text) menuText += `${text}\n\n`;
    options.forEach((opt: any, idx: number) => {
      const label = typeof opt === 'string' ? opt : opt.text ?? `Opção ${idx + 1}`;
      menuText += `*${idx + 1}.* ${label}\n`;
    });
    if (footer) menuText += `\n_${footer}_`;

    await sendTextMessage(instance, {
      number: jid,
      text: menuText.trim(),
    });

    return res.json({ ok: true, hint: 'User should reply with the option number (1, 2, 3...)' });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// --- 2. BOTÕES QUICK REPLY (nativeButtons) ---
router.post('/send_buttons_helpers', async (req: Request, res: Response) => {
  try {
    const { instance = 'main', to, text, buttons, footer } = req.body as any;

    if (!to || !text || !Array.isArray(buttons) || buttons.length === 0) {
      return res.status(400).json({ ok: false, error: 'missing to/text/buttons' });
    }
    const limited = buttons.slice(0, config.limits.maxButtons);

    const evoInstance = await validateInstance(instance, res);
    if (!evoInstance) return;

    const jid = toJid(to);
    if (!jid) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    const buttonsData = limited.map((btn: any, idx: number) => ({
      type: 'reply',
      id: btn.id ?? `btn_${idx}`,
      displayText: btn.text ?? `Botão ${idx + 1}`,
    }));

    const result = await sendButtonsMessage(instance, {
      number: jid,
      title: String(text),
      description: '',
      footer: footer ? String(footer) : undefined,
      buttons: buttonsData,
    });

    return res.json({ ok: true, format: 'nativeButtons', messageId: result?.key?.id || result?.id });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// --- 3. BOTÕES CTA (URL, COPY, CALL) ---
router.post('/send_interactive_helpers', async (req: Request, res: Response) => {
  try {
    const { instance = 'main', to, text, buttons, footer } = req.body as any;

    if (!to || !text || !Array.isArray(buttons) || buttons.length === 0) {
      return res.status(400).json({ ok: false, error: 'missing to/text/buttons' });
    }

    const evoInstance = await validateInstance(instance, res);
    if (!evoInstance) return;

    const jid = toJid(to);
    if (!jid) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    const buttonsData = buttons.slice(0, config.limits.maxButtons).map((btn: any, idx: number) => {
      const type = (btn.type ?? 'reply').toLowerCase();
      if (type === 'url' || btn.url) {
        return {
          type: 'url',
          displayText: btn.text ?? 'Abrir',
          url: btn.url,
        };
      }
      if (type === 'copy' || btn.copyCode || btn.copyText) {
        return {
          type: 'copy',
          displayText: btn.text ?? 'Copiar',
          copyCode: btn.copyCode ?? btn.copyText ?? '',
        };
      }
      if (type === 'call' || btn.phoneNumber) {
        return {
          type: 'call',
          displayText: btn.text ?? 'Ligar',
          phoneNumber: btn.phoneNumber,
        };
      }
      return {
        type: 'reply',
        id: `btn_${idx}`,
        displayText: btn.text ?? 'Botão',
      };
    });

    const result = await sendButtonsMessage(instance, {
      number: jid,
      title: String(text),
      description: '',
      footer: footer ? String(footer) : undefined,
      buttons: buttonsData,
    });

    return res.json({ ok: true, format: 'nativeButtons', messageId: result?.key?.id || result?.id });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// --- 4. LISTA DROPDOWN (nativeList) ---
router.post('/send_list_helpers', async (req: Request, res: Response) => {
  try {
    const { instance = 'main', to, text, footer, buttonText, sections } = req.body as any;

    if (!to || !text || !buttonText || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ ok: false, error: 'missing to/text/buttonText/sections' });
    }

    const evoInstance = await validateInstance(instance, res);
    if (!evoInstance) return;

    const jid = toJid(to);
    if (!jid) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    const listSections = sections.map((s: any) => ({
      title: s.title ?? 'Opções',
      rows: (s.rows ?? []).map((row: any, idx: number) => ({
        rowId: row.id ?? `row_${idx}`,
        title: row.title ?? 'Item',
        description: row.description ?? '',
      })),
    }));

    const result = await sendListMessage(instance, {
      number: jid,
      title: String(buttonText),
      description: String(text),
      buttonText: String(buttonText),
      footerText: footer ? String(footer) : undefined,
      sections: listSections,
    });

    return res.json({ ok: true, format: 'nativeList', messageId: result?.key?.id || result?.id });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// --- 5. ENQUETE / POLL ---
router.post('/send_poll', async (req: Request, res: Response) => {
  try {
    const { instance = 'main', to, name, options, selectableCount } = req.body as any;

    if (!to || !name || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ ok: false, error: 'missing to/name/options (min 2)' });
    }
    const opts = options.slice(0, config.limits.maxPollOptions).map((o: any) => String(o));

    const evoInstance = await validateInstance(instance, res);
    if (!evoInstance) return;

    const jid = toJid(to);
    if (!jid) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    const result = await sendPollMessage(instance, {
      number: jid,
      name: String(name),
      values: opts,
      selectableCount: Math.min(Math.max(1, selectableCount ?? 1), opts.length),
    });

    return res.json({ ok: true, messageId: result?.key?.id || result?.id });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// --- 6. CARROSSEL (nativeCarousel) ---
router.post('/send_carousel_helpers', async (req: Request, res: Response) => {
  try {
    const { instance = 'main', to, text, footer, cards } = req.body as any;

    if (!to || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ ok: false, error: 'missing to/cards' });
    }
    const limited = cards.slice(0, config.limits.maxCarouselCards);

    const evoInstance = await validateInstance(instance, res);
    if (!evoInstance) return;

    const jid = toJid(to);
    if (!jid) return res.status(400).json({ ok: false, error: 'invalid_phone' });

    const firstCard = limited[0];

    const result = await sendMediaCarousel(instance, {
      number: jid,
      mediatype: 'image',
      media: firstCard.imageUrl || '',
      caption: firstCard.body || text || '',
      fileName: 'carousel',
    });

    return res.json({ ok: true, format: 'nativeCarousel', messageId: result?.key?.id || result?.id });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;