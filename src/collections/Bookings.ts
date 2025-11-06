import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
    slug: 'bookings',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'bookingId',
        defaultColumns: ['bookingId', 'user', 'agent', 'bookingStatus', 'totalAmount', 'createdAt'],
    },
    fields: [
        {
            name: 'requirement',
            type: 'relationship',
            relationTo: 'requirements',
            required: true,
        },
        {
            name: 'quote',
            type: 'relationship',
            relationTo: 'quotes',
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
            name: 'bookingId',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'travelerDetails',
            type: 'array',
            fields: [
                { name: 'firstName', type: 'text', required: true },
                { name: 'lastName', type: 'text', required: true },
                { name: 'age', type: 'number', required: true },
                {
                    name: 'gender', type: 'select', options: [
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' },
                    ]
                },
                { name: 'passportNumber', type: 'text' },
                { name: 'email', type: 'email' },
                { name: 'phone', type: 'text' },
            ],
        },
        {
            name: 'paymentStatus',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Partial', value: 'partial' },
                { label: 'Paid', value: 'paid' },
                { label: 'Refunded', value: 'refunded' },
            ],
        },
        {
            name: 'bookingStatus',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            options: [
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Completed', value: 'completed' },
            ],
        },
        {
            name: 'totalAmount',
            type: 'number',
            required: true,
        },
        {
            name: 'paidAmount',
            type: 'number',
            defaultValue: 0,
        },
        {
            name: 'vouchers',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'bookingDate',
            type: 'date',
            required: true,
        },
        {
            name: 'travelDate',
            type: 'date',
            required: true,
        },
    ],
}
