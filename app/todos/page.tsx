'use client';

import { useTodos } from '@/app/hooks/useTodos';
import TodoList from '@/app/ui/todos/todo-list';
import AddTodoForm from '@/app/ui/todos/add-todo-form';
import LoadingSpinner from '@/app/ui/notes/loading-spinner';

export default function TodosPage() {
    const { todos, loading, error, addTodo, deleteTodo, updateTodoStatus } = useTodos();

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
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2 flex items-center gap-2">
                    ✅ Todo List
                </h1>
                <p className="text-[#a6adc8]">
                    Manage your daily tasks efficiently.
                </p>
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
