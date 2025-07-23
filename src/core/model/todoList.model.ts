import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';

export class TodoListItem {
  @prop({ required: true })
  header: string;

  @prop({ required: true })
  content: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ name: 1 })
export class TodoList {
  @prop({ lowercase: true, required: true, unique: true })
  name: string;

  @prop({ default: [] })
  listItems: TodoListItem[];
}

const TodoListModel = getModelForClass(TodoList);
export default TodoListModel;
