import React, { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../atoms/SectionTitle';
import Card from '../atoms/Card';
import VolumeSummary from '../analytics/VolumeSummary';
import TopMovements from '../analytics/TopMovements';
import PRList from '../analytics/PRList';
import MovementProgressionChart from '../analytics/MovementProgressionChart';
import { useWorkoutHistory } from '../../core/hooks/useWorkoutHistory';

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

export const HistoryScreen = () => {
  const { getHistory } = useWorkoutHistory();
  const [history, setHistory] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState('');

  useEffect(() => {
    const entries = getHistory();
    if (Array.isArray(entries)) {
      setHistory(entries);
    }
  }, [getHistory]);

  const movementOptions = useMemo(() => {
    const codes = new Set();
    history.forEach((entry) => {
      (entry.movements || []).forEach((movement) => codes.add(movement.code));
    });
    return Array.from(codes);
  }, [history]);

  return (
    <div className="p-4 space-y-6">
      <SectionTitle>History &amp; Analytics</SectionTitle>

      <VolumeSummary history={history} />

      <TopMovements history={history} />

      <PRList history={history} />

      <div className="space-y-2">
        <SectionTitle className="mb-0">Recent Workouts</SectionTitle>
        <Card className="p-4">
          {history.length ? (
            <ul className="divide-y divide-gray-100">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="py-3 flex items-center justify-between text-sm text-gray-800"
                >
                  <div>
                    <p className="font-medium">{formatDate(entry.date)}</p>
                    <p className="text-xs text-gray-500">
                      {(entry.movements || []).length} movements
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{Math.round(entry.totalVolume || 0)} volume</p>
                    <p className="text-xs text-gray-500">{entry.durationMinutes || 0} min</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No history yet.</p>
          )}
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle className="mb-0">Movement Progression</SectionTitle>
        <Card className="p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Movement
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMovement}
              onChange={(e) => setSelectedMovement(e.target.value)}
            >
              <option value="">Choose a movement</option>
              {movementOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </Card>
        <MovementProgressionChart movementCode={selectedMovement} history={history} />
      </div>
    </div>
  );
};

export default HistoryScreen;
