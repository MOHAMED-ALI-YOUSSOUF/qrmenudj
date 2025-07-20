import { NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { getAuth } from '@clerk/nextjs/server';
import { urlFor } from '@/sanity/lib/image';

export async function POST(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, price, currency, category, status, image, isPopular, isSpicy } = await request.json();

  if (!name || !price || !currency || !category || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Fetch restaurantId for the user
    const restaurantQuery = `*[_type == "restaurant" && userId == $userId][0] { _id }`;
    const restaurant = await sanityClient.fetch(restaurantQuery, { userId });
    if (!restaurant?._id) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    let imageAsset = null;
    if (image && image.startsWith('blob:')) {
      const response = await fetch(image);
      const buffer = await response.arrayBuffer();
      imageAsset = await sanityClient.assets.upload('image', Buffer.from(buffer));
    }

    const newDish = {
      _type: 'dish',
      name,
      description,
      price: Number(price),
      currency,
      category,
      status,
      views: 0,
      rating: 0,
      isPopular: isPopular || false,
      isSpicy: isSpicy || false,
      restaurant: { _type: 'reference', _ref: restaurant._id },
      lastUpdated: new Date().toISOString(),
      ...(imageAsset && {
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAsset._id },
        },
      }),
    };

    const result = await sanityClient.create(newDish);
    return NextResponse.json({
      ...result,
      id: result._id,
      image: result.image ? urlFor(result.image).url() : null,
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json({ error: 'Failed to create dish' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, description, price, currency, category, status, image, isPopular, isSpicy } = await request.json();

  if (!id || !name || !price || !currency || !category || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    let updateData: any = {
      name,
      description,
      price: Number(price),
      currency,
      category,
      status,
      isPopular: isPopular || false,
      isSpicy: isSpicy || false,
      lastUpdated: new Date().toISOString(),
    };

    // Handle image: new upload, keep existing, or remove
    if (image === null) {
      // Remove existing image
      updateData.image = null;
    } else if (image && image.startsWith('blob:')) {
      // Upload new image
      const response = await fetch(image);
      const buffer = await response.arrayBuffer();
      const imageAsset = await sanityClient.assets.upload('image', Buffer.from(buffer));
      updateData.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAsset._id },
      };
    } // Else, keep existing image (no change)

    const result = await sanityClient.patch(id).set(updateData).commit();
    return NextResponse.json({
      ...result,
      id: result._id,
      image: result.image ? urlFor(result.image).url() : null,
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json({ error: 'Failed to update dish' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing dish ID' }, { status: 400 });
  }

  try {
    await sanityClient.delete(id);
    return NextResponse.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ error: 'Failed to delete dish' }, { status: 500 });
  }
}