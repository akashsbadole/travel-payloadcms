import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Quotes: CollectionConfig = {
    slug: 'quotes',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'id',
        defaultColumns: ['requirement', 'agent', 'status', 'total', 'createdAt'],
    },
    fields: [
        {
            name: 'requirement',
            type: 'relationship',
            relationTo: 'requirements',
            required: true,
        },
        {
            name: 'agent',
            type: 'relationship',
            relationTo: 'agents',
            required: true,
        },
        {
            name: 'pricing',
            type: 'group',
            fields: [
                { name: 'basePrice', type: 'number', required: true },
                { name: 'taxes', type: 'number', defaultValue: 0 },
                { name: 'total', type: 'number', required: true },
            ],
        },
        {
            name: 'inclusions',
            type: 'array',
            fields: [
                { name: 'item', type: 'text', required: true },
            ],
        },
        {
            name: 'exclusions',
            type: 'array',
            fields: [
                { name: 'item', type: 'text', required: true },
            ],
        },
        {
            name: 'validity',
            type: 'date',
            required: true,
        },
        {
            name: 'termsAndConditions',
            type: 'richText',
            editor: lexicalEditor(),
        },
        {
            name: 'documents',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Sent', value: 'sent' },
                { label: 'Viewed', value: 'viewed' },
                { label: 'Accepted', value: 'accepted' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Expired', value: 'expired' },
            ],
        },
        {
            name: 'detailedItinerary',
            type: 'richText',
            editor: lexicalEditor(),
        },
    ],
}
