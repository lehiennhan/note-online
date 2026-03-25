'use client';

import { useState } from 'react';
import { useTodos } from '@/app/hooks/useTodos';
import TodoList from '@/app/ui/todos/todo-list';
import AddTodoForm from '@/app/ui/todos/add-todo-form';
import LoadingSpinner from '@/app/ui/notes/loading-spinner';

export default function TodosPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { todos, loading, error, addTodo, deleteTodo, updateTodoStatus } = useTodos(selectedDate);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        
        // Tạo Date từ chuỗi YYYY-MM-DD nhưng giữ nguyên giờ địa phương tránh bị đổi ngày do TimeZone
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newDate = new Date(year, month - 1, day);
        setSelectedDate(newDate);
    };

    const getLocalDateString = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    const handleDeleteTodo = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa tác vụ này?')) {
            try {
                await deleteTodo(id);
            } catch {
                alert('Không thể xóa tác vụ!');
            }
        }
    };

    const handleToggleTodoStatus = async (id: string, isCompleted: boolean) => {
        try {
            await updateTodoStatus(id, isCompleted);
        } catch {
            alert('Không thể cập nhật trạng thái tác vụ!');
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] p-6 pb-24">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2 flex items-center gap-2">
                        ✅ Todo List
                    </h1>
                    <p className="text-[#a6adc8]">
                        Manage your daily tasks efficiently.
                    </p>
                </div>
                
                {/* Date Filter */}
                <div className="flex items-center gap-3 bg-[#313244] p-2 rounded-xl border border-[#45475a]">
                    <label htmlFor="todo-date" className="text-[#cdd6f4] font-medium px-2">Ngày:</label>
                    <input 
                        type="date" 
                        id="todo-date"
                        value={getLocalDateString(selectedDate)}
                        onChange={handleDateChange}
                        className="bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg px-3 py-2 focus:outline-none focus:border-[#cba6f7] transition-colors"
                        style={{ colorScheme: 'dark' }}
                    />
                    <button 
                        onClick={() => setSelectedDate(new Date())}
                        className="px-3 py-2 text-sm bg-[#cba6f7] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#b4befe] transition-colors whitespace-nowrap"
                    >
                        Hôm nay
                    </button>
                </div>
            </div>
            {/* Content */}
            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-[#f38ba8]">{error}</p>
                    </div>
                ) : (
                    <TodoList 
                        todos={todos} 
                        onDeleteTodo={handleDeleteTodo} 
                        onToggleTodoStatus={handleToggleTodoStatus}
                    />
                )}
            </div>

            {/* Add Todo Button */}
            <AddTodoForm onAddTodo={addTodo} />
        </main>
    );
}
