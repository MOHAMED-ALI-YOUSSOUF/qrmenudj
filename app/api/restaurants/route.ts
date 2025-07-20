import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/write-client';


export async function POST(request: NextRequest) {
  try {
  
    
    // Méthode  pour récupérer l'auth
    const { userId } = getAuth(request);
    console.log('Auth userId:', userId);
    
    const formData = await request.formData();
    const userIdFromForm = formData.get('userId') as string;
    console.log('FormData userId:', userIdFromForm);
    
    // Utiliser l'userId de l'auth ou du formData
    const finalUserId = userId || userIdFromForm;
    
    if (!finalUserId) {
      console.log('No userId found anywhere');
      return NextResponse.json(
        { error: 'Non autorisé - utilisateur non connecté' },
        { status: 401 }
      );
    }

    console.log('Final userId:', finalUserId);

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const menuUrl = formData.get('menuUrl') as string;
    const image = formData.get('image') as File | null;

    console.log('Form data:', { name, description, address, phone, menuUrl, hasImage: !!image });

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom du restaurant est requis' },
        { status: 400 }
      );
    }

    // Vérifier si un restaurant avec ce nom existe déjà pour cet utilisateur
    const existingRestaurant = await client.fetch(
      `*[_type == "restaurant" && userId == $userId && name == $name][0]`,
      { userId: finalUserId, name: name.trim() }
    );

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'Un restaurant avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    // Créer le slug à partir du nom
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
      .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin

    // Vérifier que le slug est unique
    const existingSlug = await client.fetch(
      `*[_type == "restaurant" && slug.current == $slug][0]`,
      { slug }
    );

    let finalSlug = slug;
    let counter = 1;
    while (existingSlug) {
      finalSlug = `${slug}-${counter}`;
      const checkSlug = await client.fetch(
        `*[_type == "restaurant" && slug.current == $finalSlug][0]`,
        { finalSlug }
      );
      if (!checkSlug) break;
      counter++;
    }

    // Préparer les données du restaurant
    const restaurantData: any = {
      _type: 'restaurant',
      userId: finalUserId,
      name: name.trim(),
      slug: {
        _type: 'slug',
        current: finalSlug,
      },
      description: description?.trim() || '',
      address: address?.trim() || '',
      phone: phone?.trim() || '',
      menuUrl: menuUrl?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    // Gérer l'upload de l'image si présente
    if (image && image.size > 0) {
      try {
        // Vérifier le type de fichier
        if (!image.type.startsWith('image/')) {
          return NextResponse.json(
            { error: 'Le fichier doit être une image' },
            { status: 400 }
          );
        }

        // Vérifier la taille (max 5MB)
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'L\'image ne doit pas dépasser 5MB' },
            { status: 400 }
          );
        }

        // Convertir le fichier en buffer
        const buffer = await image.arrayBuffer();
        const imageBuffer = Buffer.from(buffer);

        // Upload vers Sanity
        const imageAsset = await writeClient.assets.upload('image', imageBuffer, {
          filename: image.name,
        });

        // Ajouter l'image aux données du restaurant
        restaurantData.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        };
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'upload de l\'image' },
          { status: 500 }
        );
      }
    }

    // Créer le restaurant dans Sanity
    console.log('Creating restaurant in Sanity...');
    const restaurant = await writeClient.create(restaurantData);
    console.log('Restaurant created:', restaurant);

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du restaurant' },
      { status: 500 }
    );
  }
}