import express from 'express';
import { recoverTypedDataAddress } from 'viem';

const MERCHANT_WALLET = '0x06B62EAE5CF688fc993bB84996B83E8C59f341A7';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const AMOUNT = '10000'; // 0.01 USDC (6 decimals)

const USDC_DOMAIN = {
  name: 'USD Coin',
  version: '2',
  chainId: 8453,
  verifyingContract: USDC_BASE,
};

const TRANSFER_TYPES = {
  TransferWithAuthorization: [
    { name: 'from',        type: 'address' },
    { name: 'to',         type: 'address' },
    { name: 'value',      type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore',type: 'uint256' },
    { name: 'nonce',      type: 'bytes32' },
  ],
};

function jumble(str) {
  const chars = str.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function resourceUrl(req) {
  const proto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim() || 'https';
  return `${proto}://${req.headers.host}/api/hi`;
}

function decodePayment(header) {
  return JSON.parse(Buffer.from(header, 'base64url').toString('utf-8'));
}

async function verifyLocally(payment, requirements) {
  const auth = payment?.payload?.authorization;
  const sig  = payment?.payload?.signature;
  if (!auth || !sig) return { isValid: false, reason: 'Missing authorization or signature' };

  const { from, to, value, validAfter, validBefore, nonce } = auth;
  const now = BigInt(Math.floor(Date.now() / 1000));

  if (to?.toLowerCase() !== requirements.payTo.toLowerCase())
    return { isValid: false, reason: `Wrong recipient: ${to}` };
  if (BigInt(value ?? 0) < BigInt(requirements.amount))
    return { isValid: false, reason: `Amount too low: ${value}` };
  if (now < BigInt(validAfter ?? 0))
    return { isValid: false, reason: 'Not yet valid' };
  if (now > BigInt(validBefore ?? 0))
    return { isValid: false, reason: 'Expired' };

  const recovered = await recoverTypedDataAddress({
    domain: USDC_DOMAIN,
    types: TRANSFER_TYPES,
    primaryType: 'TransferWithAuthorization',
    message: {
      from,
      to,
      value:       BigInt(value),
      validAfter:  BigInt(validAfter),
      validBefore: BigInt(validBefore),
      nonce,
    },
    signature: sig,
  });

  if (recovered.toLowerCase() !== from?.toLowerCase())
    return { isValid: false, reason: `Signature mismatch: recovered ${recovered}` };

  return { isValid: true, payer: from };
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

  // Accept all plausible v2/v1 payment header names
  const paymentHeader =
    req.headers['payment-signature'] ||
    req.headers['x-payment'] ||
    req.headers['x-payment-payload'] ||
    req.headers['x402-payment'];

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
    const result = await verifyLocally(payment, requirements);

    if (!result.isValid) {
      // Return 200 so wallet_pay captures the full payload for debugging
      return res.status(200).json({ _debug: true, error: result.reason, authorization: payment?.payload?.authorization, signature: payment?.payload?.signature?.slice(0,20) + '...' });
    }

    const receipt = { success: true, payer: result.payer, network: 'eip155:8453', amount: AMOUNT };
    res.set('PAYMENT-RESPONSE', Buffer.from(JSON.stringify(receipt)).toString('base64url'));
    res.json({ agent: 'Agent Cuy', result: jumble('Cuy Sheffield') });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
