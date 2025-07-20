import Link from 'next/link';
import { QrCode, Phone, Mail, MapPin, Facebook, Instagram, Whatsapp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <QrCode className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-extrabold">
                QRMenu<span className="text-blue-400">.dj</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              La plateforme leader à Djibouti pour créer des menus numériques QR code. Modernisez votre restaurant avec une solution simple et efficace.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://wa.me/25377123456" className="text-gray-400 hover:text-blue-400 transition-colors">
                {/* <Whatsapp className="h-5 w-5" /> */}
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Tarifs', href: '/tarifs' },
                { name: 'Contact', href: '/contact' },
                { name: 'Dashboard', href: '/dashboard' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+253 77 123 456</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contact@qrmenu.dj</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Djibouti, Djibouti</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 QRMenu.dj. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}