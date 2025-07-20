'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { client as sanityClient } from '@/sanity/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Upload, Eye, Save, Image as ImageIcon, Camera, Brush, Type, X } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PersonnalisationPage() {
  const { user } = useUser();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    hours: '',
    coverImage: null as string | null,
    logo: null as string | null,
    primaryColor: '#2563eb',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch restaurant ID
  useEffect(() => {
    const fetchRestaurantId = async () => {
      if (user) {
        const query = `*[_type == "restaurant" && userId == $userId][0] { _id }`;
        const data = await sanityClient.fetch(query, { userId: user.id });
        setRestaurantId(data?._id || null);
      }
    };
    fetchRestaurantId();
  }, [user]);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (restaurantId) {
        const query = `*[_type == "restaurant" && _id == $restaurantId][0] {
          name, description, address, phone, hours, coverImage, logo, primaryColor, secondaryColor, accentColor, fontFamily
        }`;
        try {
          const data = await sanityClient.fetch(query, { restaurantId });
          setRestaurantData({
            name: data.name || '',
            description: data.description || '',
            address: data.address || '',
            phone: data.phone || '',
            hours: data.hours || '',
            coverImage: data.coverImage ? urlFor(data.coverImage).url() : null,
            logo: data.logo ? urlFor(data.logo).url() : null,
            primaryColor: data.primaryColor || '#2563eb',
            secondaryColor: data.secondaryColor || '#10b981',
            accentColor: data.accentColor || '#f59e0b',
            fontFamily: data.fontFamily || 'Inter',
          });
        } catch (error) {
          console.error('Error fetching restaurant:', error);
          toast.error('Erreur lors du chargement des données du restaurant');
        }
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const colorPresets = [
    { name: "Bleu océan", primary: "#2563eb", secondary: "#10b981", accent: "#f59e0b" },
    { name: "Sunset", primary: "#dc2626", secondary: "#ea580c", accent: "#f59e0b" },
    { name: "Forêt", primary: "#059669", secondary: "#0d9488", accent: "#84cc16" },
    { name: "Violet", primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" },
    { name: "Élégant", primary: "#1f2937", secondary: "#6b7280", accent: "#d97706" },
    { name: "Djibouti", primary: "#1e40af", secondary: "#059669", accent: "#dc2626" }
  ];

  const fontOptions = [
    { name: "Inter", value: "Inter", preview: "AaBbCc" },
    { name: "Roboto", value: "Roboto", preview: "AaBbCc" },
    { name: "Open Sans", value: "Open Sans", preview: "AaBbCc" },
    { name: "Poppins", value: "Poppins", preview: "AaBbCc" },
    { name: "Montserrat", value: "Montserrat", preview: "AaBbCc" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setRestaurantData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setRestaurantData(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }));
  };

  const handleImageUpload = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('L\'image ne doit pas dépasser 5MB');
          return;
        }
        try {
          const asset = await sanityClient.assets.upload('image', file);
          setRestaurantData(prev => ({
            ...prev,
            [field]: urlFor(asset).url(),
          }));
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Erreur lors du téléchargement de l’image');
        }
      }
    };
    input.click();
  };

  const handleRemoveImage = (field: string) => {
    setRestaurantData(prev => ({ ...prev, [field]: null }));
  };

  const handleSave = async () => {
    if (!restaurantId) {
      toast.error('Restaurant non trouvé');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = {
        name: restaurantData.name,
        description: restaurantData.description,
        address: restaurantData.address,
        phone: restaurantData.phone,
        hours: restaurantData.hours,
        primaryColor: restaurantData.primaryColor,
        secondaryColor: restaurantData.secondaryColor,
        accentColor: restaurantData.accentColor,
        fontFamily: restaurantData.fontFamily,
      };

      // Handle image fields (set to null if removed)
      if (restaurantData.coverImage === null) {
        updateData.coverImage = null;
      }
      if (restaurantData.logo === null) {
        updateData.logo = null;
      }

      await sanityClient
        .patch(restaurantId)
        .set(updateData)
        .commit();
      toast.success('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Error saving restaurant data:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Personnalisation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Personnalisez l'apparence de votre menu et les informations de votre restaurant</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link href="/restaurant/demo">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={isLoading || !restaurantId}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Informations du restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du restaurant</Label>
                  <Input
                    id="name"
                    value={restaurantData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Le Palmier Doré"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={restaurantData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+253 21 35 40 50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={restaurantData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Décrivez votre restaurant..."
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={restaurantData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Avenue Maréchal Joffre, Djibouti"
                />
              </div>
              <div>
                <Label htmlFor="hours">Horaires d'ouverture</Label>
                <Input
                  id="hours"
                  value={restaurantData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  placeholder="Ouvert tous les jours de 11h à 22h"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Image de couverture</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recommandé : 1200x600 pixels</p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById('coverImage')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {restaurantData.coverImage ? 'Image existante' : 'Choisir une image'}
                  </Button>
                  {restaurantData.coverImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveImage('coverImage')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => handleImageUpload('coverImage')}
                  />
                </div>
                {restaurantData.coverImage && (
                  <div className="mt-2">
                    <img
                      src={restaurantData.coverImage}
                      alt="Cover preview"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>Logo du restaurant</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Recommandé : 200x200 pixels, format carré</p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById('logo')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {restaurantData.logo ? 'Image existante' : 'Choisir un logo'}
                  </Button>
                  {restaurantData.logo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveImage('logo')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => handleImageUpload('logo')}
                  />
                </div>
                {restaurantData.logo && (
                  <div className="mt-2">
                    <img
                      src={restaurantData.logo}
                      alt="Logo preview"
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Couleurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Palettes prédéfinies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center space-y-2"
                      onClick={() => handleColorPreset(preset)}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="primaryColor"
                      type="color"
                      value={restaurantData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-10 h-10 border rounded cursor-pointer"
                    />
                    <Input
                      value={restaurantData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="secondaryColor"
                      type="color"
                      value={restaurantData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 border rounded cursor-pointer"
                    />
                    <Input
                      value={restaurantData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Couleur d'accent</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="accentColor"
                      type="color"
                      value={restaurantData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-10 h-10 border rounded cursor-pointer"
                    />
                    <Input
                      value={restaurantData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Typographie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Police d'écriture</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {fontOptions.map((font, index) => (
                    <Button
                      key={index}
                      variant={restaurantData.fontFamily === font.value ? "default" : "outline"}
                      className="h-auto p-3 flex items-center justify-between"
                      onClick={() => handleInputChange('fontFamily', font.value)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{font.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{font.preview}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-32 overflow-hidden rounded-lg">
                  <img
                    src={restaurantData.coverImage || '/placeholder.jpg'}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={restaurantData.logo || '/placeholder-logo.png'}
                        alt="Logo preview"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-white">
                        <h3 className="font-bold text-sm">{restaurantData.name || 'Votre Restaurant'}</h3>
                        <p className="text-xs text-gray-200 truncate">{restaurantData.address || 'Adresse'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Palette de couleurs</h4>
                  <div className="flex space-x-2">
                    <div
                      className="flex-1 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: restaurantData.primaryColor }}
                    >
                      Principal
                    </div>
                    <div
                      className="flex-1 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: restaurantData.secondaryColor }}
                    >
                      Secondaire
                    </div>
                    <div
                      className="flex-1 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: restaurantData.accentColor }}
                    >
                      Accent
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Police</h4>
                  <div
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                    style={{ fontFamily: restaurantData.fontFamily }}
                  >
                    <p className="font-bold">Le Palmier Doré</p>
                    <p>Grilled Fish with Lemon</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1,800 DJF</p>
                  </div>
                </div>
                <Link href="/restaurant/demo">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir l'aperçu complet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}