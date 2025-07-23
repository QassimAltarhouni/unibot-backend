import mongoose from 'mongoose';
import TodoListModel from '@/Model/todoList.model';

const FindTodoListById = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) return TodoListModel.findById(id);
  else return null;
};

export default FindTodoListById;
