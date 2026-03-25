'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Todo, TodoInput } from '@/app/lib/definitions';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách todos từ Firebase (realtime)
  useEffect(() => {
    const todosQuery = query(
      collection(db, 'todos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      todosQuery,
      (snapshot) => {
        const todosData: Todo[] = snapshot.docs.map((docItem) => {
          const data = docItem.data();
          return {
            id: docItem.id,
            title: data.title,
            isCompleted: data.isCompleted || false,
            createdAt: data.createdAt?.toMillis() || Date.now(),
            updatedAt: data.updatedAt?.toMillis() || Date.now(),
          };
        });
        setTodos(todosData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching todos:', err);
        setError('Không thể tải todolist');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Thêm todo mới
  const addTodo = async (todoInput: TodoInput) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'todos'), {
        title: todoInput.title,
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      console.error('Error adding todo:', err);
      throw new Error('Không thể thêm todo');
    }
  };

  // Cập nhật trạng thái todo (hoàn thành)
  const updateTodoStatus = async (id: string, isCompleted: boolean) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        isCompleted,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Error updating todo:', err);
      throw new Error('Không thể cập nhật todo');
    }
  };

  // Xóa todo
  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw new Error('Không thể xóa todo');
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodoStatus,
    deleteTodo,
  };
}
