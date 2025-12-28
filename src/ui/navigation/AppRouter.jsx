import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../../core/auth/auth.state';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import WorkoutPlanScreen from '../screens/WorkoutPlanScreen';
import DailyWorkoutScreen from '../screens/DailyWorkoutScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WorkoutSessionPanel from '../organisms/WorkoutSessionPanel';
import SectionTitle from '../atoms/SectionTitle';

const SessionScreen = () => (
  <div className="p-4 space-y-4">
    <SectionTitle>Session</SectionTitle>
    <WorkoutSessionPanel />
  </div>
);

export const AppRouter = () => {
  const { isAuthenticated, onboardingCompleted } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    onboardingCompleted: state.onboardingCompleted,
  }));

  const requireAuth = (element) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;
    return element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen />}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated && !onboardingCompleted ? (
              <OnboardingScreen />
            ) : (
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
            )
          }
        />
        <Route path="/dashboard" element={requireAuth(<DashboardScreen />)} />
        <Route path="/plan" element={requireAuth(<WorkoutPlanScreen />)} />
        <Route path="/workout" element={requireAuth(<DailyWorkoutScreen />)} />
        <Route path="/history" element={requireAuth(<HistoryScreen />)} />
        <Route path="/session" element={requireAuth(<SessionScreen />)} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
