import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskModal } from '../components/TaskModal';
import { KanbanBoard } from '../components/KanbanBoard';
import { api } from '../lib/api';
import { Project, Task } from '../types';

// Mock the API client
vi.mock('../lib/api', () => ({
  api: {
    createTask: vi.fn(),
    getTaskById: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    isConflict = false;
  },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-alice-123',
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
    token: 'mock-jwt-token',
    isLoading: false,
    logout: vi.fn(),
  }),
}));

describe('Frontend Requirement: Creating a task and seeing it appear', () => {
  const mockProject: Project = {
    _id: 'proj-123',
    name: 'TeamFlow Platform',
    description: 'Main project',
    owner: { id: 'user-alice-123', name: 'Alice Johnson', email: 'alice@example.com' },
    members: [
      {
        user: { id: 'user-alice-123', name: 'Alice Johnson', email: 'alice@example.com' },
        role: 'owner',
        joinedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows the user to create a task via TaskModal and calls the API', async () => {
    const onSaved = vi.fn();
    const onClose = vi.fn();

    (api.createTask as any).mockResolvedValue({
      task: {
        _id: 'new-task-001',
        project: 'proj-123',
        title: 'New High Priority Security Task',
        description: 'Implement CSP headers',
        status: 'To Do',
        priority: 'High',
        assignee: null,
        dueDate: null,
        creator: { id: 'user-alice-123', name: 'Alice Johnson', email: 'alice@example.com' },
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    render(
      <TaskModal
        isOpen={true}
        project={mockProject}
        userRole="owner"
        initialStatus="To Do"
        onClose={onClose}
        onSaved={onSaved}
      />
    );

    // Verify modal header is visible
    expect(screen.getByText('Create New Task')).toBeInTheDocument();

    // Fill in task title
    const titleInput = screen.getByPlaceholderText('e.g. Implement authentication rate limiting');
    fireEvent.change(titleInput, { target: { value: 'New High Priority Security Task' } });

    // Fill in description
    const descInput = screen.getByPlaceholderText('Add detailed context, repro steps, or acceptance criteria...');
    fireEvent.change(descInput, { target: { value: 'Implement CSP headers' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitBtn);

    // Verify API was called with the correct payload
    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith(
        'proj-123',
        expect.objectContaining({
          title: 'New High Priority Security Task',
          description: 'Implement CSP headers',
          status: 'To Do',
        })
      );
      expect(onSaved).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('renders the created task in the Kanban Board under the correct status column', () => {
    const createdTask: Task = {
      _id: 'new-task-001',
      project: 'proj-123',
      title: 'New High Priority Security Task',
      description: 'Implement CSP headers',
      status: 'To Do',
      priority: 'High',
      assignee: null,
      dueDate: null,
      creator: { id: 'user-alice-123', name: 'Alice Johnson', email: 'alice@example.com' },
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const onOpenTask = vi.fn();
    const onNewTask = vi.fn();
    const onUpdateStatus = vi.fn();

    render(
      <KanbanBoard
        tasks={[createdTask]}
        onOpenTask={onOpenTask}
        onNewTask={onNewTask}
        onUpdateStatus={onUpdateStatus}
      />
    );

    // Verify the task card title is rendered in the DOM
    const taskCard = screen.getByText('New High Priority Security Task');
    expect(taskCard).toBeInTheDocument();

    // Verify priority badge is visible
    expect(screen.getByText('High')).toBeInTheDocument();
  });
});
