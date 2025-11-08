import { adminOnly } from '@/access/adminOnly'
import type { CollectionConfig } from 'payload'

export const Payouts: CollectionConfig = {
    slug: 'payouts',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: adminOnly,
        delete: adminOnly,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'payoutId',
        defaultColumns: ['payoutId', 'agent', 'amount', 'status', 'requestedDate'],
    },
    fields: [
        {
            name: 'payoutId',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'Auto-generated payout ID',
            },
        },
        {
            name: 'agent',
            type: 'relationship',
            relationTo: 'agents',
            required: true,
        },
        {
            name: 'amount',
            type: 'number',
            required: true,
            min: 0,
        },
        {
            name: 'bookings',
            type: 'relationship',
            relationTo: 'bookings',
            hasMany: true,
            admin: {
                description: 'Bookings included in this payout',
            },
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'requested',
            options: [
                { label: 'Requested', value: 'requested' },
                { label: 'Approved', value: 'approved' },
                { label: 'Processing', value: 'processing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Failed', value: 'failed' },
            ],
        },
        {
            name: 'requestedDate',
            type: 'date',
            required: true,
        },
        {
            name: 'approvedDate',
            type: 'date',
            admin: {
                condition: (data) => ['approved', 'processing', 'completed'].includes(data.status),
            },
        },
        {
            name: 'completedDate',
            type: 'date',
            admin: {
                condition: (data) => data.status === 'completed',
            },
        },
        {
            name: 'paymentMethod',
            type: 'select',
            options: [
                { label: 'Bank Transfer', value: 'bank-transfer' },
                { label: 'UPI', value: 'upi' },
                { label: 'Cheque', value: 'cheque' },
            ],
        },
        {
            name: 'transactionId',
            type: 'text',
            admin: {
                description: 'Bank transaction reference number',
            },
        },
        {
            name: 'bankDetails',
            type: 'group',
            fields: [
                { name: 'accountHolderName', type: 'text' },
                { name: 'accountNumber', type: 'text' },
                { name: 'bankName', type: 'text' },
                { name: 'ifscCode', type: 'text' },
                { name: 'upiId', type: 'text' },
            ],
        },
        {
            name: 'notes',
            type: 'textarea',
            admin: {
                description: 'Internal notes for payout processing',
            },
        },
        {
            name: 'rejectionReason',
            type: 'textarea',
            admin: {
                condition: (data) => data.status === 'rejected',
            },
        },
        {
            name: 'invoice',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Payout invoice/receipt',
            },
        },
    ],
}
