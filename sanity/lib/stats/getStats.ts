import { defineQuery } from 'next-sanity';
import { urlFor } from '../image';
import { client } from '../client';

export interface Stats {
  _id: string;
  userId: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export const getStatsByUserId = async (userId: string): Promise<Stats[]> => {
  if (!userId) {
    console.error('No userId provided');
    return [];
  }

  const STATS_QUERY = defineQuery(`
    *[_type == "stats" && userId == $userId] | order(name asc) {
      _id,
      userId,
      name,
      value,
      change,
      trend
    }
  `);

  try {
    const stats = await client.fetch(STATS_QUERY, { userId });
    console.log('Fetched Stats:', stats);
    return stats || [];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
};

export interface PopularDish {
  _id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string | null;
  views: number;
  rating: number;
}

export const getPopularDishes = async (restaurantId: string): Promise<PopularDish[]> => {
  if (!restaurantId) {
    console.error('No restaurantId provided');
    return [];
  }

  const POPULAR_DISHES_QUERY = defineQuery(`
    *[_type == "dish" && restaurant._ref == $restaurantId] | order(views desc) [0...4] {
      _id,
      name,
      category,
      price,
      currency,
      image,
      views,
      rating
    }
  `);

  try {
    const dishes = await client.fetch(POPULAR_DISHES_QUERY, { restaurantId });
    return dishes.map(dish => ({
      ...dish,
      image: dish.image ? urlFor(dish.image).url() : null,
    })) || [];
  } catch (error) {
    console.error('Error fetching popular dishes:', error);
    return [];
  }
};

export interface RecentView {
  _id: string;
  dish: { name: string };
  restaurant: { name: string };
  views: number;
  time: string;
  trend: 'up' | 'down';
}

export const getRecentViews = async (restaurantId: string): Promise<RecentView[]> => {
  if (!restaurantId) {
    console.error('No restaurantId provided');
    return [];
  }

  const RECENT_VIEWS_QUERY = defineQuery(`
    *[_type == "view" && restaurant._ref == $restaurantId] | order(timestamp desc) [0...5] {
      _id,
      dish-> { name },
      restaurant-> { name },
      views,
      timestamp,
      trend
    }
  `);

  try {
    const views = await client.fetch(RECENT_VIEWS_QUERY, { restaurantId });
    return views.map(view => ({
      ...view,
      time: new Date(view.timestamp).toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })) || [];
  } catch (error) {
    console.error('Error fetching recent views:', error);
    return [];
  }
};

export interface ChartData {
  name: string;
  vues: number;
  scans: number;
}

export const getWeeklyStats = async (restaurantId: string): Promise<ChartData[]> => {
  if (!restaurantId) {
    console.error('No restaurantId provided');
    return [];
  }

  const WEEKLY_STATS_QUERY = defineQuery(`
    *[_type == "stats" && restaurant._ref == $restaurantId && defined(timestamp)] {
      name,
      value,
      timestamp
    } | order(timestamp asc)
  `);

  try {
    const stats = await client.fetch(WEEKLY_STATS_QUERY, { restaurantId });
    // Aggregate stats by day (simplified, assumes stats are daily)
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const result: ChartData[] = days.map((day, index) => {
      const dayStats = stats.filter(stat => {
        const statDate = new Date(stat.timestamp);
        return statDate.getDay() === (index + 1) % 7;
      });
      return {
        name: day,
        vues: dayStats.find(s => s.name === 'Vues totales')?.value || 0,
        scans: dayStats.find(s => s.name === 'Scans QR')?.value || 0,
      };
    });
    return result;
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    return [];
  }
};