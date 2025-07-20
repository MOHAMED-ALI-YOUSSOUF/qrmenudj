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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MenuIcon, UtensilsCrossed, Clock, Plus, Eye, Edit3, Trash2, X, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getMenus, Menu } from '@/sanity/lib/Menu/getMenus';

interface MenuData {
  name: string;
  description: string;
  category: string;
  status: string;
  image?: File | string | null;
}

export default function MenusPage() {
  const { user } = useUser();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [newMenuData, setNewMenuData] = useState<MenuData>({
    name: '',
    description: '',
    category: 'Déjeuner',
    status: 'draft',
    image: null,
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

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      if (restaurantId) {
        try {
          const menus = await getMenus(restaurantId);
          setMenus(menus);
        } catch (error) {
          toast.error('Erreur lors du chargement des menus');
        }
      }
    };
    fetchMenus();
  }, [restaurantId]);

  const categories = ['Déjeuner', 'Dîner', 'Spécial', 'Boissons', 'Desserts'];

  const resetForm = () => {
    setNewMenuData({
      name: '',
      description: '',
      category: 'Déjeuner',
      status: 'draft',
      image: null,
    });
  };

  const handleCreateMenu = async () => {
    if (!newMenuData.name.trim()) {
      toast.error('Le nom du menu est obligatoire');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', newMenuData.name);
      formData.append('description', newMenuData.description);
      formData.append('category', newMenuData.category);
      formData.append('status', newMenuData.status);
      if (newMenuData.image instanceof File) {
        const imageUrl = URL.createObjectURL(newMenuData.image);
        formData.append('image', imageUrl);
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to create menu');
      }

      const newMenu = await response.json();
      setMenus([...menus, newMenu]);
      toast.success('Menu créé avec succès');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('Erreur lors de la création du menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setNewMenuData({
      name: menu.name,
      description: menu.description,
      category: menu.category,
      status: menu.status,
      image: menu.image,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu || !newMenuData.name.trim()) {
      toast.error('Le nom du menu est obligatoire');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('id', editingMenu.id);
      formData.append('name', newMenuData.name);
      formData.append('description', newMenuData.description);
      formData.append('category', newMenuData.category);
      formData.append('status', newMenuData.status);
      if (newMenuData.image instanceof File) {
        const imageUrl = URL.createObjectURL(newMenuData.image);
        formData.append('image', imageUrl);
      } else if (typeof newMenuData.image === 'string') {
        formData.append('image', newMenuData.image);
      }

      const response = await fetch('/api/menu', {
        method: 'PATCH',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update menu');
      }

      const updatedMenu = await response.json();
      setMenus(menus.map(m => (m.id === updatedMenu.id ? updatedMenu : m)));
      toast.success('Menu mis à jour avec succès');
      setIsEditModalOpen(false);
      setEditingMenu(null);
      resetForm();
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error('Erreur lors de la mise à jour du menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
      return;
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu');
      }

      setMenus(menus.filter(menu => menu.id !== id));
      toast.success('Menu supprimé avec succès');
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Erreur lors de la suppression du menu');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      const target = isEdit ? setEditingMenu : setNewMenuData;
      target(prev => ({ ...prev, image: file }));
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mes Menus</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez vos menus et organisez vos plats par catégories</p>
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau menu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau menu</DialogTitle>
                <DialogDescription>
                  Ajoutez les informations de votre nouveau menu. Vous pourrez ajouter des plats par la suite.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du menu *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Menu du jour, Carte des vins..."
                    value={newMenuData.name}
                    onChange={(e) => setNewMenuData({ ...newMenuData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre menu..."
                    rows={3}
                    value={newMenuData.description}
                    onChange={(e) => setNewMenuData({ ...newMenuData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={newMenuData.category}
                      onValueChange={(value) => setNewMenuData({ ...newMenuData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={newMenuData.status}
                      onValueChange={(value) => setNewMenuData({ ...newMenuData, status: value })}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image du menu (optionnel)</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById('image-create')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {newMenuData.image instanceof File ? newMenuData.image.name : 'Choisir une image'}
                    </Button>
                    {newMenuData.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewMenuData({ ...newMenuData, image: null })}
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
                  {newMenuData.image instanceof File && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(newMenuData.image)}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
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
                  onClick={handleCreateMenu}
                  disabled={isLoading || !newMenuData.name.trim()}
                >
                  {isLoading ? 'Création...' : 'Créer le menu'}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total menus</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{menus.length}</p>
              </div>
              <MenuIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Menus actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{menus.filter(m => m.status === 'active').length}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total plats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{menus.reduce((sum, menu) => sum + menu.dishes, 0)}</p>
              </div>
              <UtensilsCrossed className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{menus.filter(m => m.status === 'draft').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Menu Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {menus.map((menu, index) => (
          <motion.div
            key={menu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                {menu.image ? (
                  <img 
                    src={menu.image} 
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusColor(menu.status)}>{getStatusText(menu.status)}</Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{menu.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{menu.description}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{menu.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <UtensilsCrossed className="h-4 w-4 mr-1" />
                    {menu.dishes} plats
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(menu.lastUpdated).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditMenu(menu)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteMenu(menu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Menu Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Créer un nouveau menu</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Organisez vos plats en créant des menus thématiques</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau menu
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Menu Modal */}
      {editingMenu && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier le menu</DialogTitle>
              <DialogDescription>
                Modifiez les informations de votre menu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom du menu *</Label>
                <Input
                  id="edit-name"
                  placeholder="Ex: Menu du jour, Carte des vins..."
                  value={newMenuData.name}
                  onChange={(e) => setNewMenuData({ ...newMenuData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Décrivez votre menu..."
                  rows={3}
                  value={newMenuData.description}
                  onChange={(e) => setNewMenuData({ ...newMenuData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select
                    value={newMenuData.category}
                    onValueChange={(value) => setNewMenuData({ ...newMenuData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Statut</Label>
                  <Select
                    value={newMenuData.status}
                    onValueChange={(value) => setNewMenuData({ ...newMenuData, status: value })}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image du menu (optionnel)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById('image-edit')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {newMenuData.image instanceof File
                      ? newMenuData.image.name
                      : newMenuData.image
                      ? 'Image existante'
                      : 'Choisir une image'}
                  </Button>
                  {newMenuData.image && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMenuData({ ...newMenuData, image: null })}
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
                {(newMenuData.image instanceof File || typeof newMenuData.image === 'string') && (
                  <div className="mt-2">
                    <img
                      src={newMenuData.image instanceof File ? URL.createObjectURL(newMenuData.image) : newMenuData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMenu(null);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdateMenu}
                disabled={isLoading || !newMenuData.name.trim()}
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