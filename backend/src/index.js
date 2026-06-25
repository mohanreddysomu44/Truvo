import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import certificateRoutes from './routes/certificate.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'Truvo', day: 4 });
});

app.use('/api/auth', authRoutes);
app.use('/api/certificate', certificateRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Truvo backend running on port ${PORT}`);
});