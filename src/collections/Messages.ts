import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
    slug: 'messages',
    hooks: {
        afterChange: [
            async ({ doc, req, operation }) => {
                // Send notification when message is created
                if (operation === 'create') {
                    await req.payload.create({
                        collection: 'notifications',
                        data: {
                            user: doc.receiver,
                            title: 'New Message',
                            message: `You have a new message regarding your requirement`,
                            type: 'message',
                            read: false,
                            relatedId: doc.requirement,
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
        group: 'Communication',
        useAsTitle: 'id',
        defaultColumns: ['sender', 'receiver', 'requirement', 'messageType', 'read', 'createdAt'],
    },
    fields: [
        {
            name: 'requirement',
            type: 'relationship',
            relationTo: 'requirements',
            required: true,
        },
        {
            name: 'sender',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'receiver',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'messageType',
            type: 'select',
            defaultValue: 'text',
            options: [
                { label: 'Text', value: 'text' },
                { label: 'File', value: 'file' },
                { label: 'System', value: 'system' },
            ],
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'attachments',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        {
            name: 'read',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'readAt',
            type: 'date',
            admin: {
                condition: (data) => data.read === true,
            },
        },
        {
            name: 'replyTo',
            type: 'relationship',
            relationTo: 'messages',
            admin: {
                description: 'Message this is replying to',
            },
        },
        {
            name: 'isImportant',
            type: 'checkbox',
            defaultValue: false,
        },
    ],
}
