'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Eye, Star } from 'lucide-react';
import { getPopularDishes, PopularDish } from '@/sanity/lib/stats/getStats';

export function PopularDishes({ restaurantId }: { restaurantId: string | null }) {
  const [dishes, setDishes] = useState<PopularDish[]>([]);

  useEffect(() => {
    const fetchDishes = async () => {
      if (restaurantId) {
        const popularDishes = await getPopularDishes(restaurantId);
        setDishes(popularDishes);
      }
    };
    fetchDishes();
  }, [restaurantId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Plats populaires
        </CardTitle>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dishes.map((dish, index) => (
            <div key={dish._id} className="flex items-center space-x-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
              <img 
                src={dish.image || '/placeholder.jpg'} 
                alt={dish.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{dish.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    🔥 {index + 1}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{dish.category}</span>
                  <span className="font-medium text-green-600">{dish.price.toLocaleString()} {dish.currency}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{dish.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{dish.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}