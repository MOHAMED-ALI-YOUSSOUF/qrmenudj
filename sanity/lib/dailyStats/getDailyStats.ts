import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { DailyStats } from '../types';

export const getDailyStatsByUserId = async (userId: string): Promise<DailyStats[]> => {
  if (!userId) {
    console.error('No userId provided');
    return [];
  }

  const DAILY_STATS_QUERY = defineQuery(`
    *[_type == "dailyStats" && userId == $userId] | order(date desc) {
      _id,
      userId,
      name,
      vues,
      scans,
      date
    }
  `);

  try {
    const dailyStats = await sanityFetch({ 
      query: DAILY_STATS_QUERY,
      params: { userId },
    });
    console.log('Fetched Daily Stats:', dailyStats.data);
    return dailyStats.data || [];
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return [];
  }
};