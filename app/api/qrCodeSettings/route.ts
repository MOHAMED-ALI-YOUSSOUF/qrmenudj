import { NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { getAuth } from '@clerk/nextjs/server';
import { urlFor } from '@/sanity/lib/image';

export async function POST(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, size, logoSize, backgroundColor, foregroundColor, logo } = await request.json();

  if (!url || !size || !backgroundColor || !foregroundColor) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const restaurantQuery = `*[_type == "restaurant" && userId == $userId][0] { _id }`;
    const restaurant = await sanityClient.fetch(restaurantQuery, { userId });
    if (!restaurant?._id) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    let logoAsset = null;
    if (logo && logo.startsWith('blob:')) {
      const response = await fetch(logo);
      const buffer = await response.arrayBuffer();
      logoAsset = await sanityClient.assets.upload('image', Buffer.from(buffer));
    }

    const qrCodeSettings = {
      _type: 'qrCodeSettings',
      restaurant: { _type: 'reference', _ref: restaurant._id },
      url,
      size: Number(size),
      logoSize: Number(logoSize),
      backgroundColor,
      foregroundColor,
      ...(logoAsset && {
        logo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: logoAsset._id },
        },
      }),
    };

    const result = await sanityClient.createOrReplace(qrCodeSettings);
    return NextResponse.json({
      ...result,
      id: result._id,
      logo: result.logo ? urlFor(result.logo).url() : null,
    });
  } catch (error) {
    console.error('Error saving QR code settings:', error);
    return NextResponse.json({ error: 'Failed to save QR code settings' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const restaurantQuery = `*[_type == "restaurant" && userId == $userId][0] { _id }`;
    const restaurant = await sanityClient.fetch(restaurantQuery, { userId });
    if (!restaurant?._id) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const query = `*[_type == "qrCodeSettings" && restaurant._ref == $restaurantId][0] {
      _id, url, size, logoSize, backgroundColor, foregroundColor, logo
    }`;
    const data = await sanityClient.fetch(query, { restaurantId: restaurant._id });

    return NextResponse.json({
      ...data,
      id: data?._id || null,
      logo: data?.logo ? urlFor(data.logo).url() : null,
    });
  } catch (error) {
    console.error('Error fetching QR code settings:', error);
    return NextResponse.json({ error: 'Failed to fetch QR code settings' }, { status: 500 });
  }
}