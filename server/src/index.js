import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';  
import { connectDB } from './utils/db.js';
import authRouter from './routes/auth.js';
import { requireAuth } from './middlewares/auth.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api/notes', requireAuth, notesRouter);

app.get('/', (_req, res) => res.send('Notes API is running. Try GET /health'));


app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount notes API
app.use('/api/notes', notesRouter);

// 404 + error handlers
import { notFound, onError } from './middlewares/error.js';
app.use(notFound);
app.use(onError);


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`🚀 API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};
start();

