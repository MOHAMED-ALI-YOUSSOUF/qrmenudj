'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { getRecentViews, RecentView } from '@/sanity/lib/stats/getStats';

export function RecentViews({ restaurantId }: { restaurantId: string | null }) {
  const [views, setViews] = useState<RecentView[]>([]);

  useEffect(() => {
    const fetchViews = async () => {
      if (restaurantId) {
        const recentViews = await getRecentViews(restaurantId);
        setViews(recentViews);
      }
    };
    fetchViews();
  }, [restaurantId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Vues récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {views.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex-1">
                <div className="font-medium">{item.dish.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.restaurant.name}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={item.trend === 'up' ? 'default' : 'secondary'}>
                  {item.views} vues
                </Badge>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}