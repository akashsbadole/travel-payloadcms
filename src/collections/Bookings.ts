import type { CollectionConfig } from 'payload'

// Commission rates
const AGENT_COMMISSION_RATE = 0.02 // 2%
const CUSTOMER_COMMISSION_RATE = 0.01 // 1%

export const Bookings: CollectionConfig = {
    slug: 'bookings',
    hooks: {
        beforeChange: [
            async ({ data }) => {
                // Calculate commissions when booking is created or amount changes
                if (data.totalAmount) {
                    const agentCommission = data.totalAmount * AGENT_COMMISSION_RATE
                    const customerCommission = data.totalAmount * CUSTOMER_COMMISSION_RATE

                    data.agentCommission = agentCommission
                    data.customerCommission = customerCommission
                    data.platformCommission = agentCommission + customerCommission
                    data.agentPayout = data.totalAmount - agentCommission
                }

                return data
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
        // Commission fields
        {
            name: 'agentCommission',
            type: 'number',
            admin: {
                readOnly: true,
                description: '2% commission deducted from agent',
            },
        },
        {
            name: 'customerCommission',
            type: 'number',
            admin: {
                readOnly: true,
                description: '1% commission charged to customer',
            },
        },
        {
            name: 'platformCommission',
            type: 'number',
            admin: {
                readOnly: true,
                description: 'Total platform commission (agent + customer)',
            },
        },
        {
            name: 'agentPayout',
            type: 'number',
            admin: {
                readOnly: true,
                description: 'Amount to be paid to agent after commission',
            },
        },
        {
            name: 'vouchers',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'tickets',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'invoice',
            type: 'upload',
            relationTo: 'media',
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
        {
            name: 'returnDate',
            type: 'date',
        },
        {
            name: 'specialRequests',
            type: 'textarea',
        },
        {
            name: 'emergencyContact',
            type: 'group',
            fields: [
                { name: 'name', type: 'text' },
                { name: 'phone', type: 'text' },
                { name: 'relationship', type: 'text' },
            ],
        },
        {
            name: 'modifications',
            type: 'array',
            fields: [
                { name: 'date', type: 'date', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'modifiedBy', type: 'text' },
                {
                    name: 'status', type: 'select', options: [
                        { label: 'Requested', value: 'requested' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Rejected', value: 'rejected' },
                    ]
                },
            ],
        },
        {
            name: 'cancellation',
            type: 'group',
            admin: {
                condition: (data) => data.bookingStatus === 'cancelled',
            },
            fields: [
                { name: 'cancelledDate', type: 'date' },
                {
                    name: 'cancelledBy', type: 'select', options: [
                        { label: 'User', value: 'user' },
                        { label: 'Agent', value: 'agent' },
                        { label: 'Admin', value: 'admin' },
                    ]
                },
                { name: 'reason', type: 'textarea' },
                { name: 'refundAmount', type: 'number' },
                {
                    name: 'refundStatus', type: 'select', options: [
                        { label: 'Pending', value: 'pending' },
                        { label: 'Processed', value: 'processed' },
                        { label: 'Completed', value: 'completed' },
                    ]
                },
            ],
        },
        {
            name: 'dispute',
            type: 'group',
            fields: [
                {
                    name: 'status',
                    type: 'select',
                    defaultValue: 'none',
                    options: [
                        { label: 'None', value: 'none' },
                        { label: 'Raised', value: 'raised' },
                        { label: 'In Review', value: 'in-review' },
                        { label: 'Resolved', value: 'resolved' },
                    ],
                },
                { name: 'reason', type: 'textarea' },
                { name: 'resolution', type: 'textarea' },
                { name: 'raisedDate', type: 'date' },
                { name: 'resolvedDate', type: 'date' },
            ],
        },
        {
            name: 'review',
            type: 'relationship',
            relationTo: 'reviews',
            admin: {
                description: 'Customer review after trip completion',
            },
        },
        {
            name: 'completionDate',
            type: 'date',
            admin: {
                condition: (data) => data.bookingStatus === 'completed',
            },
        },
        {
            name: 'notes',
            type: 'array',
            admin: {
                description: 'Internal notes for tracking',
            },
            fields: [
                { name: 'date', type: 'date', required: true },
                { name: 'note', type: 'textarea', required: true },
                { name: 'addedBy', type: 'text' },
            ],
        },
    ],
}
