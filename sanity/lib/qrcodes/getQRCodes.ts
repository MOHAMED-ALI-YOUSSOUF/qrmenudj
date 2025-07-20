import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { QRCode } from '../types';

export const getQRCodesByUserId = async (userId: string): Promise<QRCode[]> => {
  const QRCODES_QUERY = defineQuery(`
    *[_type == "qrCode" && userId == $userId] | order(_createdAt desc) {
      _id,
      userId,
      url,
      size,
      logoSize,
      backgroundColor,
      foregroundColor
    }
  `);

  try {
    const qrCodes = await sanityFetch({ 
      query: QRCODES_QUERY,
      params: { userId },
    });
    console.log('Fetched QRCodes:', qrCodes.data);
    return qrCodes.data || [];
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return [];
  }
};