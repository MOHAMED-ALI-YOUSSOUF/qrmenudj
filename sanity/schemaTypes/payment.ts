import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'payment',
  title: 'Paiement',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID Utilisateur',
      type: 'string',
      validation: Rule => Rule.required().error('L\'ID utilisateur est requis'),
      description: 'Identifiant de l\'utilisateur associé au paiement',
    }),
    defineField({
      name: 'name',
      title: 'Nom complet',
      type: 'string',
      validation: Rule => Rule.required().error('Le nom complet est requis'),
    }),
    defineField({
      name: 'phone',
      title: 'Numéro de téléphone',
      type: 'string',
      validation: Rule => Rule.required().error('Le numéro de téléphone est requis'),
      description: 'Format: +253 XX XX XX XX',
    }),
    defineField({
      name: 'transactionId',
      title: 'ID de transaction',
      type: 'string',
      validation: Rule => Rule.required().error("L'ID de transaction est requis"),
      description: 'Identifiant unique de la transaction',
    }),
    defineField({
      name: 'amount',
      title: 'Montant',
      type: 'string',
      validation: Rule => Rule.required().error('Le montant est requis'),
      description: 'Montant du paiement (ex: 15000 DJF)',
    }),
    defineField({
      name: 'receipt',
      title: 'Reçu',
      type: 'file',
      description: 'Reçu de paiement (image ou PDF, optionnel)',
      options: {
        accept: 'image/*,.pdf',
      },
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
    }),
  ],
})
