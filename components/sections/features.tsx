'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Smartphone, TrendingUp, Edit, Globe, BarChart } from 'lucide-react';

const features = [
  {
    id: 'qr-code',
    title: 'QR Code Instantané',
    description: 'Générez des QR codes personnalisés pour vos menus en un seul clic.',
    icon: <QrCode className="h-8 w-8 text-blue-600" />,
  },
  {
    id: 'mobile-friendly',
    title: '100% Mobile',
    description: 'Menus optimisés pour une expérience fluide sur tous les appareils.',
    icon: <Smartphone className="h-8 w-8 text-green-600" />,
  },
  {
    id: 'sales-boost',
    title: 'Boostez vos ventes',
    description: 'Augmentez vos revenus grâce à une présentation moderne et attrayante.',
    icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
  },
  {
    id: 'easy-edit',
    title: 'Gestion Facile',
    description: 'Modifiez vos menus en temps réel, sans compétences techniques.',
    icon: <Edit className="h-8 w-8 text-purple-600" />,
  },
  {
    id: 'multilingual',
    title: 'Multilingue',
    description: 'Proposez vos menus en plusieurs langues pour attirer plus de clients.',
    icon: <Globe className="h-8 w-8 text-indigo-600" />,
  },
  {
    id: 'analytics',
    title: 'Statistiques',
    description: 'Suivez les vues de votre menu et optimisez votre offre.',
    icon: <BarChart className="h-8 w-8 text-teal-600" />,
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Une solution complète pour votre restaurant
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tout ce dont vous avez besoin pour moderniser votre service et captiver vos clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}