"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { plans } from '@/lib/dummy_data';
import Link from 'next/link';

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choisissez votre plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Commencez gratuitement puis passez au plan Pro quand vous êtes prêt à développer votre activité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recommandé
                    </span>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400"> {plan.currency}{plan.duration}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                      
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={plan.id === 'free' ? '/dashboard' : '/dashboard/payer'}>
                      <Button
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                        size="lg"
                      >
                        {plan.id === 'free' ? 'Commencer Gratuitement' : 'Passer au Pro'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Questions fréquentes
            </h3>
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Puis-je changer de plan à tout moment ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Oui, vous pouvez passer du plan gratuit au plan Pro ou annuler votre abonnement à tout moment.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Comment puis-je payer ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nous acceptons les virements bancaires et les paiements mobiles (Orange Money, Salam Money).
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Y a-t-il une période d'essai ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Le plan gratuit vous permet de tester toutes les fonctionnalités de base sans limitation de temps.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}