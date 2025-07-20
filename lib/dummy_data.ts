// Données statiques pour les fonctionnalités générales
export const features = [
  {
    id: '1',
    title: 'QR Code Instantané',
    description: 'Générez votre QR code en quelques clics et affichez-le immédiatement',
    icon: '📱',
  },
  {
    id: '2',
    title: 'Menu Digital',
    description: 'Créez des menus attrayants avec photos et descriptions détaillées',
    icon: '📋',
  },
  {
    id: '3',
    title: 'Statistiques Avancées',
    description: 'Suivez les consultations et identifiez vos plats les plus populaires',
    icon: '📊',
  },
  {
    id: '4',
    title: 'Design Responsive',
    description: 'Parfaitement optimisé pour tous les appareils mobiles',
    icon: '💻',
  },
  {
    id: '5',
    title: 'Mise à jour Instantanée',
    description: 'Modifiez vos prix et disponibilités en temps réel',
    icon: '⚡',
  },
  {
    id: '6',
    title: 'Sans Contact',
    description: 'Solution hygiénique et moderne pour vos clients',
    icon: '🛡️',
  },
];

export const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    currency: 'DJF',
    duration: '/mois',
    description: 'Parfait pour commencer',
    features: [
      '1 menu maximum',
      '5 plats maximum',
      'QR code basique',
      'Support par email',
    ],
    limitations: [
      'Pas de logo personnalisé',
      'Statistiques limitées',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Professionnel',
    price: 5000,
    currency: 'DJF',
    duration: '/mois',
    description: 'Pour les restaurants sérieux',
    features: [
      'Menus illimités',
      'Plats illimités',
      'QR code avec logo',
      'Statistiques avancées',
      'Support prioritaire',
      'Personnalisation complète',
    ],
    limitations: [],
    popular: true,
  },
];