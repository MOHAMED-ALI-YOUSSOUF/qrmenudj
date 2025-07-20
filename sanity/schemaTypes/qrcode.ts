import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'qrCodeSettings',
  title: 'Paramètres QR Code',
  type: 'document',
  fields: [
    defineField({
      name: 'restaurant',
      title: 'Restaurant',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      validation: Rule => Rule.required().error('Le restaurant est requis'),
    }),
    defineField({
      name: 'url',
      title: 'URL du menu',
      type: 'string',
      validation: Rule => Rule.required().error('L\'URL est requise'),
    }),
    defineField({
      name: 'size',
      title: 'Taille',
      type: 'number',
      initialValue: 256,
      validation: Rule => Rule.min(128).max(512).error('La taille doit être entre 128 et 512 pixels'),
    }),
    defineField({
      name: 'logoSize',
      title: 'Taille du logo',
      type: 'number',
      initialValue: 50,
      validation: Rule => Rule.min(20).max(100).error('La taille du logo doit être entre 20 et 100 pixels'),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Couleur de fond',
      type: 'string',
      initialValue: '#ffffff',
    }),
    defineField({
      name: 'foregroundColor',
      title: 'Couleur du code',
      type: 'string',
      initialValue: '#000000',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});