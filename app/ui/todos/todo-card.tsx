'use client';

import { Todo } from '@/app/lib/definitions';
import { MdDelete } from 'react-icons/md';

interface TodoCardProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isCompleted: boolean) => void;
}

export default function TodoCard({ todo, onDelete, onToggleStatus }: TodoCardProps) {
  return (
    <div
      className={`relative p-3 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-opacity-20 border border-opacity-30 flex items-center gap-2 ${
        todo.isCompleted 
          ? 'bg-[#a6e3a1] border-[#a6e3a1] opacity-60' 
          : 'bg-[#cba6f7] border-[#cdd6f4]'
      }`}
      style={{ backgroundColor: todo.isCompleted ? '#efdbfcff' : '#cba6f7' }}
    >
      {/* Checkbox */}
      <input 
        type="checkbox" 
        checked={todo.isCompleted} 
        onChange={(e) => onToggleStatus(todo.id, e.target.checked)}
        className="w-5 h-5 rounded-full border-[#45475a] text-[#cba6f7] focus:ring-[#cba6f7] focus:ring-offset-[#1e1e2e] bg-[#313244] cursor-pointer"
      />

      {/* Nội dung todo */}
      <div className="flex-1">
        <h3 className={`text-lg font-bold pr-8 break-words transition-all duration-200 ${
          todo.isCompleted ? 'line-through text-[#ffffff]' : 'text-[#ffffff]'
        }`}>
          {todo.title}
        </h3>
        <p className={`text-xs ${todo.isCompleted ? 'text-[#ffffff]' : 'text-[#ffffff]'}`}>
          {typeof todo.createdAt === 'number' 
            ? new Date(todo.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'N/A'
          }
        </p>
      </div>

      {/* Nút xóa */}
      <button
        onClick={() => onDelete(todo.id)}
        className="p-2 rounded-full hover:bg-[#f38ba8]/20 transition-colors"
        aria-label="Delete todo"
      >
        <MdDelete className="text-[#f38ba8] text-xl" />
      </button>
    </div>
  );
}
