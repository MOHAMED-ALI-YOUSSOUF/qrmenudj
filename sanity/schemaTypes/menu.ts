import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du menu',
      type: 'string',
      validation: Rule => Rule.required().error('Le nom du menu est requis'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Déjeuner', value: 'Déjeuner' },
          { title: 'Dîner', value: 'Dîner' },
          { title: 'Spécial', value: 'Spécial' },
          { title: 'Boissons', value: 'Boissons' },
          { title: 'Desserts', value: 'Desserts' },
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
      name: 'dishes',
      title: 'Plats',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'dish' }] }],
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