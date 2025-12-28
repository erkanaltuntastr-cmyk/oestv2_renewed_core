import React, { memo, useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import { getPRs } from '../../core/analytics/progressionAnalytics';

export const PRList = memo(({ history = [] }) => {
  const prs = useMemo(() => getPRs(history), [history]);
  const entries = Object.entries(prs);

  return (
    <div className="space-y-2">
      <SectionTitle className="mb-0">Personal Records</SectionTitle>
      <Card className="p-4">
        {entries.length ? (
          <ul className="space-y-2">
            {entries.map(([code, weight]) => (
              <li
                key={code}
                className="flex items-center justify-between text-sm text-gray-800 border-b border-gray-100 pb-2 last:border-none last:pb-0"
              >
                <span className="font-medium">{code}</span>
                <span className="text-gray-600">{weight} kg</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No PRs recorded yet.</p>
        )}
      </Card>
    </div>
  );
});

PRList.displayName = 'PRList';

export default PRList;
