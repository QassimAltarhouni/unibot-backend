import { object, string } from 'zod';

const GetTodoListByIdSchema = object({
  query: object({
    id: string(),
  }),
});

export default GetTodoListByIdSchema;
