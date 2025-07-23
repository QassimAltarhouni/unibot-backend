import TodoListModel, { TodoList } from '@/Model/todoList.model';

const AddTodoList = async (input: Partial<TodoList>) => {
  return TodoListModel.create(input);
};

export default AddTodoList;
