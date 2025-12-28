import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import Button from '../atoms/Button';
import WorkoutSessionPanel from '../organisms/WorkoutSessionPanel';

export const DashboardScreen = () => {
  return (
    <div className="p-4 space-y-4">
      <SectionTitle>Dashboard</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="space-y-2">
          <p className="text-gray-700">Quick Actions</p>
          <div className="flex flex-col space-y-2">
            <Link to="/workout">
              <Button className="w-full">Start Today’s Workout</Button>
            </Link>
            <Link to="/plan">
              <Button className="w-full" variant="secondary">
                View Weekly Plan
              </Button>
            </Link>
            <Link to="/session">
              <Button className="w-full" variant="secondary">
                Open Session
              </Button>
            </Link>
            <Link to="/history">
              <Button className="w-full" variant="secondary">
                History
              </Button>
            </Link>
          </div>
        </Card>
        <WorkoutSessionPanel />
      </div>
    </div>
  );
};

export default DashboardScreen;
