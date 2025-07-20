'use client'

import { ArrowRight, QrCode, Smartphone, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card'
import QRGenerator from '../shared/qr-generator'
import { SignUpButton } from '@clerk/nextjs'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'

export function Hero() {
  return (
   <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Transformez votre restaurant avec QRMenu.dj
        </h1>
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Créez des menus numériques élégants et interactifs avec QR code en quelques clics. Simplifiez la gestion et boostez l’expérience client.
        </p>
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4">🚀 Nouveau à Djibouti</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Digitalisez vos{' '}
                <span className="text-blue-600">menus</span> avec des QR codes
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                La solution complète pour créer des menus numériques professionnels. 
                Vos clients scannent, consultent et commandent en toute simplicité.
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-lg px-8">
                    Créer mon menu gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpButton>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Voir une démo
                </Button>
              </div> */}
            </motion.div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: QrCode, text: 'QR Code Instantané' },
            { icon: Smartphone, text: '100% Mobile' },
            { icon: TrendingUp, text: '+30% de ventes' },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 justify-center lg:justify-start">
              <item.icon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105">
              Essayer Gratuitement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/albahar">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800 transition-transform hover:scale-105"
            >
              Voir un exemple
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Aucune carte requise • Prêt en 5 minutes
        </p>
      </div>

      <div className="relative">
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Restaurant Al Bahar
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Scannez pour découvrir notre menu
            </p>
            <QRGenerator
              value="https://qrmenu.dj/albahar"
              size={220}
              className="mb-6"
              logoUrl="/logo-albahar.png"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              qrmenu.dj/albahar
            </p>
          </CardContent>
        </Card>

        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-30 animate-pulse delay-100"></div>
      </div>
    </div>
  </div>

  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 dark:bg-blue-700 rounded-full opacity-10"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 dark:bg-green-700 rounded-full opacity-10"></div>
  </div>
</section>

  )
}