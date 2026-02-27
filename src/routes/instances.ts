import { Router, type Request, type Response } from 'express';
import QRCode from 'qrcode';
import {
  createInstance,
  getAllInstances,
  removeInstance,
  disconnectInstance,
  logoutInstance,
  getQRCode,
  getConnectionStatus,
} from '../services/evolution-adapter.js';

const router = Router();

/**
 * POST /v1/instances
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { instance = 'main' } = req.body as { instance?: string };
    const name = String(instance).trim() || 'main';

    const result = await createInstance(name);

    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.error });
    }

    let qrBase64: string | undefined = result.qr;
    if (qrBase64 && !qrBase64.startsWith('data:image')) {
      qrBase64 = await QRCode.toDataURL(qrBase64, { width: 400, margin: 2 });
    }

    const status = await getConnectionStatus(name);
    return res.json({
      ok: true,
      instance: name,
      status: status,
      qr: qrBase64 ?? null,
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET /v1/instances
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const evInstances = await getAllInstances();
    const list = evInstances.map((inst: any) => ({
      instance: inst.instance?.instanceName || inst.instanceName,
      status: inst.instance?.state || inst.state || 'unknown',
    }));

    return res.json({ ok: true, instances: list });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET /v1/instances/:name/qr
 */
router.get('/:name/qr', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const qr = await getQRCode(name);

    if (!qr) {
      const status = await getConnectionStatus(name);
      return res.status(400).json({ ok: false, error: 'no_qr_available', status });
    }

    const qrBase64 = qr.startsWith('data:image') ? qr : await QRCode.toDataURL(qr, { width: 400, margin: 2 });
    return res.json({ ok: true, instance: name, qr: qrBase64 });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET /v1/instances/:name
 */
router.get('/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const status = await getConnectionStatus(name);

    if (status === 'disconnected') {
      return res.status(404).json({ ok: false, error: 'instance_not_found' });
    }

    return res.json({
      ok: true,
      instance: name,
      status: status
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /v1/instances/:name/disconnect
 */
router.post('/:name/disconnect', async (req: Request, res: Response) => {
  const { name } = req.params;
  const removed = await disconnectInstance(name);
  return res.json({ ok: removed, instance: name });
});

/**
 * POST /v1/instances/:name/logout
 */
router.post('/:name/logout', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const result = await logoutInstance(name);
    if (!result.ok) {
      return res.status(500).json({ ok: false, instance: name, error: result.error });
    }
    return res.json({ ok: true, instance: name });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * DELETE /v1/instances/:name
 */
router.delete('/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  const removed = await removeInstance(name);
  return res.json({ ok: removed, instance: name });
});

export default router;
