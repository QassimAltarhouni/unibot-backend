import { object, string } from 'zod';

const EditCategoryByIdSchema = object({
  params: object({
    id: string(),
  }),
  body: object({
    title: string(),
    description: string(),
    systemPrompt: string(),
    data: string(),
    url: string(),
  }),
});

export default EditCategoryByIdSchema;
