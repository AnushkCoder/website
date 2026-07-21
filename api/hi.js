import express from 'express';

const MERCHANT_WALLET = '0x06B62EAE5CF688fc993bB84996B83E8C59f341A7';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const FACILITATOR = 'https://x402.org/facilitator';
const AMOUNT = '10000'; // 0.01 USDC (6 decimals)

function jumble(str) {
  const chars = str.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function resourceUrl(req) {
  // Explicitly read Vercel's forwarded proto — never trust req.protocol alone
  const proto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim() || 'https';
  return `${proto}://${req.headers.host}/api/hi`;
}

function decodePayment(header) {
  return JSON.parse(Buffer.from(header, 'base64url').toString('utf-8'));
}

const app = express();

app.get('/api/hi', async (req, res) => {
  const url = resourceUrl(req);

  const requirements = {
    scheme: 'exact',
    network: 'eip155:8453',
    amount: AMOUNT,
    asset: USDC_BASE,
    payTo: MERCHANT_WALLET,
    maxTimeoutSeconds: 300,
    resource: url,
    description: 'Agent Cuy — jumbles "Cuy Sheffield" for 0.01 USDC',
    mimeType: 'application/json',
    extra: { name: 'USDC', decimals: 6 },
  };

  const paymentHeader = req.headers['x-payment'];

  if (!paymentHeader) {
    const challenge = {
      x402Version: 2,
      error: 'Payment required',
      resource: { url, description: requirements.description, mimeType: requirements.mimeType },
      accepts: [{
        scheme: requirements.scheme,
        network: requirements.network,
        amount: requirements.amount,
        asset: requirements.asset,
        payTo: requirements.payTo,
        maxTimeoutSeconds: requirements.maxTimeoutSeconds,
        extra: requirements.extra,
      }],
    };
    const encoded = Buffer.from(JSON.stringify(challenge)).toString('base64url');
    res.set('PAYMENT-REQUIRED', encoded);
    return res.status(402).json(challenge);
  }

  try {
    const payment = decodePayment(paymentHeader);

    const verifyRes = await fetch(`${FACILITATOR}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentPayload: payment, paymentRequirements: requirements }),
    });
    const verify = await verifyRes.json();
    console.log('VERIFY', verifyRes.status, JSON.stringify(verify));

    if (!verify.isValid) {
      return res.status(402).json({
        x402Version: 2,
        error: verify.invalidReason || 'Payment verification failed',
        _debug: { facilitatorStatus: verifyRes.status, facilitatorResponse: verify },
      });
    }

    const settleRes = await fetch(`${FACILITATOR}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentPayload: payment, paymentRequirements: requirements }),
    });
    const settle = await settleRes.json();

    if (!settle.success) {
      return res.status(402).json({ x402Version: 2, error: 'Settlement failed' });
    }

    res.set('X-PAYMENT-RESPONSE', Buffer.from(JSON.stringify(settle)).toString('base64'));
    res.json({ agent: 'Agent Cuy', result: jumble('Cuy Sheffield') });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
