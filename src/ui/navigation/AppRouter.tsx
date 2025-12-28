import React, { Suspense, lazy, useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../../core/auth/auth.state';
import SectionTitle from '../atoms/SectionTitle';
import ErrorBoundary from '../utility/ErrorBoundary';
import LoadingFallback from '../utility/LoadingFallback';

const LoginScreen = lazy(() => import('../screens/LoginScreen'));
const OnboardingScreen = lazy(() => import('../screens/OnboardingScreen'));
const DashboardScreen = lazy(() => import('../screens/DashboardScreen'));
const WorkoutPlanScreen = lazy(() => import('../screens/WorkoutPlanScreen'));
const DailyWorkoutScreen = lazy(() => import('../screens/DailyWorkoutScreen'));
const HistoryScreen = lazy(() => import('../screens/HistoryScreen'));
const WorkoutSessionPanel = lazy(() => import('../organisms/WorkoutSessionPanel'));

const SessionScreen: React.FC = () => (
  <div className="p-4 space-y-4">
    <SectionTitle>Session</SectionTitle>
    <WorkoutSessionPanel />
  </div>
);

export const AppRouter: React.FC = () => {
  const { isAuthenticated, onboardingCompleted } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    onboardingCompleted: state.onboardingCompleted,
  }));

  const requireAuth = useMemo(
    () =>
      (element: ReactElement): ReactElement => {
        if (!isAuthenticated) return <Navigate to="/login" replace />;
        if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;
        return element;
      },
    [isAuthenticated, onboardingCompleted],
  );

  const suspenseWrapper = (node: ReactNode) => (
    <Suspense fallback={<LoadingFallback message="Loading..." />}>{node}</Suspense>
  );

  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<LoadingFallback message="Something went wrong." />}>
        <Routes>
          <Route
            path="/login"
            element={suspenseWrapper(
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen />,
            )}
          />
          <Route
            path="/onboarding"
            element={
              suspenseWrapper(
                isAuthenticated && !onboardingCompleted ? (
                  <OnboardingScreen />
                ) : (
                  <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
                ),
              )
            }
          />
          <Route path="/dashboard" element={suspenseWrapper(requireAuth(<DashboardScreen />))} />
          <Route path="/plan" element={suspenseWrapper(requireAuth(<WorkoutPlanScreen />))} />
          <Route path="/workout" element={suspenseWrapper(requireAuth(<DailyWorkoutScreen />))} />
          <Route path="/history" element={suspenseWrapper(requireAuth(<HistoryScreen />))} />
          <Route path="/session" element={suspenseWrapper(requireAuth(<SessionScreen />))} />
          <Route
            path="*"
            element={suspenseWrapper(<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />)}
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;
