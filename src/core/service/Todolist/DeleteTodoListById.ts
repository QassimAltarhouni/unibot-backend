import mongoose from 'mongoose';
import TodoListModel from '@/Model/todoList.model';

const DeleteTodoListById = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const deletedTodoList = await TodoListModel.findByIdAndDelete(id);
    return deletedTodoList;
  } else {
    return null;
  }
};

export default DeleteTodoListById;
