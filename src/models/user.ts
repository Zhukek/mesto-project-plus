import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { urlValidate, emailValidate } from '../services/validate';
import { AuthError } from '../services/errors';

type TUser = {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<TUser> {
  loginUser: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, TUser>>
}

const userSchema = new mongoose.Schema<TUser, IUserModel>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: emailValidate,
      message: 'Невалидный email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: urlValidate,
      message: 'Неверно указан url',
    },
  },
});

userSchema.static('loginUser', function loginUser(email: string, password: string) {
  return this.findOne({ email }).select(+password)
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверное имя или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthError('Неверное имя или пароль');
          }

          return user;
        });
    });
});

export default mongoose.model<TUser, IUserModel>('user', userSchema);
