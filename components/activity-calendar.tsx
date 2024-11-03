'use client';

import { ActivityCalendar as Calendar } from 'react-activity-calendar';
import { type Post } from '#site/content';
import { generateActivityData } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit } from 'lucide-react';

interface ActivityCalendarProps {
  posts: Post[];
}

export function ActivityCalendar({ posts }: ActivityCalendarProps) {
  const data = generateActivityData(posts);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="size-5" />
          Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="items-center">
        <Calendar
          data={data}
          //   labels={{
          //     legend: {
          //       less: 'Less',
          //       more: 'More'
          //     }
          //   }}
          //   blockSize={12}
          //   blockMargin={4}
          //   fontSize={14}
          //   hideColorLegend={false}
          //   hideMonthLabels={false}
          //   hideTotalCount={false}
          maxLevel={1}
        />
      </CardContent>
    </Card>
  );
}
