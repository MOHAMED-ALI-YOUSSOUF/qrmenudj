import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'stats',
  title: 'Statistiques',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID Utilisateur',
      type: 'string',
      validation: Rule => Rule.required().error('L\'ID utilisateur est requis'),
      description: 'Identifiant de l\'utilisateur associé aux statistiques',
   
    }),
    defineField({
      name: 'name',
      title: 'Nom de la statistique',
      type: 'string',
      validation: Rule =>
        Rule.required().error('Le nom de la statistique est requis'),
      description: 'Nom de la statistique (ex: Vues totales, Visiteurs uniques)',
    }),
    defineField({
      name: 'value',
      title: 'Valeur',
      type: 'string',
      validation: Rule =>
        Rule.required().error('La valeur est requise'),
      description: 'Valeur de la statistique (ex: 2,847)',
    }),
    defineField({
      name: 'change',
      title: 'Changement',
      type: 'string',
      description: 'Changement par rapport à la période précédente (ex: +12%)',
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
      description: 'Tendance de la statistique (hausse ou baisse)',
    }),
  ],
})
