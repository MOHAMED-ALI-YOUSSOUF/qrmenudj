'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <QrCode className="h-16 w-16 text-white mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Révolutionnez votre restaurant dès aujourd’hui
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les restaurants à Djibouti qui ont adopté QRMenu.dj pour un service moderne et efficace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                Commencer Gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-blue-500 hover:bg-white hover:text-blue-600">
                Nous Contacter
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            Configuration en 5 minutes • Support local à Djibouti • Sans engagement
          </p>
        </motion.div>
      </div>
    </section>
  );
}