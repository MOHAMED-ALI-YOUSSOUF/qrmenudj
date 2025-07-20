'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { client as sanityClient } from '@/sanity/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Share2, Settings, Upload, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';


export default function QRCodePage() {
  const { user } = useUser();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [qrData, setQrData] = useState({
    id: null as string | null,
    url: '',
    size: 256,
    logoSize: 50,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    logo: null as File | string | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch restaurant ID and QR code settings
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const restaurantQuery = `*[_type == "restaurant" && userId == $userId][0] { _id, slug }`;
        const restaurant = await sanityClient.fetch(restaurantQuery, { userId: user.id });
        setRestaurantId(restaurant?._id || null);

        if (restaurant?._id) {
          try {
            const response = await fetch('/api/qrCodeSettings');
            const data = await response.json();
            if (response.ok) {
              setQrData({
                id: data.id || null,
                url: data.url || `https://qrmenu.dj/${restaurant.slug.current}`,
                size: data.size || 256,
                logoSize: data.logoSize || 50,
                backgroundColor: data.backgroundColor || '#ffffff',
                foregroundColor: data.foregroundColor || '#000000',
                logo: data.logo || null,
              });
            } else {
              setQrData(prev => ({
                ...prev,
                url: `https://qrmenu.dj/${restaurant.slug.current}`,
              }));
            }
          } catch (error) {
            console.error('Error fetching QR code settings:', error);
            toast.error('Erreur lors du chargement des paramètres QR');
          }
        }
      }
    };
    fetchData();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Lien copié dans le presse-papiers');
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    const url = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'qr-code-menu.png';
    link.href = url;
    link.click();
    toast.success('QR Code téléchargé');
  };

  const shareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon Menu QR',
        text: 'Découvrez notre menu via QR Code',
        url: qrData.url,
      });
    } else {
      copyToClipboard(qrData.url);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 2MB');
        return;
      }
      setQrData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleRemoveImage = () => {
    setQrData(prev => ({ ...prev, logo: null }));
  };

  const handleSave = async () => {
    if (!restaurantId) {
      toast.error('Restaurant non trouvé');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('url', qrData.url);
      formData.append('size', qrData.size.toString());
      formData.append('logoSize', qrData.logoSize.toString());
      formData.append('backgroundColor', qrData.backgroundColor);
      formData.append('foregroundColor', qrData.foregroundColor);
      if (qrData.logo instanceof File) {
        const imageUrl = URL.createObjectURL(qrData.logo);
        formData.append('logo', imageUrl);
      } else if (qrData.logo === null) {
        formData.append('logo', 'null');
      } else {
        formData.append('logo', qrData.logo || '');
      }

      const response = await fetch('/api/qrCodeSettings', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to save QR code settings');
      }

      const result = await response.json();
      setQrData(prev => ({ ...prev, id: result.id }));
      toast.success('Paramètres QR sauvegardés avec succès');
    } catch (error) {
      console.error('Error saving QR code settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres QR');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Générateur QR Code</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Créez et personnalisez votre QR Code pour votre menu
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <QRCodeCanvas
                  id="qr-code"
                  value={qrData.url}
                  size={qrData.size}
                  bgColor={qrData.backgroundColor}
                  fgColor={qrData.foregroundColor}
                  includeMargin={true}
                  imageSettings={
                    qrData.logo
                      ? {
                          src: qrData.logo instanceof File ? URL.createObjectURL(qrData.logo) : qrData.logo,
                          x: undefined,
                          y: undefined,
                          height: qrData.logoSize,
                          width: qrData.logoSize,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadQR} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(qrData.url)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copier le lien
                </Button>
                <Button
                  variant="outline"
                  onClick={shareQR}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL du menu</Label>
                <Input
                  id="url"
                  value={qrData.url}
                  onChange={(e) => setQrData({ ...qrData, url: e.target.value })}
                  placeholder="https://qrmenu.dj/votre-restaurant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo (optionnel)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById('logo')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {qrData.logo instanceof File
                      ? qrData.logo.name
                      : qrData.logo
                      ? 'Image existante'
                      : 'Choisir un logo'}
                  </Button>
                  {qrData.logo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                {(qrData.logo instanceof File || typeof qrData.logo === 'string') && (
                  <div className="mt-2">
                    <img
                      src={qrData.logo instanceof File ? URL.createObjectURL(qrData.logo) : qrData.logo}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain rounded"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Taille ({qrData.size}px)</Label>
                <Input
                  id="size"
                  type="range"
                  min="128"
                  max="512"
                  value={qrData.size}
                  onChange={(e) => setQrData({ ...qrData, size: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoSize">Taille du logo ({qrData.logoSize}px)</Label>
                <Input
                  id="logoSize"
                  type="range"
                  min="20"
                  max="100"
                  value={qrData.logoSize}
                  onChange={(e) => setQrData({ ...qrData, logoSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Couleur de fond</Label>
                  <Input
                    id="bg-color"
                    type="color"
                    value={qrData.backgroundColor}
                    onChange={(e) => setQrData({ ...qrData, backgroundColor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Couleur du code</Label>
                  <Input
                    id="fg-color"
                    type="color"
                    value={qrData.foregroundColor}
                    onChange={(e) => setQrData({ ...qrData, foregroundColor: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSave} disabled={isLoading || !restaurantId}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Conseils</h3>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Utilisez un contraste élevé pour une meilleure lisibilité</li>
                  <li>• Testez votre QR Code avant l'impression</li>
                  <li>• Taille recommandée : 256px minimum</li>
                  <li>• Ajoutez un logo centré pour une touche personnalisée</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Modèles prédéfinis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Classique', bg: '#ffffff', fg: '#000000' },
                { name: 'Bleu', bg: '#f0f9ff', fg: '#1e40af' },
                { name: 'Vert', bg: '#f0fdf4', fg: '#166534' },
              ].map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() =>
                    setQrData({
                      ...qrData,
                      backgroundColor: template.bg,
                      foregroundColor: template.fg,
                    })
                  }
                >
                  <div
                    className="w-16 h-16 rounded border-2 flex items-center justify-center text-xs"
                    style={{ backgroundColor: template.bg, color: template.fg, borderColor: template.fg }}
                  >
                    QR
                  </div>
                  <span className="text-sm">{template.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}