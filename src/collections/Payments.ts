import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
    slug: 'payments',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Finance',
        useAsTitle: 'transactionId',
        defaultColumns: ['booking', 'user', 'amount', 'paymentStatus', 'paymentDate'],
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
            name: 'amount',
            type: 'number',
            required: true,
        },
        {
            name: 'paymentMethod',
            type: 'select',
            required: true,
            options: [
                { label: 'Card', value: 'card' },
                { label: 'UPI', value: 'upi' },
                { label: 'Net Banking', value: 'netbanking' },
                { label: 'Wallet', value: 'wallet' },
                { label: 'PayPal', value: 'paypal' },
            ],
        },
        {
            name: 'paymentStatus',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Success', value: 'success' },
                { label: 'Failed', value: 'failed' },
                { label: 'Refunded', value: 'refunded' },
            ],
        },
        {
            name: 'transactionId',
            type: 'text',
            required: true,
        },
        {
            name: 'paymentGateway',
            type: 'text',
        },
        {
            name: 'paymentDate',
            type: 'date',
            required: true,
        },
    ],
}
