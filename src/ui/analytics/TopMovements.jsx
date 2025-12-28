import React, { useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import { getTopMovements } from '../../core/analytics/frequencyAnalytics';

export const TopMovements = ({ history = [] }) => {
  const topMovements = useMemo(() => getTopMovements(history, 5), [history]);

  return (
    <div className="space-y-2">
      <SectionTitle className="mb-0">Top Movements</SectionTitle>
      <Card className="p-4">
        {topMovements.length ? (
          <ul className="space-y-2">
            {topMovements.map(({ code, count }) => (
              <li
                key={code}
                className="flex items-center justify-between text-sm text-gray-800 border-b border-gray-100 pb-2 last:border-none last:pb-0"
              >
                <span className="font-medium">{code}</span>
                <span className="text-gray-600">{count}×</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No movement data yet.</p>
        )}
      </Card>
    </div>
  );
};

export default TopMovements;
