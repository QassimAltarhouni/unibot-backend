import { getModelForClass, prop } from '@typegoose/typegoose';

// infinite amount of role can be created middleware will handle all
export class Role {
  @prop({ required: true, unique: true })
  name: string;
  @prop({ default: false })
  write: boolean;
  @prop({ default: false })
  delete: boolean;
  @prop({ default: false })
  softDelete: boolean;
  @prop({ default: false })
  read: boolean;
  @prop({ default: false })
  firstPage: boolean;
  @prop({ default: false })
  secondPage: boolean;
  @prop({ default: false })
  thirdPage: boolean;
}

const RoleModel = getModelForClass(Role, {
  schemaOptions: {
    timestamps: true,
  },
});

export default RoleModel;
