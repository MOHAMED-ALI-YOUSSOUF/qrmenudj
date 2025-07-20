import { defineQuery } from 'next-sanity';
import { client as sanityClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: string;
  image: string | null;
  views: number;
  rating: number;
  isPopular: boolean;
  isSpicy: boolean;
  lastUpdated: string;
}

export const getDishes = async (restaurantId: string): Promise<Dish[]> => {
  if (!restaurantId) {
    console.error('No restaurantId provided');
    return [];
  }

  const DISH_QUERY = defineQuery(`
    *[_type == "dish" && restaurant._ref == $restaurantId] | order(lastUpdated desc) {
      _id,
      name,
      description,
      price,
      currency,
      category,
      status,
      image,
      views,
      rating,
      isPopular,
      isSpicy,
      lastUpdated
    }
  `);

  try {
    const result = await sanityClient.fetch(DISH_QUERY, { restaurantId });
    return result.map((dish: any) => ({
      ...dish,
      id: dish._id,
      image: dish.image ? urlFor(dish.image).url() : null,
    })) || [];
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
};