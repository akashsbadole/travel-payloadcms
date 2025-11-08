import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const QuoteTemplates: CollectionConfig = {
    slug: 'quote-templates',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'name',
        defaultColumns: ['name', 'serviceType', 'agent', 'createdAt'],
    },
    fields: [
        {
            name: 'agent',
            type: 'relationship',
            relationTo: 'agents',
            required: true,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            admin: {
                description: 'Template name for easy identification',
            },
        },
        {
            name: 'serviceType',
            type: 'select',
            required: true,
            options: [
                { label: 'Flight', value: 'flight' },
                { label: 'Hotel', value: 'hotel' },
                { label: 'Bus', value: 'bus' },
                { label: 'Train', value: 'train' },
                { label: 'Tour Package', value: 'tour-package' },
            ],
        },
        {
            name: 'description',
            type: 'textarea',
            admin: {
                description: 'Brief description of this template',
            },
        },
        {
            name: 'basePrice',
            type: 'number',
        },
        {
            name: 'inclusions',
            type: 'array',
            fields: [
                { name: 'item', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
            ],
        },
        {
            name: 'exclusions',
            type: 'array',
            fields: [
                { name: 'item', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
            ],
        },
        {
            name: 'itineraryTemplate',
            type: 'richText',
            editor: lexicalEditor(),
            admin: {
                description: 'Standard itinerary template',
            },
        },
        {
            name: 'termsAndConditions',
            type: 'richText',
            editor: lexicalEditor(),
        },
        {
            name: 'cancellationPolicy',
            type: 'richText',
            editor: lexicalEditor(),
        },
        {
            name: 'highlights',
            type: 'array',
            fields: [
                { name: 'highlight', type: 'text', required: true },
            ],
        },
        {
            name: 'validityDays',
            type: 'number',
            defaultValue: 7,
            admin: {
                description: 'Default validity period in days',
            },
        },
        {
            name: 'advancePaymentPercentage',
            type: 'number',
            defaultValue: 25,
            admin: {
                description: 'Default advance payment percentage',
            },
        },
        {
            name: 'usageCount',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
                description: 'Number of times this template has been used',
            },
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
        },
    ],
}
