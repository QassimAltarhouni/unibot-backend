import { object, string } from 'zod';

const AddTodoListSchema = object({
  body: object({
    name: string({
      required_error: 'user_firstName_required',
    }),

    listItems: object({
      header: string({
        required_error: 'user_firstName_required',
      }),
      content: string({
        required_error: 'user_firstName_required',
      }),
    }).array(),
  }),
});

export default AddTodoListSchema;
