import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Quotes: CollectionConfig = {
    slug: 'quotes',
    hooks: {
        afterChange: [
            async ({ doc, req, operation }) => {
                // Send notification when quote is sent
                if (operation === 'create' || (operation === 'update' && doc.status === 'sent')) {
                    // Create notification for user
                    await req.payload.create({
                        collection: 'notifications',
                        data: {
                            user: doc.requirement.user,
                            title: 'New Quote Received',
                            message: `You received a new quote for your ${doc.requirement.serviceType} requirement`,
                            type: 'quote',
                            read: false,
                            link: `/dashboard/requirements/${doc.requirement}`,
                        },
                    })
                }
                return doc
            },
        ],
    },
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'id',
        defaultColumns: ['requirement', 'agent', 'status', 'totalPrice', 'createdAt'],
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
            name: 'quoteNumber',
            type: 'text',
            unique: true,
            admin: {
                description: 'Auto-generated quote number',
            },
        },
        {
            name: 'pricing',
            type: 'group',
            fields: [
                { name: 'basePrice', type: 'number', required: true },
                { name: 'taxes', type: 'number', defaultValue: 0 },
                { name: 'serviceFee', type: 'number', defaultValue: 0 },
                { name: 'discount', type: 'number', defaultValue: 0 },
                { name: 'totalPrice', type: 'number', required: true },
            ],
        },
        {
            name: 'priceBreakdown',
            type: 'array',
            fields: [
                { name: 'item', type: 'text', required: true },
                { name: 'amount', type: 'number', required: true },
                { name: 'description', type: 'textarea' },
            ],
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
            name: 'validity',
            type: 'group',
            fields: [
                { name: 'validFrom', type: 'date', required: true },
                { name: 'validUntil', type: 'date', required: true },
                { name: 'bookingDeadline', type: 'date' },
            ],
        },
        {
            name: 'cancellationPolicy',
            type: 'richText',
            editor: lexicalEditor(),
        },
        {
            name: 'termsAndConditions',
            type: 'richText',
            editor: lexicalEditor(),
        },
        {
            name: 'paymentTerms',
            type: 'group',
            fields: [
                {
                    name: 'advancePayment',
                    type: 'number',
                    admin: {
                        description: 'Advance payment percentage required',
                    },
                },
                {
                    name: 'paymentSchedule',
                    type: 'array',
                    fields: [
                        { name: 'milestone', type: 'text', required: true },
                        { name: 'percentage', type: 'number', required: true },
                        { name: 'dueDate', type: 'date' },
                    ],
                },
            ],
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
                { label: 'Withdrawn', value: 'withdrawn' },
            ],
        },
        {
            name: 'rejectionReason',
            type: 'textarea',
            admin: {
                condition: (data) => data.status === 'rejected',
            },
        },
        {
            name: 'detailedItinerary',
            type: 'richText',
            editor: lexicalEditor(),
            admin: {
                description: 'Day-by-day itinerary with activities, meals, and accommodations',
            },
        },
        {
            name: 'highlights',
            type: 'array',
            fields: [
                { name: 'highlight', type: 'text', required: true },
            ],
        },
        {
            name: 'specialOffers',
            type: 'textarea',
            admin: {
                description: 'Any special offers or discounts included',
            },
        },
        {
            name: 'viewCount',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'responseTime',
            type: 'number',
            admin: {
                description: 'Time taken to respond in hours',
                readOnly: true,
            },
        },
    ],
}
