// A simple Express mock bank server for on-ramp and off-ramp transactions

import cors from 'cors';
import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

enum OnRampStatus {
  Processing = 'Processing',
  Success = 'Success',
  Failure = 'Failure',
}

interface OnRampEntry {
  amount: number;
  status: OnRampStatus;
  callbackUrl: string;
  retryCount: number;
}

const app = express();
const port = 3004;
const SECRET_KEY = process.env.BANK_WEBHOOK_SECRET || 'default_secret_key';

app.use(cors());
app.use(express.json());

// In-memory store for pending on-ramp transactions
const pendingOnRamps = new Map<string, OnRampEntry>();

// Compute HMAC signature
function signPayload(payload: any) {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

app.post('/onRamp', (req, res) => {
  const { amount, callbackUrl } = req.body;
  if (!amount || !callbackUrl) {
    res.status(400).json({ error: 'amount and callbackUrl are required' });
    return;
  }

  console.log(`Received callbackUrl=${callbackUrl}`);

  const token = `tok_${uuidv4()}`;
  pendingOnRamps.set(token, {
    amount,
    status: OnRampStatus.Processing,
    callbackUrl,
    retryCount: 0,
  });

  console.log(`On-ramp initiated: token=${token}, amount=${amount}`);
  res.status(200).json({ token });
});

app.post('/offRamp', (req, res) => {
  const { transactionId, amount, account } = req.body;
  if (!transactionId || !amount || !account) {
    res.status(400).json({ error: 'transactionId, amount, and account are required' });
    return;
  }

  const success = Math.random() < 0.8;
  const status = success ? OnRampStatus.Success : OnRampStatus.Failure;
  console.log(`Off-ramp processed: txn=${transactionId}, amount=${amount}, account=${account}, status=${status}`);
  res.json({ status });
});

app.get('/onRamp/status/:token', (req, res) => {
  const token = req.params.token;
  const entry = pendingOnRamps.get(token);
  if (!entry) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }
  res.json({ token, amount: entry.amount, status: entry.status });
});

// Background sweeper: process pending on-ramps
const MAX_RETRIES = 5;
setInterval(() => {
  for (const [token, entry] of pendingOnRamps.entries()) {
    if (entry.status !== OnRampStatus.Processing) continue;

    // Prepare new status
    const success = Math.random() < 0.8;
    const newStatus = success ? OnRampStatus.Success : OnRampStatus.Failure;
    const payload = { token, status: newStatus, amount: entry.amount };
    const signature = signPayload(payload);

    axios.post(entry.callbackUrl, payload, {
      headers: { 'Content-Type': 'application/json', 'X-Bank-Signature': signature },
      timeout: 5000,
    })
    .then(() => {
      console.log(`Webhook delivered: token=${token}, status=${newStatus}`);
      pendingOnRamps.set(token, { ...entry, status: newStatus, retryCount: 0 });
    })
    .catch((err) => {
      console.error(`Webhook retry ${entry.retryCount + 1} failed for token=${token}:`, err.message);
      entry.retryCount += 1;
      if (entry.retryCount >= MAX_RETRIES) {
        console.error(`Max retries reached for token=${token}, marking as Failure.`);
        pendingOnRamps.set(token, { ...entry, status: OnRampStatus.Failure });
      } else {
        // leave status Processing; next interval will retry
        pendingOnRamps.set(token, entry);
      }
    });
  }
}, 10000);

app.listen(port, () => console.log(`Mock bank server listening on port ${port}`));