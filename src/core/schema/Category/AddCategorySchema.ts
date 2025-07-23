import { object, string } from 'zod';

const AddCategorySchema = object({
  body: object({
    title: string(),
    description: string(),
    systemPrompt: string(),
    data: string(),
    url: string(),
  }),
});

export default AddCategorySchema;
