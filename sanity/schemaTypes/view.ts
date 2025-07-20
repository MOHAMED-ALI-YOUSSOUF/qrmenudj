import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'view',
  title: 'Vue',
  type: 'document',
  fields: [
    defineField({
      name: 'dish',
      title: 'Plat',
      type: 'reference',
      to: [{ type: 'dish' }],
      validation: Rule => Rule.required().error('Le plat est requis'),
    }),
    defineField({
      name: 'restaurant',
      title: 'Restaurant',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      validation: Rule => Rule.required().error('Le restaurant est requis'),
    }),
    defineField({
      name: 'views',
      title: 'Nombre de vues',
      type: 'number',
      initialValue: 1,
      validation: Rule => Rule.required().min(1).error('Le nombre de vues doit être positif'),
    }),
    defineField({
      name: 'timestamp',
      title: 'Horodatage',
      type: 'datetime',
      validation: Rule => Rule.required().error('L’horodatage est requis'),
    }),
    defineField({
      name: 'trend',
      title: 'Tendance',
      type: 'string',
      options: {
        list: [
          { title: 'Hausse', value: 'up' },
          { title: 'Baisse', value: 'down' },
        ],
      },
    }),
  ],
});