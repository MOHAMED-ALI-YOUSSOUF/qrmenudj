'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UtensilsCrossed, FileText, DollarSign, Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { writeClient } from '@/sanity/lib/write-client';
import Image from 'next/image';

interface FormData {
  name: string;
  description: string;
  price: string;
  image: File | null;
}

export default function AddDishPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchRestaurant = async () => {
        try {
          const restaurant = await writeClient.fetch(
            `*[_type == "restaurant" && userId == $userId][0] {_id}`,
            { userId: user.id }
          );
          if (!restaurant) {
            setError('Veuillez d\'abord créer un restaurant.');
          } else {
            setRestaurantId(restaurant._id);
          }
        } catch (err) {
          setError('Erreur lors de la vérification du restaurant');
          console.error(err);
        }
      };
      fetchRestaurant();
    }
  }, [isLoaded, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Taille maximale : 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPG, PNG ou WebP');
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !restaurantId) {
      setError('Vous devez créer un restaurant avant d\'ajouter un plat.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Le nom du plat est requis');
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      setError('Le prix doit être un nombre valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageAsset = null;
      if (formData.image) {
        const buffer = await formData.image.arrayBuffer();
        const imageBuffer = Buffer.from(buffer);
        imageAsset = await writeClient.assets.upload('image', imageBuffer, {
          filename: formData.image.name,
        });
      }

      const dishData = {
        _type: 'dish',
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        restaurant: { _type: 'reference', _ref: restaurantId },
        createdAt: new Date().toISOString(),
        ...(imageAsset && {
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: imageAsset._id },
          },
        }),
      };

      await writeClient.create(dishData);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/menus'), 2000);
    } catch (err) {
      setError('Erreur lors de l\'ajout du plat');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !restaurantId && !error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="mt-2 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error && error.includes('créer un restaurant')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                onClick={() => router.push('/dashboard/restaurants/create')}
              >
                Créer un restaurant
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Plat ajouté avec succès !</h2>
          <p className="text-gray-600 mb-4">Redirection vers les menus...</p>
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/menus')}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <UtensilsCrossed className="w-4 h-4" />
          Retour aux menus
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Ajouter un plat</h1>
        <p className="text-gray-600 mt-2">Ajoutez un nouveau plat à votre menu.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UtensilsCrossed className="w-5 h-5" />
              Nouveau plat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800 font-medium">Erreur</AlertTitle>
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom du plat *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Samboussa"
                      className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 w-5 h-5 text-blue-500" />
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Décrivez le plat, ses ingrédients, etc."
                      rows={4}
                      className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Prix (DJF) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Ex: 500"
                      className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Image du plat
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <Image
                          src={imagePreview}
                          alt="Aperçu"
                          width={160}
                          height={160}
                          className="mx-auto rounded-lg shadow-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeImage}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Supprimer l'image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="text-gray-600">Cliquez pour sélectionner une image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, JPEG jusqu'à 5MB</p>
                      </div>
                    )}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                    {!imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image')?.click()}
                        className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Sélectionner une image
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/menus')}
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Ajout...
                    </>
                  ) : (
                    <>
                      <UtensilsCrossed className="w-4 h-4 mr-2" />
                      Ajouter le plat
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}