import { object, string } from 'zod';

const GetTodoListSchema = object({
  params: object({
    id: string(),
  }),
});

export default GetTodoListSchema;
