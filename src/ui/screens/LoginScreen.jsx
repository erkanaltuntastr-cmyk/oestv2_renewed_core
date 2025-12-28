import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import SectionTitle from '../atoms/SectionTitle';
import { useAuthStore } from '../../core/auth/auth.state';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore((state) => ({
    login: state.login,
    isLoading: state.isLoading,
  }));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user?.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md space-y-4">
        <SectionTitle className="text-center">Login</SectionTitle>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginScreen;
