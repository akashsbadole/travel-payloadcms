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
        },
        {
            name: 'totalBookings',
            type: 'number',
            defaultValue: 0,
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            name: 'address',
            type: 'textarea',
        },
    ],
}
