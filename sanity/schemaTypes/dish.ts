import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'dish',
  title: 'Plat',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du plat',
      type: 'string',
      validation: Rule => Rule.required().error('Le nom du plat est requis'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: Rule => Rule.required().min(0).error('Le prix doit être positif'),
    }),
    defineField({
      name: 'currency',
      title: 'Devise',
      type: 'string',
      options: {
        list: ['DJF', 'USD', 'EUR'],
      },
      validation: Rule => Rule.required().error('La devise est requise'),
      initialValue: 'DJF',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Entrées', value: 'Entrées' },
          { title: 'Plats principaux', value: 'Plats principaux' },
          { title: 'Desserts', value: 'Desserts' },
          { title: 'Boissons', value: 'Boissons' },
        ],
      },
      validation: Rule => Rule.required().error('La catégorie est requise'),
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Actif', value: 'active' },
          { title: 'Brouillon', value: 'draft' },
          { title: 'Inactif', value: 'inactive' },
        ],
      },
      validation: Rule => Rule.required().error('Le statut est requis'),
      initialValue: 'draft',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'views',
      title: 'Vues',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'rating',
      title: 'Note',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isPopular',
      title: 'Populaire',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isSpicy',
      title: 'Épicé',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'restaurant',
      title: 'Restaurant',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      validation: Rule => Rule.required().error('Le restaurant est requis'),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Dernière mise à jour',
      type: 'datetime',
      validation: Rule => Rule.required().error('La date de mise à jour est requise'),
    }),
  ],
});