'use client';

import { Note } from '@/app/lib/definitions';
import { MdDelete } from 'react-icons/md';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div
      className="relative p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundColor: note.color || '#fef3c7' }}
    >
      {/* Nút xóa */}
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Delete note"
      >
        <MdDelete className="text-red-600 text-xl" />
      </button>

      {/* Tiêu đề note */}
      <h3 className="text-lg font-bold mb-2 pr-8 break-words">
        {note.title}
      </h3>

      {/* Nội dung note */}
      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap break-words">
        {note.content}
      </p>

      {/* Thời gian tạo */}
      <p className="text-xs text-gray-500">
        {new Date(note.createdAt).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  );
}
