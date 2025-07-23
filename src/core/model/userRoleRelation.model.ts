import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Role } from './role.model';

export class userRoleRelation {
  @prop({ ref: () => User, unique: true, required: true })
  user: Ref<User>;

  @prop({ ref: () => Role, required: true })
  role: Ref<Role>;
}

const userRoleRelationModel = getModelForClass(userRoleRelation, {
  schemaOptions: {
    timestamps: true,
  },
});

export default userRoleRelationModel;
