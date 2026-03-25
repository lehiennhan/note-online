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
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Todo, TodoInput } from '@/app/lib/definitions';

export function useTodos(selectedDate?: Date) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách todos từ Firebase (realtime)
  useEffect(() => {
    let todosQuery = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));

    if (selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      todosQuery = query(
        collection(db, 'todos'),
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end)),
        orderBy('createdAt', 'desc')
      );
    }

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
  }, [selectedDate]);

  // Thêm todo mới
  const addTodo = async (todoInput: TodoInput) => {
    try {
      let now = new Date();
      if (selectedDate && selectedDate.toDateString() !== new Date().toDateString()) {
        now = new Date(selectedDate);
        now.setHours(12, 0, 0, 0); // Đặt vào giữa ngày
      }
      
      const timestamp = Timestamp.fromDate(now);

      await addDoc(collection(db, 'todos'), {
        title: todoInput.title,
        isCompleted: false,
        createdAt: timestamp,
        updatedAt: Timestamp.now(),
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
