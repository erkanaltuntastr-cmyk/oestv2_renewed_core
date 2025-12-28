import React, { memo, useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import { getMovementProgression } from '../../core/analytics/progressionAnalytics';

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

export const MovementProgressionChart = memo(({ movementCode, history = [] }) => {
  const progression = useMemo(
    () => getMovementProgression(history, movementCode),
    [history, movementCode],
  );

  if (!movementCode) {
    return (
      <Card className="p-4">
        <p className="text-sm text-gray-500">Select a movement to view progression.</p>
      </Card>
    );
  }

  if (!progression.length) {
    return (
      <Card className="p-4">
        <p className="text-sm text-gray-500">No progression data.</p>
      </Card>
    );
  }

  const maxVolume = Math.max(...progression.map((item) => item.volume), 1);

  return (
    <div className="space-y-2">
      <SectionTitle className="mb-0">Progression for {movementCode}</SectionTitle>
      <Card className="p-4">
        <div className="flex items-end gap-3 h-40">
          {progression.map((item) => {
            const height = Math.max(8, (item.volume / maxVolume) * 160);
            return (
              <div key={item.date} className="flex flex-col items-center flex-1 min-w-[50px]">
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all"
                  style={{ height }}
                  title={`${item.volume} volume`}
                />
                <span className="text-[10px] text-gray-600 mt-1 text-center leading-tight">
                  {formatDate(item.date)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
});

MovementProgressionChart.displayName = 'MovementProgressionChart';

export default MovementProgressionChart;
