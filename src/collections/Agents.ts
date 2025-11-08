import { adminOnly } from '@/access/adminOnly'
import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
    slug: 'agents',
    access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: adminOnly,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'companyName',
        defaultColumns: ['companyName', 'verificationStatus', 'rating', 'totalBookings'],
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
        },
        {
            name: 'companyName',
            type: 'text',
            required: true,
        },
        {
            name: 'gstNumber',
            type: 'text',
        },
        {
            name: 'panCard',
            type: 'text',
        },
        {
            name: 'tradeLicense',
            type: 'text',
        },
        {
            name: 'documents',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'verificationStatus',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Verified', value: 'verified' },
                { label: 'Rejected', value: 'rejected' },
            ],
        },
        {
            name: 'specializations',
            type: 'select',
            hasMany: true,
            options: [
                { label: 'Flights', value: 'flight' },
                { label: 'Hotels', value: 'hotel' },
                { label: 'Bus', value: 'bus' },
                { label: 'Train', value: 'train' },
                { label: 'Tour Packages', value: 'tour-package' },
            ],
        },
        {
            name: 'rating',
            type: 'number',
            min: 0,
            max: 5,
            defaultValue: 0,
            admin: {
                description: 'Deprecated - use averageRating instead',
            },
        },
        {
            name: 'averageRating',
            type: 'number',
            min: 0,
            max: 5,
            defaultValue: 0,
            admin: {
                readOnly: true,
                description: 'Average rating from all approved reviews',
            },
        },
        {
            name: 'totalReviews',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
                description: 'Total number of approved reviews',
            },
        },
        {
            name: 'totalBookings',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            name: 'address',
            type: 'textarea',
        },
        // Earnings tracking
        {
            name: 'totalEarnings',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
                description: 'Total earnings from all bookings',
            },
        },
        {
            name: 'pendingPayout',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
                description: 'Earnings pending payout',
            },
        },
        {
            name: 'paidOut',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
                description: 'Total amount paid out',
            },
        },
        {
            name: 'commissionRate',
            type: 'number',
            defaultValue: 2,
            admin: {
                description: 'Commission rate percentage (default 2%)',
            },
        },
        // Bank details for payouts
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
    ],
}
