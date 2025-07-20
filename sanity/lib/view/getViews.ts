import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { View } from '../types';

export const getViewsByUserId = async (userId: string): Promise<View[]> => {
  if (!userId) {
    console.error('No userId provided');
    return [];
  }

  const VIEWS_QUERY = defineQuery(`
    *[_type == "view" && userId == $userId] | order(time desc) {
      _id,
      userId,
      dish->{
        _id,
        name
      },
      restaurant,
      views,
      time,
      trend
    }
  `);

  try {
    const views = await sanityFetch({ 
      query: VIEWS_QUERY,
      params: { userId },
    });
    console.log('Fetched Views:', views.data);
    return views.data || [];
  } catch (error) {
    console.error('Error fetching views:', error);
    return [];
  }
};