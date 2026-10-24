import React from 'react';
import { 
  CheckCircle2, 
  Circle,
  Clock,
  Calendar,
  BookOpen,
  Plus,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AddTodoModal } from './AddToDoModel';
import { Sidebar } from '../layout/sidebar';
import { Header } from '../layout/header';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  dueTime?: string;
  course?: string;
  priority: 'low' | 'medium' | 'high';
}

export function TodoList() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleAddTodo = (todoData: any) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title: todoData.title,
      description: todoData.description,
      completed: false,
      dueDate: new Date(todoData.dueDate),
      dueTime: todoData.dueTime,
      course: todoData.course,
      priority: todoData.priority,
    };
    setTodos([...todos, newTodo]);
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">To-do</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md divide-y">
        {todos.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No tasks yet
            </h3>
            <p className="text-gray-500">
              Add your first task to get started
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                'p-4 flex items-start gap-4',
                todo.completed && 'bg-gray-50'
              )}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="mt-1 text-gray-400 hover:text-blue-600"
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={cn(
                    'text-lg font-medium',
                    todo.completed && 'line-through text-gray-500'
                  )}>
                    {todo.title}
                  </h3>
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    getPriorityColor(todo.priority)
                  )}>
                    {todo.priority}
                  </span>
                </div>

                {todo.description && (
                  <p className="mt-1 text-gray-600">{todo.description}</p>
                )}
                
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {todo.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                  {todo.dueTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{todo.dueTime}</span>
                    </div>
                  )}
                  {todo.course && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{todo.course}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
    </div>
      </div>
  );
}