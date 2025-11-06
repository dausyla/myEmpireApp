import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import walletRoutes from './routes/wallet.routes';
import authRoutes from './routes/auth.routes'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/wallets', walletRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API ready!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});