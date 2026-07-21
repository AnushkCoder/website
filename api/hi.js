import express from 'express';
import { paymentMiddleware } from 'x402-express';

const MERCHANT_WALLET = '0x06B62EAE5CF688fc993bB84996B83E8C59f341A7';
const FACILITATOR = { url: 'https://x402.org/facilitator' };

function jumble(str) {
  const chars = str.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

const app = express();
app.set('trust proxy', true);

app.use(
  paymentMiddleware(
    MERCHANT_WALLET,
    {
      'GET /api/hi': {
        price: '$0.01',
        network: 'base',
        config: { description: 'Agent Cuy — jumbles "Cuy Sheffield" for 0.01 USDC' },
      },
    },
    FACILITATOR
  )
);

app.get('/api/hi', (req, res) => {
  res.json({ agent: 'Agent Cuy', result: jumble('Cuy Sheffield') });
});

export default app;
