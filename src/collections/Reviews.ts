import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
    slug: 'reviews',
    access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'id',
        defaultColumns: ['booking', 'user', 'agent', 'rating', 'verified', 'createdAt'],
    },
    fields: [
        {
            name: 'booking',
            type: 'relationship',
            relationTo: 'bookings',
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'agent',
            type: 'relationship',
            relationTo: 'agents',
            required: true,
        },
        {
            name: 'rating',
            type: 'number',
            required: true,
            min: 1,
            max: 5,
        },
        {
            name: 'review',
            type: 'textarea',
            required: true,
        },
        {
            name: 'photos',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'verified',
            type: 'checkbox',
            defaultValue: false,
        },
    ],
}
