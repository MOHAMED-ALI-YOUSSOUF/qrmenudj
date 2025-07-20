import { defineQuery } from 'next-sanity';
import { client as sanityClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export interface Menu {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  image: string | null;
  dishes: number;
  lastUpdated: string;
}

export const getMenus = async (restaurantId: string): Promise<Menu[]> => {
  if (!restaurantId) {
    console.error('No restaurantId provided');
    return [];
  }

  const MENU_QUERY = defineQuery(`
    *[_type == "menu" && restaurant._ref == $restaurantId] | order(lastUpdated desc) {
      _id,
      name,
      description,
      category,
      status,
      image,
      "dishes": count(dishes),
      lastUpdated
    }
  `);

  try {
    const result = await sanityClient.fetch(MENU_QUERY, { restaurantId });
    return result.map((menu: any) => ({
      ...menu,
      id: menu._id,
      image: menu.image ? urlFor(menu.image).url() : null,
    })) || [];
  } catch (error) {
    console.error('Error fetching menus:', error);
    return [];
  }
};