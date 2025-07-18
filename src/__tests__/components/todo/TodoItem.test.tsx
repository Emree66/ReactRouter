import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';
import TodoItem from '../../../components/todo/TodoItem';
import { Todo } from '../../../types/todo';

test('renders TodoItem component', () => {
	const mockTodo: Todo = {
		id: 1,
		title: "Test Todo",
		description: "Test description",
		completed: false,
		priority: 'medium',
		dueDate: '2025-07-20',
		category: 'Work',
		tags: ['test']
	};

	const mockOnToggleComplete = vi.fn();
	const mockOnDelete = vi.fn();

	render(
		<BrowserRouter>
			<TodoItem 
				todo={mockTodo}
				onToggleComplete={mockOnToggleComplete}
				onDelete={mockOnDelete}
			/>
		</BrowserRouter>
	);
	
	const todoElement = screen.getByText(/Test Todo/i);
	expect(todoElement).toBeDefined();
});