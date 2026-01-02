'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Note, NoteInput } from '@/app/lib/definitions';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách notes từ Firebase (realtime)
  useEffect(() => {
    const notesQuery = query(
      collection(db, 'notes'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData: Note[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            color: data.color,
            createdAt: data.createdAt?.toMillis() || Date.now(),
            updatedAt: data.updatedAt?.toMillis() || Date.now(),
          };
        });
        setNotes(notesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching notes:', err);
        setError('Không thể tải ghi chú');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Thêm note mới
  const addNote = async (noteInput: NoteInput) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'notes'), {
        title: noteInput.title,
        content: noteInput.content,
        color: noteInput.color || '#fef3c7',
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      console.error('Error adding note:', err);
      throw new Error('Không thể thêm ghi chú');
    }
  };

  // Xóa note
  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      console.error('Error deleting note:', err);
      throw new Error('Không thể xóa ghi chú');
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    deleteNote,
  };
}
