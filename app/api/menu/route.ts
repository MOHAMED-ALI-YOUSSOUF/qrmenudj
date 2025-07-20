import { NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, category, status, image } = await request.json();

  if (!name || !category || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Fetch restaurantId for the user
    const restaurantQuery = `*[_type == "restaurant" && userId == $userId][0] { _id }`;
    const restaurant = await sanityClient.fetch(restaurantQuery, { userId: session.user.id });
    if (!restaurant?._id) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    let imageAsset = null;
    if (image) {
      const response = await fetch(image);
      const buffer = await response.arrayBuffer();
      imageAsset = await sanityClient.assets.upload('image', Buffer.from(buffer));
    }

    const newMenu = {
      _type: 'menu',
      name,
      description,
      category,
      status,
      restaurant: { _type: 'reference', _ref: restaurant._id },
      dishes: [],
      lastUpdated: new Date().toISOString(),
      ...(imageAsset && {
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAsset._id },
        },
      }),
    };

    const result = await sanityClient.create(newMenu);
    return NextResponse.json({
      ...result,
      id: result._id,
      image: result.image ? urlFor(result.image).url() : null,
      dishes: result.dishes ? result.dishes.length : 0,
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, description, category, status, image } = await request.json();

  if (!id || !name || !category || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    let imageAsset = null;
    if (image) {
      const response = await fetch(image);
      const buffer = await response.arrayBuffer();
      imageAsset = await sanityClient.assets.upload('image', Buffer.from(buffer));
    }

    const updateData = {
      name,
      description,
      category,
      status,
      lastUpdated: new Date().toISOString(),
      ...(imageAsset && {
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAsset._id },
        },
      }),
    };

    const result = await sanityClient.patch(id).set(updateData).commit();
    return NextResponse.json({
      ...result,
      id: result._id,
      image: result.image ? urlFor(result.image).url() : null,
      dishes: result.dishes ? result.dishes.length : 0,
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing menu ID' }, { status: 400 });
  }

  try {
    await sanityClient.delete(id);
    return NextResponse.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 });
  }
}