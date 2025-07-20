import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'analytics',
  title: 'Statistiques',
  type: 'document',
  fields: [
    defineField({
      name: 'restaurant',
      title: 'Restaurant',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'totalViews',
      title: 'Vues totales',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'qrScans',
      title: 'Scans de QR',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'ratings',
      title: 'Avis',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'rating',
              title: 'Note',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(5),
            }),
            defineField({
              name: 'date',
              title: 'Date',
              type: 'datetime',
            }),
          ],
        },
      ],
    }),
  ],
});