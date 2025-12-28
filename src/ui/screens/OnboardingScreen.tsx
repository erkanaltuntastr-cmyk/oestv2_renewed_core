import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import SectionTitle from '../atoms/SectionTitle';
import { useAuthStore } from '../../core/auth/auth.state';
import type { User } from '../../types/user';

interface OnboardingForm {
  displayName: string;
  age: string;
  gender: string;
  weight: string;
  experience: string;
}

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setOnboardingCompleted } = useAuthStore((state) => ({
    user: state.user,
    setUser: state.setUser,
    setOnboardingCompleted: state.setOnboardingCompleted,
  }));

  const [form, setForm] = useState<OnboardingForm>({
    displayName: user?.displayName || '',
    age: (user?.age as unknown as string) || '',
    gender: user?.gender || '',
    weight: (user?.weight as unknown as string) || '',
    experience: user?.experience || '',
  });

  const handleChange = (key: keyof OnboardingForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const updatedUser: User = {
      ...(user as User),
      displayName: form.displayName,
      age: form.age ? Number(form.age) : undefined,
      gender: form.gender as User['gender'],
      weight: form.weight ? Number(form.weight) : undefined,
      experience: form.experience as User['experience'],
      onboardingCompleted: true,
    };
    setUser(updatedUser);
    setOnboardingCompleted(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg space-y-4">
        <SectionTitle className="text-center">Complete Onboarding</SectionTitle>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSave}>
          <Input label="Display Name" value={form.displayName} onChange={handleChange('displayName')} />
          <Input label="Age" type="number" value={form.age} onChange={handleChange('age')} />
          <Input label="Gender" value={form.gender} onChange={handleChange('gender')} />
          <Input label="Weight (kg)" type="number" value={form.weight} onChange={handleChange('weight')} />
          <Input label="Experience" value={form.experience} onChange={handleChange('experience')} placeholder="beginner" />
          <div className="md:col-span-2">
            <Button className="w-full" onClick={handleSave}>
              Save & Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
