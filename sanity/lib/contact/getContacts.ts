import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Contact } from '../types';

export const getContactsByUserId = async (userId: string): Promise<Contact[]> => {
  const CONTACTS_QUERY = defineQuery(`
    *[_type == "contact" && userId == $userId] | order(createdAt desc) {
      _id,
      userId,
      name,
      email,
      phone,
      message,
      restaurant->{
        _id,
        name
      },
      createdAt,
      status
    }
  `);

  try {
    const contacts = await sanityFetch({ 
      query: CONTACTS_QUERY,
      params: { userId },
    });
    console.log('Fetched Contacts:', contacts.data);
    return contacts.data || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};