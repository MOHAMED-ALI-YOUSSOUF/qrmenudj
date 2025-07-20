import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Payment } from '../types';

export const getPaymentsByUserId = async (userId: string): Promise<Payment[]> => {
  const PAYMENTS_QUERY = defineQuery(`
    *[_type == "payment" && userId == $userId] | order(createdAt desc) {
      _id,
      userId,
      name,
      phone,
      transactionId,
      amount,
      receipt,
      createdAt
    }
  `);

  try {
    const payments = await sanityFetch({ 
      query: PAYMENTS_QUERY,
      params: { userId },
    });
    console.log('Fetched Payments:', payments.data);
    return payments.data || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};