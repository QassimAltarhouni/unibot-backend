import { object, string } from 'zod';

const RemoveCategoryByIdSchema = object({
  params: object({
    id: string(),
  }),
});

export default RemoveCategoryByIdSchema;
