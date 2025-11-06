import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
    slug: 'messages',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Communication',
        useAsTitle: 'id',
        defaultColumns: ['sender', 'receiver', 'requirement', 'read', 'createdAt'],
    },
    fields: [
        {
            name: 'requirement',
            type: 'relationship',
            relationTo: 'requirements',
            required: true,
        },
        {
            name: 'sender',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'receiver',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'attachments',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'read',
            type: 'checkbox',
            defaultValue: false,
        },
    ],
}
