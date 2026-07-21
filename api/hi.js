import express from 'express';
import { paymentMiddleware } from 'x402-express';

const MERCHANT_WALLET = '0x06B62EAE5CF688fc993bB84996B83E8C59f341A7';
const FACILITATOR = { url: 'https://x402.org/facilitator' };

const app = express();

app.use(
  paymentMiddleware(
    MERCHANT_WALLET,
    {
      'GET /api/hi': {
        price: '$0.01',
        network: 'base',
        config: { description: 'Returns hi for 0.01 USDC' },
      },
    },
    FACILITATOR
  )
);

app.get('/api/hi', (req, res) => {
  res.send('hi');
});

export default app;
