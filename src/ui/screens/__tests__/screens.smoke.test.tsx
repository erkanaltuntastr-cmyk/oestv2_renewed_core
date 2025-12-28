import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import LoginScreen from '../LoginScreen';
import OnboardingScreen from '../OnboardingScreen';
import DashboardScreen from '../DashboardScreen';
import HistoryScreen from '../HistoryScreen';

vi.mock('../../../core/auth/auth.state', () => {
  const mockState = {
    login: vi.fn(async () => ({ uid: '1', email: 'mock@example.com', onboardingCompleted: true })),
    isLoading: false,
    user: { uid: '1', email: 'mock@example.com', onboardingCompleted: true },
    setUser: vi.fn(),
    setOnboardingCompleted: vi.fn(),
  } as const;
  return { useAuthStore: (selector: (state: typeof mockState) => unknown) => selector(mockState) };
});

vi.mock('../../../core/hooks/useWorkoutSession', () => ({
  useWorkoutSession: () => ({
    session: [],
    addMovement: vi.fn(),
    updateMovement: vi.fn(),
    removeMovement: vi.fn(),
    clearSession: vi.fn(),
  }),
}));

vi.mock('../../../core/hooks/useWorkoutHistory', () => ({
  useWorkoutHistory: () => ({
    getHistory: () => [
      {
        id: 'h1',
        date: 1700000000000,
        movements: [],
        totalVolume: 0,
        durationMinutes: 0,
      },
    ],
    saveCurrentSession: vi.fn(),
    clearHistory: vi.fn(),
  }),
}));

vi.mock('../../analytics/VolumeSummary', () => ({ __esModule: true, default: () => <div>Volume Summary</div> }));
vi.mock('../../analytics/TopMovements', () => ({ __esModule: true, default: () => <div>Top Movements</div> }));
vi.mock('../../analytics/PRList', () => ({ __esModule: true, default: () => <div>PR List</div> }));
vi.mock('../../analytics/MovementProgressionChart', () => ({ __esModule: true, default: () => <div>Progression Chart</div> }));
vi.mock('../organisms/WorkoutSessionPanel', () => ({ __esModule: true, default: () => <div>Session Panel</div> }));

describe('UI screen smoke tests', () => {
  it('renders LoginScreen inputs and button', () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders OnboardingScreen form fields', () => {
    render(
      <MemoryRouter>
        <OnboardingScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText('Complete Onboarding')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
  });

  it('renders Dashboard quick actions', () => {
    render(
      <MemoryRouter>
        <DashboardScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Start Today’s Workout')).toBeInTheDocument();
    expect(screen.getByText('Session Panel')).toBeInTheDocument();
  });

  it('renders History screen sections', async () => {
    render(
      <MemoryRouter>
        <HistoryScreen />
      </MemoryRouter>,
    );

    expect(await screen.findByText('History & Analytics')).toBeInTheDocument();
    expect(await screen.findByText('Volume Summary')).toBeInTheDocument();
    expect(await screen.findByText('Progression Chart')).toBeInTheDocument();
  });
});
