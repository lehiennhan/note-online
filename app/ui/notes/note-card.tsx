'use client';

import { Note } from '@/app/lib/definitions';
import { MdDelete } from 'react-icons/md';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

const noteColorMap: { [key: string]: string } = {
  '#fef3c7': '#cba6f7', // Vàng -> Mauve
  '#d1fae5': '#94e2d5', // Xanh lá -> Teal
  '#dbeafe': '#89dceb', // Xanh dương -> Sky
  '#fce7f3': '#f5c2e7', // Hồng -> Pink
  '#e9d5ff': '#b4befe', // Tím -> Lavender
  '#fed7aa': '#fab387', // Cam -> Peach
};

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const bgColor = noteColorMap[note.color || '#fef3c7'] || '#45475a';
  
  return (
    <div
      className="relative p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-opacity-20 border border-opacity-30 border-[#cdd6f4]"
      style={{ backgroundColor: bgColor, borderColor: bgColor }}
    >
      {/* Nút xóa */}
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-[#f38ba8]/20 transition-colors"
        aria-label="Delete note"
      >
        <MdDelete className="text-[#f38ba8] text-xl" />
      </button>

      {/* Tiêu đề note */}
      <h3 className="text-lg font-bold mb-2 pr-8 break-words text-[#cdd6f4]">
        {note.title}
      </h3>

      {/* Nội dung note */}
      <p className="text-[#a6adc8] text-sm mb-3 whitespace-pre-wrap break-words">
        {note.content}
      </p>

      {/* Thời gian tạo */}
      <p className="text-xs text-[#6c7086]">
        {typeof note.createdAt === 'number' 
          ? new Date(note.createdAt).toLocaleDateString('vi-VN', {
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
  );
}
