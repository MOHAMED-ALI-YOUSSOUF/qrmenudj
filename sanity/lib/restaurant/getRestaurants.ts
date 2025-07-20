import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Restaurant } from '../types';

export const getRestaurantsByUserId = async (userId: string): Promise<Restaurant[]> => {
  const RESTAURANTS_QUERY = defineQuery(`
    *[_type == "restaurant" && userId == $userId] | order(name asc) {
      _id,
      userId,
      name,
      slug,
      description,
      address,
      phone,
      image,
      menuUrl,
      dishes[]->{
        _id,
        name,
        price,
        category
      },
      createdAt
    }
  `);

  try {
    const restaurants = await sanityFetch({ 
      query: RESTAURANTS_QUERY,
      params: { userId },
    });
    console.log('Fetched Restaurants:', restaurants.data);
    return restaurants.data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};