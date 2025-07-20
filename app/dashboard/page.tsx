'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Eye,
  QrCode,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { RecentViews } from '@/components/dashboard/recent-views';
import { PopularDishes } from '@/components/dashboard/popular-dishes';
import { getStatsByUserId } from '@/sanity/lib/stats/getStats';
import { client as sanityClient } from '@/sanity/lib/client';

const iconMap: Record<string, any> = {
  'Vues totales': Eye,
  'Visiteurs uniques': Users,
  'Plats populaires': TrendingUp,
  'Scans QR': QrCode,
};

const colorMap: Record<string, string> = {
  'Vues totales': 'text-blue-600',
  'Visiteurs uniques': 'text-green-600',
  'Plats populaires': 'text-orange-600',
  'Scans QR': 'text-purple-600',
};

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<any[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Récupérer l’ID du restaurant associé à l'utilisateur
  useEffect(() => {
    const fetchRestaurantId = async () => {
      if (user) {
        const query = `*[_type == "restaurant" && userId == $userId][0]{ _id }`;
        const result = await sanityClient.fetch(query, { userId: user.id });
        setRestaurantId(result?._id || null);
      }
    };
    fetchRestaurantId();
  }, [user]);

  // Récupérer les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        const data = await getStatsByUserId(user.id);
        const formatted = data.map((stat: any) => ({
          ...stat,
          icon: iconMap[stat.name] || AlertCircle,
          color: colorMap[stat.name] || 'text-gray-600',
        }));
        setStats(formatted);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
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

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucune statistique disponible
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Les données s'afficheront après les premières interactions avec votre menu
            </p>
          </div>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
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
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} depuis le mois dernier
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatsChart restaurantId={restaurantId} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecentViews restaurantId={restaurantId} />
        </motion.div>
      </div>

      {/* Plats populaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PopularDishes restaurantId={restaurantId} />
      </motion.div>
    </div>
  );
}
