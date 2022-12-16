import mongoose from "mongoose";

type TCard = {
  name: string;
  link: string;
  owner: string;
  likes: string[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<TCard>({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: true
  },
  owner: {

  },
  likes: {

  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

export default mongoose.model<TCard>('card', cardSchema)
