import { object, string } from 'zod';

const GetCategoryByIdSchema = object({
  params: object({
    id: string()
      .length(24, 'Invalid MongoDB ObjectId')
      .regex(/^[a-f0-9]{24}$/, 'Invalid ObjectId format'),
  }),
});

export default GetCategoryByIdSchema;
