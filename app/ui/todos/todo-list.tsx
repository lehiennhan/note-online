'use client';

import { Todo } from '@/app/lib/definitions';
import TodoCard from './todo-card';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: string) => void;
  onToggleTodoStatus: (id: string, isCompleted: boolean) => void;
}

export default function TodoList({ todos, onDeleteTodo, onToggleTodoStatus }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#a6adc8] text-lg">Bạn chưa có tác vụ nào.</p>
        <p className="text-[#6c7086]">Hãy thêm một tác vụ mới bằng form bên dưới nhé! 👇</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {todos.map((todo) => (
        <TodoCard 
          key={todo.id} 
          todo={todo} 
          onDelete={onDeleteTodo} 
          onToggleStatus={onToggleTodoStatus}
        />
      ))}
    </div>
  );
}
