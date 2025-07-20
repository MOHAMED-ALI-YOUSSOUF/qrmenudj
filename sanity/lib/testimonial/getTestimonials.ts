import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Testimonial } from '../types';

export const getTestimonialsByUserId = async (userId: string): Promise<Testimonial[]> => {
  const TESTIMONIALS_QUERY = defineQuery(`
    *[_type == "testimonial" && userId == $userId] | order(createdAt desc) {
      _id,
      userId,
      customerName,
      message,
      rating,
      restaurant->{
        _id,
        name
      },
      image,
      createdAt,
      published
    }
  `);

  try {
    const testimonials = await sanityFetch({ 
      query: TESTIMONIALS_QUERY,
      params: { userId },
    });
    console.log('Fetched Testimonials:', testimonials.data);
    return testimonials.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};