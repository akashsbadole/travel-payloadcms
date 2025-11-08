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
                { label: 'Review', value: 'review' },
                { label: 'Payout', value: 'payout' },
                { label: 'System', value: 'system' },
            ],
        },
        {
            name: 'priority',
            type: 'select',
            defaultValue: 'normal',
            options: [
                { label: 'Low', value: 'low' },
                { label: 'Normal', value: 'normal' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
            ],
        },
        {
            name: 'read',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'readAt',
            type: 'date',
            admin: {
                condition: (data) => data.read === true,
            },
        },
        {
            name: 'link',
            type: 'text',
            admin: {
                description: 'URL to navigate when notification is clicked',
            },
        },
        {
            name: 'relatedId',
            type: 'text',
            admin: {
                description: 'ID of related entity (requirement, quote, booking, etc.)',
            },
        },
        {
            name: 'actionRequired',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Whether this notification requires user action',
            },
        },
        {
            name: 'expiresAt',
            type: 'date',
            admin: {
                description: 'When this notification expires (optional)',
            },
        },
    ],
}
