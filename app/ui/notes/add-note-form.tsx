'use client';

import { useState } from 'react';
import { NoteInput } from '@/app/lib/definitions';
import { MdAdd } from 'react-icons/md';

interface AddNoteFormProps {
  onAddNote: (note: NoteInput) => Promise<void>;
}

const COLORS = [
  { name: 'Vàng', value: '#fef3c7' },
  { name: 'Xanh lá', value: '#d1fae5' },
  { name: 'Xanh dương', value: '#dbeafe' },
  { name: 'Hồng', value: '#fce7f3' },
  { name: 'Tím', value: '#e9d5ff' },
  { name: 'Cam', value: '#fed7aa' },
];

export default function AddNoteForm({ onAddNote }: AddNoteFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddNote({
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
      });

      // Reset form
      setTitle('');
      setContent('');
      setSelectedColor(COLORS[0].value);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Có lỗi xảy ra khi thêm ghi chú!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Add note"
      >
        <MdAdd className="text-3xl" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Tạo ghi chú mới</h2>

        <form onSubmit={handleSubmit}>
          {/* Tiêu đề */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tiêu đề..."
              maxLength={100}
            />
          </div>

          {/* Nội dung */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Nhập nội dung ghi chú..."
              rows={6}
            />
          </div>

          {/* Chọn màu */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn màu
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'Thêm ghi chú'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
