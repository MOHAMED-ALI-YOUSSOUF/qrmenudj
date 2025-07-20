'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft,
  Save,
  Upload,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import Image from 'next/image';

interface FormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  menuUrl: string;
  image: File | null;
}

export default function CreateRestaurantPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    menuUrl: '',
    image: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Vous devez être connecté pour créer un restaurant');
      return;
    }

    if (!formData.name.trim()) {
      setError('Le nom du restaurant est requis');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('menuUrl', formData.menuUrl);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Sending request with userId:', user.id);

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du restaurant');
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      const errorMessage =
        error instanceof Error
          ? error.message.includes('Non autorisé')
            ? 'Votre session a expiré. Veuillez vous déconnecter et vous reconnecter ci-dessous.'
            : error.message
          : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
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
              <p className="text-gray-600">
                Vous devez être connecté pour créer un restaurant.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                onClick={() => router.push('/sign-in')}
              >
                Se connecter
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant créé avec succès !</h2>
          <p className="text-gray-600 mb-4">Redirection vers le dashboard...</p>
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Créer un restaurant</h1>
          <p className="text-gray-600 mt-2">Ajoutez les détails de votre restaurant pour commencer.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Nouveau restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800 font-medium">Erreur</AlertTitle>
                  <AlertDescription className="text-red-800">
                    {error}
                    {error.includes('session a expiré') && (
                      <div className="mt-2 flex gap-2">
                        <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                          <Button
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Se déconnecter
                          </Button>
                        </SignOutButton>
                        <Button
                          variant="outline"
                          onClick={() => router.push('/sign-in')}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          Se reconnecter
                        </Button>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nom du restaurant *
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: Chez Amina"
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
                        placeholder="Cuisine traditionnelle djiboutienne dans une ambiance chaleureuse..."
                        rows={4}
                        className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Adresse
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ex: Rue de la République, Djibouti"
                        className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Numéro de téléphone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ex: +253 XX XX XX XX"
                        className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menuUrl" className="text-sm font-medium text-gray-700">
                      URL du menu QR (optionnel)
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                      <Input
                        id="menuUrl"
                        name="menuUrl"
                        type="url"
                        value={formData.menuUrl}
                        onChange={handleInputChange}
                        placeholder="Ex: https://qrmenu.dj/chez-amina"
                        className="pl-10 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                      Image du restaurant
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
                        disabled={isLoading}
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
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Créer le restaurant
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}