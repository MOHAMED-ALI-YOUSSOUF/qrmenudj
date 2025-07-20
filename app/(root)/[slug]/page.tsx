'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Star, UtensilsCrossed, DollarSign, Heart, Share2, ShoppingCart, Plus, Search, Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

// Dummy data for demo
const dummyRestaurant = {
  name: 'Le Gourmet Parisien',
  description: 'Découvrez une expérience culinaire française authentique au cœur de Paris, avec des plats raffinés et des ingrédients frais de saison.',
  address: '12 Rue de la Gastronomie, 75001 Paris, France',
  phone: '+33 1 23 45 67 89',
  hours: 'Lun-Dim: 12h00-15h00, 18h00-23h00',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-2c7b3b2f7b3f?q=80&w=2070&auto=format&fit=crop',
  logo: 'https://images.unsplash.com/photo-1517248135467-2c7b3b2f7b3f?q=80&w=200&auto=format&fit=crop',
  primaryColor: '#1e3a8a',
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
  fontFamily: 'Playfair Display, serif',
};

const dummyDishes = [
  // Appetizers
  {
    id: '1',
    name: 'Escargots de Bourgogne',
    description: 'Escargots cuits au beurre d’ail et persil.',
    price: 12.5,
    currency: 'EUR',
    category: 'Appetizers',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1598103442097-3b74381a7f77?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: false,
    views: 150,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Soupe à l’Oignon',
    description: 'Soupe gratinée avec croûtons et fromage.',
    price: 8.0,
    currency: 'EUR',
    category: 'Appetizers',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1543332164-6e278ee033c0?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: false,
    views: 120,
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Tartelette aux Champignons',
    description: 'Tartelette croustillante aux champignons sauvages.',
    price: 9.5,
    currency: 'EUR',
    category: 'Appetizers',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1608039750369-6f9b1d1283f8?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: true,
    isGlutenFree: false,
    views: 90,
    rating: 4.3,
  },
  {
    id: '4',
    name: 'Foie Gras Maison',
    description: 'Foie gras servi avec confiture de figues.',
    price: 14.0,
    currency: 'EUR',
    category: 'Appetizers',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1611599953565-7a34565b7b65?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 200,
    rating: 4.9,
  },
  // Fish
  {
    id: '5',
    name: 'Sole Meunière',
    description: 'Sole dorée au beurre citronné.',
    price: 22.0,
    currency: 'EUR',
    category: 'Fish',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1625944230940-17aa3e8b4f64?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 180,
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Bouillabaisse',
    description: 'Soupe de poisson provençale avec rouille.',
    price: 18.5,
    currency: 'EUR',
    category: 'Fish',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559622214-3e6e8e8f8c6f?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: true,
    isVegan: false,
    isGlutenFree: false,
    views: 110,
    rating: 4.4,
  },
  {
    id: '7',
    name: 'Saumon Grillé',
    description: 'Filet de saumon avec sauce à l’aneth.',
    price: 20.0,
    currency: 'EUR',
    category: 'Fish',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 130,
    rating: 4.6,
  },
  {
    id: '8',
    name: 'Ceviche de Cabillaud',
    description: 'Cabillaud mariné au citron vert et coriandre.',
    price: 16.0,
    currency: 'EUR',
    category: 'Fish',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559741001-3e7c2d4d7f3b?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: true,
    isVegan: false,
    isGlutenFree: true,
    views: 95,
    rating: 4.2,
  },
  // Meat
  {
    id: '9',
    name: 'Boeuf Bourguignon',
    description: 'Ragoût de bœuf au vin rouge et légumes.',
    price: 24.0,
    currency: 'EUR',
    category: 'Meat',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1602470520998-f9f4086b0f97?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: false,
    views: 220,
    rating: 4.8,
  },
  {
    id: '10',
    name: 'Confit de Canard',
    description: 'Cuisse de canard confite avec pommes de terre.',
    price: 21.0,
    currency: 'EUR',
    category: 'Meat',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612966066788-5b6b7f4f7b3f?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 140,
    rating: 4.5,
  },
  {
    id: '11',
    name: 'Filet Mignon',
    description: 'Filet de porc avec sauce moutarde.',
    price: 23.0,
    currency: 'EUR',
    category: 'Meat',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606851141951-777a6a84f843?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 160,
    rating: 4.6,
  },
  {
    id: '12',
    name: 'Côte de Bœuf',
    description: 'Côte de bœuf grillée pour deux personnes.',
    price: 45.0,
    currency: 'EUR',
    category: 'Meat',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 250,
    rating: 4.9,
  },
  // Chicken
  {
    id: '13',
    name: 'Coq au Vin',
    description: 'Poulet braisé au vin rouge et champignons.',
    price: 19.0,
    currency: 'EUR',
    category: 'Chicken',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1598511726611-6f57d7b6f5b8?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: false,
    views: 170,
    rating: 4.7,
  },
  {
    id: '14',
    name: 'Poulet Rôti',
    description: 'Poulet rôti aux herbes de Provence.',
    price: 16.5,
    currency: 'EUR',
    category: 'Chicken',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 100,
    rating: 4.4,
  },
  {
    id: '15',
    name: 'Poulet Tikka Masala',
    description: 'Poulet épicé à l’indienne avec sauce crémeuse.',
    price: 17.0,
    currency: 'EUR',
    category: 'Chicken',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb32?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: true,
    isVegan: false,
    isGlutenFree: false,
    views: 115,
    rating: 4.3,
  },
  {
    id: '16',
    name: 'Ailes de Poulet',
    description: 'Ailes grillées avec sauce piquante.',
    price: 12.0,
    currency: 'EUR',
    category: 'Chicken',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd97401f1ad?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: true,
    isVegan: false,
    isGlutenFree: false,
    views: 80,
    rating: 4.1,
  },
  // Drinks
  {
    id: '17',
    name: 'Vin Rouge Bordeaux',
    description: 'Verre de vin rouge AOC Bordeaux.',
    price: 7.5,
    currency: 'EUR',
    category: 'Drinks',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1598300048796-8c0877f1f4c4?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: true,
    isGlutenFree: true,
    views: 200,
    rating: 4.6,
  },
  {
    id: '18',
    name: 'Mojito',
    description: 'Cocktail rafraîchissant à la menthe et citron vert.',
    price: 8.0,
    currency: 'EUR',
    category: 'Drinks',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1544140708-514b9c5e11b7?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: true,
    isGlutenFree: true,
    views: 130,
    rating: 4.5,
  },
  {
    id: '19',
    name: 'Jus d’Orange Pressé',
    description: 'Jus d’orange frais pressé.',
    price: 5.0,
    currency: 'EUR',
    category: 'Drinks',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd3dadd1?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: true,
    isGlutenFree: true,
    views: 90,
    rating: 4.3,
  },
  {
    id: '20',
    name: 'Eau Pétillante',
    description: 'Eau minérale pétillante San Pellegrino.',
    price: 4.0,
    currency: 'EUR',
    category: 'Drinks',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1596045138405-4f7f7e7f7b3f?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: true,
    isGlutenFree: true,
    views: 70,
    rating: 4.0,
  },
  // Desserts
  {
    id: '21',
    name: 'Crème Brûlée',
    description: 'Crème vanillée avec croûte caramélisée.',
    price: 8.5,
    currency: 'EUR',
    category: 'Desserts',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559622214-3e6b8e8f8c6f?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 190,
    rating: 4.8,
  },
  {
    id: '22',
    name: 'Tarte Tatin',
    description: 'Tarte aux pommes renversée avec caramel.',
    price: 7.5,
    currency: 'EUR',
    category: 'Desserts',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1615484477201-7f11e75a6bf8?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: false,
    views: 110,
    rating: 4.4,
  },
  {
    id: '23',
    name: 'Mousse au Chocolat',
    description: 'Mousse légère au chocolat noir.',
    price: 7.0,
    currency: 'EUR',
    category: 'Desserts',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d2f2e?q=80&w=2070&auto=format&fit=crop',
    isPopular: false,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 120,
    rating: 4.5,
  },
  {
    id: '24',
    name: 'Macarons Assortis',
    description: 'Sélection de macarons aux saveurs variées.',
    price: 9.0,
    currency: 'EUR',
    category: 'Desserts',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542843137-8791a6904d14?q=80&w=2070&auto=format&fit=crop',
    isPopular: true,
    isSpicy: false,
    isVegan: false,
    isGlutenFree: true,
    views: 160,
    rating: 4.7,
  },
];

