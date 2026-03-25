'use client';

import { useState } from 'react';
import { TodoInput } from '@/app/lib/definitions';
import { MdAdd } from 'react-icons/md';

interface AddTodoFormProps {
  onAddTodo: (todo: TodoInput) => Promise<void>;
}

export default function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTodo({ title });
      setTitle('');
    } catch {
      alert('Đã xảy ra lỗi khi thêm todo mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e2e]/90 backdrop-blur-sm border-t border-[#45475a] p-4 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <form 
          onSubmit={handleSubmit}
          className="w-full flex gap-3"
        >
          <input
            type="text"
            placeholder="Nhập nội dung tác vụ mới..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-[#313244] text-[#cdd6f4] border border-[#45475a] rounded-xl px-4 py-3 focus:outline-none focus:border-[#cba6f7] transition-colors"
            required
            maxLength={200}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="bg-[#cba6f7] text-[#1e1e2e] p-3 rounded-xl hover:bg-[#b4befe] transition-all disabled:cursor-not-allowed flex items-center gap-2 font-bold px-6"
          >
            <MdAdd className="text-xl" />
            <span className="hidden sm:inline">Thêm</span>
          </button>
        </form>
      </div>
    </div>
  );
}
