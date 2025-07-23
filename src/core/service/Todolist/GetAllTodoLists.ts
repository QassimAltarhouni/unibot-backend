import TodoListModel from '@/Model/todoList.model';

const GetAllTodoLists = async () => {
  return TodoListModel.find({}).exec();
};

export default GetAllTodoLists;
