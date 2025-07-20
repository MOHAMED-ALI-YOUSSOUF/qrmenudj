import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Demande de contact',
  type: 'document',
  fields: [
    defineField({
       name: 'userId',
      title: 'ID Utilisateur',
      type: 'string',
      validation: Rule => Rule.required().error('L\'ID utilisateur est requis'),
      description: 'Identifiant de l\'utilisateur ayant soumis la demande',

    }),
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: Rule => Rule.required().error('Le nom est requis'),
      description: 'Nom de la personne soumettant la demande',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule =>
        Rule.required().email().error('Un email valide est requis'),
      description: 'Adresse email pour la réponse',
    }),
    defineField({
      name: 'phone',
      title: 'Numéro de téléphone',
      type: 'string',
      description: 'Numéro de téléphone (optionnel, ex: +253 XX XX XX XX)',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required().error('Le message est requis'),
      description: 'Contenu de la demande ou question',
    }),
    defineField({
      name: 'restaurant',
      title: 'Restaurant associé',
      type: 'reference',
      to: [{ type: 'restaurant' }],
      description: 'Restaurant concerné par la demande (optionnel)',
    }),
    defineField({
      name: 'createdAt',
      title: 'Date de soumission',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
      },
      validation: Rule => Rule.required(),
      readOnly: true,
      description: 'Date de soumission de la demande',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Nouveau', value: 'new' },
          { title: 'En cours', value: 'in_progress' },
          { title: 'Résolu', value: 'resolved' },
        ],
      },
      initialValue: 'new',
      description: 'Statut de la demande',
    }),
  ],
})
