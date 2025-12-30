'use client';

import { Note } from '@/app/lib/definitions';
import NoteCard from './note-card';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
}

export default function NoteList({ notes, onDeleteNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Chưa có ghi chú nào. Hãy tạo ghi chú đầu tiên của bạn! 📝
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}
