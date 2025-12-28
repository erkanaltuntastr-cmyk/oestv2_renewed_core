import React, { Suspense, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import SectionTitle from '../atoms/SectionTitle';
import Card from '../atoms/Card';
import { useWorkoutHistory } from '../../core/hooks/useWorkoutHistory';
import LoadingFallback from '../utility/LoadingFallback';
import type { HistoryEntry } from '../../types/history';

const VolumeSummary = React.lazy(() => import('../analytics/VolumeSummary'));
const TopMovements = React.lazy(() => import('../analytics/TopMovements'));
const PRList = React.lazy(() => import('../analytics/PRList'));
const MovementProgressionChart = React.lazy(() => import('../analytics/MovementProgressionChart'));

const formatDate = (timestamp: number): string => new Date(timestamp).toLocaleDateString();

export const HistoryScreen: React.FC = () => {
  const { getHistory } = useWorkoutHistory();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedMovement, setSelectedMovement] = useState<string>('');

  useEffect(() => {
    const entries = getHistory();
    if (Array.isArray(entries)) {
      setHistory(entries);
    }
  }, [getHistory]);

  const movementOptions = useMemo<string[]>(() => {
    const codes = new Set<string>();
    history.forEach((entry) => {
      (entry.movements || []).forEach((movement) => codes.add(movement.code));
    });
    return Array.from(codes);
  }, [history]);

  return (
    <div className="p-4 space-y-6">
      <SectionTitle>History &amp; Analytics</SectionTitle>
      <Suspense fallback={<LoadingFallback message="Loading analytics..." />}>
        <VolumeSummary history={history} />
      </Suspense>

      <Suspense fallback={<LoadingFallback message="Loading top movements..." />}>
        <TopMovements history={history} />
      </Suspense>

      <Suspense fallback={<LoadingFallback message="Loading PRs..." />}>
        <PRList history={history} />
      </Suspense>

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
                    <p className="text-xs text-gray-500">{(entry.movements || []).length} movements</p>
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedMovement(e.target.value)}
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
        <Suspense fallback={<LoadingFallback message="Loading progression..." />}>
          <MovementProgressionChart movementCode={selectedMovement} history={history} />
        </Suspense>
      </div>
    </div>
  );
};

export default HistoryScreen;
