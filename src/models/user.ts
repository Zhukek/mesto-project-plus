import mongoose from 'mongoose';
import urlValidate from '../services/urlValidate';

type TUser = {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    require: true,
    validate: {
      validator: urlValidate,
      message: 'Неверно указан url',
    },
  },
});

export default mongoose.model<TUser>('user', userSchema);
