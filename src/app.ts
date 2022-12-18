import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cardsRouter from './routes/cards';
import userRouter from './routes/user';
import { RequestCustom } from './services/types';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(helmet);

app.use((req: Request, res: Response, next) => {
  (req as RequestCustom).user = {
    _id: '639e05c8c088b487bf17dd76',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
