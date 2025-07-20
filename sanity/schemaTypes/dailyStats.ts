import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'dailyStats',
  title: 'Statistiques quotidiennes',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID Utilisateur',
      type: 'string',
      validation: Rule => Rule.required().error('L\'ID utilisateur est requis'),
      description: 'Identifiant de l\'utilisateur associé aux statistiques quotidiennes',
    }),
    defineField({
      name: 'name',
      title: 'Jour',
      type: 'string',
      validation: Rule =>
        Rule.required().error('Le jour est requis'),
      description: 'Nom du jour (ex: Lun, Mar)',
    }),
    defineField({
      name: 'vues',
      title: 'Vues',
      type: 'number',
      validation: Rule =>
        Rule.required()
          .min(0)
          .error('Le nombre de vues doit être positif'),
      description: 'Nombre de vues pour le jour',
    }),
    defineField({
      name: 'scans',
      title: 'Scans QR',
      type: 'number',
      validation: Rule =>
        Rule.required()
          .min(0)
          .error('Le nombre de scans doit être positif'),
      description: 'Nombre de scans QR pour le jour',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule =>
        Rule.required().error('La date est requise'),
      description: 'Date associée aux statistiques',
    }),
  ],
})
