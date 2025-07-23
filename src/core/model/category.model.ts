import { getModelForClass, prop } from '@typegoose/typegoose';

export class Category {
  @prop({ required: true, unique: true })
  title: string;
  @prop({ required: true })
  description: string;
  @prop({ required: true })
  systemPrompt: string;
  @prop({ required: true })
  data: string;
  @prop({ required: true })
  url: string;
}

const CategoryModel = getModelForClass(Category, {
  schemaOptions: {
    timestamps: true,
  },
});

export default CategoryModel;
