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
        defaultColumns: ['booking', 'user', 'agent', 'rating', 'status', 'verified', 'createdAt'],
    },
    fields: [
        {
            name: 'booking',
            type: 'relationship',
            relationTo: 'bookings',
            required: true,
            unique: true,
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
            name: 'detailedRatings',
            type: 'group',
            fields: [
                { name: 'communication', type: 'number', min: 1, max: 5 },
                { name: 'valueForMoney', type: 'number', min: 1, max: 5 },
                { name: 'professionalism', type: 'number', min: 1, max: 5 },
                { name: 'responsiveness', type: 'number', min: 1, max: 5 },
            ],
        },
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'review',
            type: 'textarea',
            required: true,
        },
        {
            name: 'pros',
            type: 'array',
            fields: [
                { name: 'pro', type: 'text', required: true },
            ],
        },
        {
            name: 'cons',
            type: 'array',
            fields: [
                { name: 'con', type: 'text', required: true },
            ],
        },
        {
            name: 'photos',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'tripType',
            type: 'select',
            options: [
                { label: 'Solo', value: 'solo' },
                { label: 'Couple', value: 'couple' },
                { label: 'Family', value: 'family' },
                { label: 'Friends', value: 'friends' },
                { label: 'Business', value: 'business' },
            ],
        },
        {
            name: 'travelDate',
            type: 'date',
        },
        {
            name: 'verified',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Verified booking - user actually traveled',
            },
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
            ],
        },
        {
            name: 'moderationNotes',
            type: 'textarea',
            admin: {
                description: 'Internal notes for moderation',
            },
        },
        {
            name: 'helpful',
            type: 'number',
            defaultValue: 0,
            admin: {
                description: 'Number of users who found this review helpful',
            },
        },
        {
            name: 'agentResponse',
            type: 'group',
            fields: [
                { name: 'response', type: 'textarea' },
                { name: 'responseDate', type: 'date' },
            ],
        },
    ],
}
