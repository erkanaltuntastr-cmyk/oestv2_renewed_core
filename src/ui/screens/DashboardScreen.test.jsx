import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../core/hooks/useWorkoutSession', () => ({
  useWorkoutSession: () => ({
    session: [],
    addMovement: vi.fn(),
    updateMovement: vi.fn(),
    removeMovement: vi.fn(),
    clearSession: vi.fn(),
  }),
}));

vi.mock('../../core/hooks/useWorkoutHistory', () => ({
  useWorkoutHistory: () => ({
    saveCurrentSession: vi.fn(),
  }),
}));

import DashboardScreen from './DashboardScreen';

describe('DashboardScreen', () => {
  it('renders dashboard actions', () => {
    render(
      <MemoryRouter>
        <DashboardScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Start Today’s Workout')).toBeInTheDocument();
    expect(screen.getByText('View Weekly Plan')).toBeInTheDocument();
    expect(screen.getByText('Open Session')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });
});
