import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { Logger } from '@/Utils/index';

export const privateFields = [
  'password',
  '__v',
  'verificationCode',
  'passwordResetCode',
  'verified',
];

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true, select: false })
  password: string;

  // fixme: select:false
  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  // fixme: select:false
  @prop()
  passwordResetCode: string | null;

  @prop({ default: true })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (e) {
      // FIXME: log error
      Logger.error(e, 'Could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
