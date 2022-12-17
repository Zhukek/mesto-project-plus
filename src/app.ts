import express, { Request, Response } from "express";
import mongoose, { _FilterQuery } from "mongoose";
import userRouter from "./routes/user";
import cardsRouter from "./routes/cards";

export interface RequestCustom extends Request {
  user?: {
    _id?: string
  }
}

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next) => {
  (req as RequestCustom).user = {
    _id: '639e05c8c088b487bf17dd76'
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.listen(PORT,() => {
    console.log(`App listening on port ${PORT}`)
})
