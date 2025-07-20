'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWeeklyStats, ChartData } from '@/sanity/lib/stats/getStats';

export function StatsChart({ restaurantId }: { restaurantId: string | null }) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (restaurantId) {
        const weeklyStats = await getWeeklyStats(restaurantId);
        setData(weeklyStats);
      }
    };
    fetchStats();
  }, [restaurantId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques de la semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="vues" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Vues"
              />
              <Line 
                type="monotone" 
                dataKey="scans" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Scans QR"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}