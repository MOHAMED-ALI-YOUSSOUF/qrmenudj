'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { RecentViews } from '@/components/dashboard/recent-views';
import { PopularDishes } from '@/components/dashboard/popular-dishes';
import { TrendingUp, Users, Eye, QrCode, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStatsByUserId } from '@/sanity/lib/stats/getStats';
import { getRestaurantsByUserId } from '@/sanity/lib/restaurant/getRestaurants';
import { Stats, Restaurant } from '@/sanity/lib/types';

// Map of icons and colors for stats
const statIcons: { [key: string]: { icon: any; color: string } } = {
  'Vues totales': { icon: Eye, color: 'text-blue-600' },
  'Visiteurs uniques': { icon: Users, color: 'text-green-600' },
  'Plats populaires': { icon: TrendingUp, color: 'text-orange-600' },
  'Scans QR': { icon: QrCode, color: 'text-purple-600' },
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  console.log("User ID:", userId);
  const router = useRouter();
  const [stats, setStats] = useState<Stats[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Check for restaurants first
        const fetchedRestaurants = await getRestaurantsByUserId(userId);
        setRestaurants(fetchedRestaurants);

        if (fetchedRestaurants.length === 0) {
          setLoading(false);
          return; // Stop here if no restaurant exists
        }

        // Fetch stats only if a restaurant exists
        const fetchedStats = await getStatsByUserId(userId);
        setStats(fetchedStats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, userId]);

  if (!isLoaded) {
    return <div className="p-6 max-w-7xl mx-auto text-center">Chargement de l'authentification...</div>;
  }

  if (!userId) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-red-600">
        Veuillez vous connecter pour accéder au tableau de bord.
      </div>
    );
  }

  if (!loading && restaurants.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Bienvenue sur QRMenu.dj</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vous devez créer un restaurant avant de pouvoir utiliser le tableau de bord.
          </p>
          <Button onClick={() => router.push('/dashboard/restaurants/create')}>
            Créer un restaurant
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue sur votre tableau de bord QRMenu.dj
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 mt-4 sm:mt-0"
        >
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
            <AlertCircle className="w-4 h-4 mr-1" />
            Plan Gratuit
          </Badge>
          <Button>Passer au Pro</Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center">Chargement des statistiques...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : stats.length === 0 ? (
        <div className="text-center">Aucune statistique disponible</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const { icon: Icon, color } = statIcons[stat.name] || {
              icon: TrendingUp,
              color: 'text-gray-600',
            };
            return (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </CardTitle>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change || 'N/A'} depuis le mois dernier
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatsChart userId={userId} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecentViews userId={userId} />
        </motion.div>
      </div>

      {/* Popular Dishes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PopularDishes userId={userId} />
      </motion.div>
    </div>
  );
}