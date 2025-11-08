import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
    slug: 'settings',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'commissionSettings',
            type: 'group',
            fields: [
                {
                    name: 'agentCommissionRate',
                    type: 'number',
                    defaultValue: 2,
                    required: true,
                    admin: {
                        description: 'Commission rate for agents (percentage)',
                    },
                },
                {
                    name: 'customerCommissionRate',
                    type: 'number',
                    defaultValue: 1,
                    required: true,
                    admin: {
                        description: 'Commission rate for customers (percentage)',
                    },
                },
                {
                    name: 'minimumPayoutThreshold',
                    type: 'number',
                    defaultValue: 1000,
                    required: true,
                    admin: {
                        description: 'Minimum amount required for payout request',
                    },
                },
                {
                    name: 'payoutSchedule',
                    type: 'select',
                    defaultValue: 'weekly',
                    options: [
                        { label: 'Weekly', value: 'weekly' },
                        { label: 'Bi-weekly', value: 'bi-weekly' },
                        { label: 'Monthly', value: 'monthly' },
                    ],
                },
            ],
        },
        {
            name: 'paymentSettings',
            type: 'group',
            fields: [
                {
                    name: 'paypalClientId',
                    type: 'text',
                    admin: {
                        description: 'PayPal Client ID',
                    },
                },
                {
                    name: 'paypalSecret',
                    type: 'text',
                    admin: {
                        description: 'PayPal Secret (stored securely)',
                    },
                },
                {
                    name: 'paymentMode',
                    type: 'select',
                    defaultValue: 'sandbox',
                    options: [
                        { label: 'Sandbox (Testing)', value: 'sandbox' },
                        { label: 'Live (Production)', value: 'live' },
                    ],
                },
            ],
        },
    ],
}
