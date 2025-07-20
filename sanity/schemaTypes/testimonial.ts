import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID Utilisateur',
      type: 'string',
      validation: Rule => Rule.required().error('L\'ID utilisateur est requis'),
      description: 'Identifiant de l\'utilisateur ayant soumis le témoignage',
    }),
    defineField({
      name: 'customerName',
      title: 'Nom du client',
      type: 'string',
      validation: Rule => Rule.required().error('Le nom du client est requis'),
      description: 'Nom du client ayant laissé le témoignage',
    }),
    defineField({
      name: 'message',
      title: 'Témoignage',
      type: 'text',
      validation: Rule => Rule.required().error('Le témoignage est requis'),
      description: 'Contenu du témoignage',
    }),
    defineField({
      name: 'rating',
      title: 'Note',
      type: 'number',
      validation: Rule =>
        Rule.required()
          .min(1)
          .max(5)
          .error('La note doit être entre 1 et 5'),
      description: 'Note sur 5 (ex: 4.8)',
    }),
    defineField({
      name: 'restaurant',
      title: 'Restaurant associé',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      description: 'Restaurant concerné par le témoignage (optionnel)',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image du client ou du plat (optionnel)',
    }),
    defineField({
      name: 'createdAt',
      title: 'Date de création',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
      },
      validation: Rule => Rule.required(),
      readOnly: true,
      description: 'Date de soumission du témoignage',
    }),
    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      initialValue: false,
      description: 'Indique si le témoignage est visible publiquement',
    }),
  ],
})
