import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
    slug: 'notifications',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Communication',
        useAsTitle: 'title',
        defaultColumns: ['user', 'title', 'type', 'read', 'createdAt'],
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Requirement', value: 'requirement' },
                { label: 'Quote', value: 'quote' },
                { label: 'Booking', value: 'booking' },
                { label: 'Payment', value: 'payment' },
                { label: 'Message', value: 'message' },
            ],
        },
        {
            name: 'read',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'link',
            type: 'text',
        },
    ],
}