interface Restaurant {
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  coverImage: string | null;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: string;
  image: string | null;
  isPopular: boolean;
  isSpicy: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  views: number;
  rating: number;
}

export default function RestaurantPage() {
  const { slug } = useParams();
  const { user } = useUser();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      if (typeof slug !== 'string') return;

      setIsLoading(true);
      try {
        // Simulate Sanity fetch for restaurant (using dummy data)
        setRestaurant(dummyRestaurant);

        // Simulate Sanity fetch for dishes (using dummy data)
        setDishes(dummyDishes);

        // Simulate view increment
        dummyDishes.forEach((dish) => {
          console.log(`Incrementing views for dish ${dish.id}`);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Helper functions
  const toggleFavorite = async (dishId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }
    const newFavorites = favorites.includes(dishId)
      ? favorites.filter((id) => id !== dishId)
      : [...favorites, dishId];
    setFavorites(newFavorites);
    toast.success(favorites.includes(dishId) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const addToCart = (dishId: string) => {
    setCart((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 1,
    }));
    toast.success('Ajouté au panier');
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[dishId] > 1) {
        newCart[dishId]--;
      } else {
        delete newCart[dishId];
      }
      return newCart;
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [dishId, count]) => {
      const dish = dishes.find((d) => d.id === dishId);
      return total + (dish ? dish.price * count : 0);
    }, 0);
  };

  const shareRestaurant = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.name,
          text: `Découvrez le menu de ${restaurant?.name}`,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  // Filter dishes
  const categories = ['all', 'Appetizers', 'Fish', 'Meat', 'Chicken', 'Drinks', 'Desserts'];
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-t-transparent rounded-full"
          style={{ borderColor: dummyRestaurant.primaryColor }}
        />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg border-gray-200 dark:border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-16 w-16 mb-6 text-gray-400 dark:text-gray-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Restaurant non trouvé</h3>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Le restaurant demandé n'existe pas ou n'est pas disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-gray-900" style={{ fontFamily: restaurant.fontFamily }}>
      {/* Hero Section */}
      <motion.div
        className="relative h-[600px] md:h-[700px] overflow-hidden"
        style={{
          backgroundImage: `url(${restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-2c7b3b2f7b3f?q=80&w=2070&auto=format&fit=crop'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto px-6"
          >
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              src={restaurant.logo || 'https://images.unsplash.com/photo-1517248135467-2c7b3b2f7b3f?q=80&w=200&auto=format&fit=crop'}
              alt={restaurant.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto mb-6 ring-4 ring-white/30 shadow-xl"
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {restaurant.name}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-3xl mx-auto">
              {restaurant.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {restaurant.address}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {restaurant.hours}
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                {restaurant.phone}
              </div>
            </div>
            <Button
              className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700"
              onClick={() => toast.info('Réservation non implémentée dans la démo')}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Réserver une table
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Promotional Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 text-center"
      >
        <p className="text-lg font-semibold">
          🎉 Offre spéciale : 20% de réduction sur les desserts ce week-end !
        </p>
      </motion.div>

      {/* Fixed Header with Search and Categories */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <img
                    src={`/category-${category.toLowerCase()}.png` || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=48&auto=format&fit=crop'}
                    alt={category}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=48&auto=format&fit=crop')}
                  />
                  {category === 'all' ? 'Tous' : category}
                </Button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={shareRestaurant} className="text-gray-700 dark:text-gray-300">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              {getTotalCartItems() > 0 && (
                <Button className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Panier ({getTotalCartItems()})
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {getTotalCartItems()}
                  </Badge>
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Category Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 py-6"
      >
        <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center space-x-3">
            <img
              src={`/category-${selectedCategory.toLowerCase()}.png` || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=48&auto=format&fit=crop'}
              alt={selectedCategory}
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=48&auto=format&fit=crop')}
            />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'Tous les plats' : selectedCategory}
            </h3>
          </div>
          <span className="text-xl font-semibold" style={{ color: restaurant.accentColor }}>
            {filteredDishes.length} plats
          </span>
        </div>
      </motion.div>

      {/* Dish Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <Card className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={dish.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop'}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3 space-y-2">
                      {dish.isPopular && (
                        <Badge style={{ backgroundColor: restaurant.accentColor }}>
                          ⭐ Populaire
                        </Badge>
                      )}
                      {dish.isSpicy && <Badge className="bg-red-500">🌶️ Épicé</Badge>}
                      {dish.isVegan && <Badge className="bg-green-500">🌱 Végan</Badge>}
                      {dish.isGlutenFree && <Badge className="bg-blue-500">🥐 Sans gluten</Badge>}
                      {dish.rating > 0 && (
                        <Badge className="bg-yellow-500 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          {dish.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleFavorite(dish.id)}
                        className="bg-white/30 hover:bg-white/40 text-white rounded-full"
                      >
                        <Heart
                          className={`w-5 h-5 ${favorites.includes(dish.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => addToCart(dish.id)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{dish.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{dish.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-lg font-bold" style={{ color: restaurant.primaryColor }}>
                        {dish.price.toLocaleString()} {dish.currency}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        👁 {dish.views}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        {filteredDishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <UtensilsCrossed className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aucun plat trouvé</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Essayez de modifier votre recherche' : 'Ce restaurant n\'a pas encore de plats dans son menu'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
        {getTotalCartItems() > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-bold">{getTotalCartItems()} article{getTotalCartItems() > 1 ? 's' : ''}</div>
                <div className="text-sm opacity-90">{getTotalPrice().toLocaleString()} {dishes[0]?.currency || 'EUR'}</div>
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                <Button variant="ghost" onClick={() => setShowMobileMenu(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={shareRestaurant}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info('Réservation non implémentée dans la démo')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Réserver
                </Button>
                {getTotalCartItems() > 0 && (
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Panier ({getTotalCartItems()})
                  </Button>
                )}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Catégories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowMobileMenu(false);
                        }}
                      >
                        {category === 'all' ? 'Tous' : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}