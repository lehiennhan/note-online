'use client';

import { useNotes } from '@/app/hooks/useNotes';
import NoteList from '@/app/ui/notes/note-list';
import AddNoteForm from '@/app/ui/notes/add-note-form';
import LoadingSpinner from '@/app/ui/notes/loading-spinner';

export default function NotesPage() {
    const { notes, loading, error, addNote, deleteNote } = useNotes();

    const handleDeleteNote = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            try {
                await deleteNote(id);
            } catch {
                alert('Không thể xóa ghi chú!');
            }
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">
                    📝 Note Online
                </h1>
                <p className="text-[#a6adc8]">
                    Quản lý ghi chú của bạn một cách đơn giản và hiệu quả
                </p>
            </div>
            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-[#f38ba8]">{error}</p>
                    </div>
                ) : (
                    <NoteList notes={notes} onDeleteNote={handleDeleteNote} />
                )}
            </div>

            {/* Add Note Button */}
            <AddNoteForm onAddNote={addNote} />
        </main>
    );
}
