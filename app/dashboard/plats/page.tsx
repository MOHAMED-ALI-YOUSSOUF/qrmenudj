'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { client as sanityClient } from '@/sanity/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit3, Trash2, Search, Filter, UtensilsCrossed, Eye, DollarSign, Star, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getDishes, Dish } from '@/sanity/lib/dish/getDishes';

interface DishData {
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: string;
  image?: File | string | null;
  isPopular: boolean;
  isSpicy: boolean;
}

export default function PlatsPage() {
  const { user } = useUser();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [newDishData, setNewDishData] = useState<DishData>({
    name: '',
    description: '',
    price: 0,
    currency: 'DJF',
    category: 'Plats principaux',
    status: 'draft',
    image: null,
    isPopular: false,
    isSpicy: false,
  });

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

  // Fetch dishes
  useEffect(() => {
    const fetchDishes = async () => {
      if (restaurantId) {
        try {
          const dishes = await getDishes(restaurantId);
          setDishes(dishes);
        } catch (error) {
          toast.error('Erreur lors du chargement des plats');
        }
      }
    };
    fetchDishes();
  }, [restaurantId]);

  const categories = [
    { id: 'all', name: 'Tous les plats' },
    { id: 'Entrées', name: 'Entrées' },
    { id: 'Plats principaux', name: 'Plats principaux' },
    { id: 'Desserts', name: 'Desserts' },
    { id: 'Boissons', name: 'Boissons' },
  ];

  const resetForm = () => {
    setNewDishData({
      name: '',
      description: '',
      price: 0,
      currency: 'DJF',
      category: 'Plats principaux',
      status: 'draft',
      image: null,
      isPopular: false,
      isSpicy: false,
    });
  };

  const handleCreateDish = async () => {
    if (!newDishData.name.trim() || newDishData.price <= 0) {
      toast.error('Le nom et un prix positif sont obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', newDishData.name);
      formData.append('description', newDishData.description);
      formData.append('price', newDishData.price.toString());
      formData.append('currency', newDishData.currency);
      formData.append('category', newDishData.category);
      formData.append('status', newDishData.status);
      formData.append('isPopular', newDishData.isPopular.toString());
      formData.append('isSpicy', newDishData.isSpicy.toString());
      if (newDishData.image instanceof File) {
        const imageUrl = URL.createObjectURL(newDishData.image);
        formData.append('image', imageUrl);
      }

      const response = await fetch('/api/dish', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to create dish');
      }

      const newDish = await response.json();
      setDishes([...dishes, newDish]);
      toast.success('Plat créé avec succès');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating dish:', error);
      toast.error('Erreur lors de la création du plat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setNewDishData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      currency: dish.currency,
      category: dish.category,
      status: dish.status,
      image: dish.image, // Keep existing image URL
      isPopular: dish.isPopular,
      isSpicy: dish.isSpicy,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateDish = async () => {
    if (!editingDish || !newDishData.name.trim() || newDishData.price <= 0) {
      toast.error('Le nom et un prix positif sont obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('id', editingDish.id);
      formData.append('name', newDishData.name);
      formData.append('description', newDishData.description);
      formData.append('price', newDishData.price.toString());
      formData.append('currency', newDishData.currency);
      formData.append('category', newDishData.category);
      formData.append('status', newDishData.status);
      formData.append('isPopular', newDishData.isPopular.toString());
      formData.append('isSpicy', newDishData.isSpicy.toString());
      if (newDishData.image instanceof File) {
        const imageUrl = URL.createObjectURL(newDishData.image);
        formData.append('image', imageUrl);
      } else if (newDishData.image === null) {
        formData.append('image', 'null'); // Explicitly send null to remove image
      } else {
        formData.append('image', newDishData.image || ''); // Keep existing image
      }

      const response = await fetch('/api/dish', {
        method: 'PATCH',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update dish');
      }

      const updatedDish = await response.json();
      setDishes(dishes.map(d => (d.id === updatedDish.id ? updatedDish : d)));
      toast.success('Plat mis à jour avec succès');
      setIsEditModalOpen(false);
      setEditingDish(null);
      resetForm();
    } catch (error) {
      console.error('Error updating dish:', error);
      toast.error('Erreur lors de la mise à jour du plat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      const response = await fetch('/api/dish', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete dish');
      }

      setDishes(dishes.filter(dish => dish.id !== id));
      toast.success('Plat supprimé avec succès');
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Erreur lors de la suppression du plat');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      const target = isEdit ? setNewDishData : setNewDishData;
      target(prev => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setNewDishData({ ...newDishData, image: null });
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalDishes = dishes.length;
  const activeDishes = dishes.filter(d => d.status === 'active').length;
  const totalViews = dishes.reduce((sum, dish) => sum + dish.views, 0);
  const avgRating = dishes.filter(d => d.rating > 0).reduce((sum, dish) => sum + dish.rating, 0) /
                    (dishes.filter(d => d.rating > 0).length || 1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'inactive': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mes Plats</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez tous vos plats et leurs informations</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link href="/restaurant/demo">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Voir mon menu
            </Button>
          </Link>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button disabled={!restaurantId}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau plat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau plat</DialogTitle>
                <DialogDescription>
                  Ajoutez les informations de votre nouveau plat.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du plat *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Tibs de Bœuf"
                    value={newDishData.name}
                    onChange={(e) => setNewDishData({ ...newDishData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre plat..."
                    rows={3}
                    value={newDishData.description}
                    onChange={(e) => setNewDishData({ ...newDishData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Ex: 800"
                    value={newDishData.price}
                    onChange={(e) => setNewDishData({ ...newDishData, price: Number(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Select
                      value={newDishData.currency}
                      onValueChange={(value) => setNewDishData({ ...newDishData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DJF">DJF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={newDishData.category}
                      onValueChange={(value) => setNewDishData({ ...newDishData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrées">Entrées</SelectItem>
                        <SelectItem value="Plats principaux">Plats principaux</SelectItem>
                        <SelectItem value="Desserts">Desserts</SelectItem>
                        <SelectItem value="Boissons">Boissons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={newDishData.status}
                    onValueChange={(value) => setNewDishData({ ...newDishData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image du plat (optionnel)</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById('image-create')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {newDishData.image instanceof File ? newDishData.image.name : 'Choisir une image'}
                    </Button>
                    {newDishData.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Input
                      id="image-create"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, false)}
                    />
                  </div>
                  {newDishData.image instanceof File && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(newDishData.image)}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id="isPopular"
                    checked={newDishData.isPopular}
                    onCheckedChange={(checked) => setNewDishData({ ...newDishData, isPopular: checked })}
                  />
                  <Label htmlFor="isPopular">Populaire</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id="isSpicy"
                    checked={newDishData.isSpicy}
                    onCheckedChange={(checked) => setNewDishData({ ...newDishData, isSpicy: checked })}
                  />
                  <Label htmlFor="isSpicy">Épicé</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateDish}
                  disabled={isLoading || !newDishData.name.trim() || newDishData.price <= 0}
                >
                  {isLoading ? 'Création...' : 'Créer le plat'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total plats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDishes}</p>
              </div>
              <UtensilsCrossed className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plats actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeDishes}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total vues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Note moyenne</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un plat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dish Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredDishes.map((dish, index) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={dish.image || '/placeholder.jpg'} 
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={getStatusColor(dish.status)}>{getStatusText(dish.status)}</Badge>
                </div>
                {dish.rating > 0 && (
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{dish.rating.toFixed(1)}</span>
                  </div>
                )}
                {(dish.isPopular || dish.isSpicy) && (
                  <div className="absolute bottom-3 left-3 flex space-x-2">
                    {dish.isPopular && <Badge variant="outline">Populaire</Badge>}
                    {dish.isSpicy && <Badge variant="outline" className="bg-red-100 text-red-800">Épicé</Badge>}
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1 text-gray-900 dark:text-gray-100">{dish.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{dish.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {dish.price.toLocaleString()} {dish.currency}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{dish.views} vues</div>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <Badge variant="outline" className="mr-2">{dish.category}</Badge>
                  <span>Mis à jour le {new Date(dish.lastUpdated).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditDish(dish)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteDish(dish.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results Card */}
      {filteredDishes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <UtensilsCrossed className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun plat trouvé</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Aucun plat ne correspond à vos critères de recherche</p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Dish Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ajouter un nouveau plat</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Enrichissez votre menu avec de nouveaux plats</p>
            <Button disabled={!restaurantId}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau plat
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dish Modal */}
      {editingDish && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier le plat</DialogTitle>
              <DialogDescription>
                Modifiez les informations de votre plat.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom du plat *</Label>
                <Input
                  id="edit-name"
                  placeholder="Ex: Tibs de Bœuf"
                  value={newDishData.name}
                  onChange={(e) => setNewDishData({ ...newDishData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Décrivez votre plat..."
                  rows={3}
                  value={newDishData.description}
                  onChange={(e) => setNewDishData({ ...newDishData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Prix *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="Ex: 800"
                  value={newDishData.price}
                  onChange={(e) => setNewDishData({ ...newDishData, price: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">Devise</Label>
                  <Select
                    value={newDishData.currency}
                    onValueChange={(value) => setNewDishData({ ...newDishData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DJF">DJF</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select
                    value={newDishData.category}
                    onValueChange={(value) => setNewDishData({ ...newDishData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entrées">Entrées</SelectItem>
                      <SelectItem value="Plats principaux">Plats principaux</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                      <SelectItem value="Boissons">Boissons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select
                  value={newDishData.status}
                  onValueChange={(value) => setNewDishData({ ...newDishData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image du plat (optionnel)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById('image-edit')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {newDishData.image instanceof File
                      ? newDishData.image.name
                      : newDishData.image
                      ? 'Image existante'
                      : 'Choisir une image'}
                  </Button>
                  {newDishData.image && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="image-edit"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, true)}
                  />
                </div>
                {(newDishData.image instanceof File || typeof newDishData.image === 'string') && (
                  <div className="mt-2">
                    <img
                      src={newDishData.image instanceof File ? URL.createObjectURL(newDishData.image) : newDishData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="edit-isPopular"
                  checked={newDishData.isPopular}
                  onCheckedChange={(checked) => setNewDishData({ ...newDishData, isPopular: checked })}
                />
                <Label htmlFor="edit-isPopular">Populaire</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="edit-isSpicy"
                  checked={newDishData.isSpicy}
                  onCheckedChange={(checked) => setNewDishData({ ...newDishData, isSpicy: checked })}
                />
                <Label htmlFor="edit-isSpicy">Épicé</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingDish(null);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdateDish}
                disabled={isLoading || !newDishData.name.trim() || newDishData.price <= 0}
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}