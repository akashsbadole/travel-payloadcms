import type { CollectionConfig } from 'payload'

export const Requirements: CollectionConfig = {
    slug: 'requirements',
    access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    admin: {
        group: 'Travel',
        useAsTitle: 'serviceType',
        defaultColumns: ['serviceType', 'status', 'user', 'createdAt'],
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
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
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'submitted',
            options: [
                { label: 'Submitted', value: 'submitted' },
                { label: 'In Review', value: 'in-review' },
                { label: 'Quoted', value: 'quoted' },
                { label: 'Accepted', value: 'accepted' },
                { label: 'Booked', value: 'booked' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
        },
        // Flight Details
        {
            name: 'flightDetails',
            type: 'group',
            admin: {
                condition: (data) => data.serviceType === 'flight',
            },
            fields: [
                { name: 'from', type: 'text', required: true },
                { name: 'to', type: 'text', required: true },
                { name: 'departureDate', type: 'date', required: true },
                { name: 'returnDate', type: 'date' },
                {
                    name: 'passengers',
                    type: 'group',
                    fields: [
                        { name: 'adults', type: 'number', defaultValue: 1, min: 1 },
                        { name: 'children', type: 'number', defaultValue: 0, min: 0 },
                        { name: 'infants', type: 'number', defaultValue: 0, min: 0 },
                    ],
                },
                {
                    name: 'class',
                    type: 'select',
                    options: [
                        { label: 'Economy', value: 'economy' },
                        { label: 'Business', value: 'business' },
                        { label: 'First Class', value: 'first' },
                    ],
                },
                { name: 'budget', type: 'number' },
            ],
        },
        // Hotel Details
        {
            name: 'hotelDetails',
            type: 'group',
            admin: {
                condition: (data) => data.serviceType === 'hotel',
            },
            fields: [
                { name: 'destination', type: 'text', required: true },
                { name: 'checkInDate', type: 'date', required: true },
                { name: 'checkOutDate', type: 'date', required: true },
                { name: 'numberOfRooms', type: 'number', defaultValue: 1, min: 1 },
                { name: 'guestsPerRoom', type: 'number', defaultValue: 2, min: 1 },
                {
                    name: 'starRating',
                    type: 'select',
                    options: [
                        { label: '3 Star', value: '3' },
                        { label: '4 Star', value: '4' },
                        { label: '5 Star', value: '5' },
                    ],
                },
                { name: 'budgetPerNight', type: 'number' },
                {
                    name: 'mealPreference',
                    type: 'select',
                    options: [
                        { label: 'Room Only', value: 'room-only' },
                        { label: 'Breakfast', value: 'breakfast' },
                        { label: 'Half Board', value: 'half-board' },
                        { label: 'Full Board', value: 'full-board' },
                    ],
                },
            ],
        },
        // Bus Details
        {
            name: 'busDetails',
            type: 'group',
            admin: {
                condition: (data) => data.serviceType === 'bus',
            },
            fields: [
                { name: 'from', type: 'text', required: true },
                { name: 'to', type: 'text', required: true },
                { name: 'travelDate', type: 'date', required: true },
                { name: 'numberOfPassengers', type: 'number', defaultValue: 1, min: 1 },
                {
                    name: 'busType',
                    type: 'select',
                    options: [
                        { label: 'AC Seater', value: 'ac-seater' },
                        { label: 'AC Sleeper', value: 'ac-sleeper' },
                        { label: 'Non-AC Seater', value: 'non-ac-seater' },
                        { label: 'Non-AC Sleeper', value: 'non-ac-sleeper' },
                    ],
                },
                { name: 'budget', type: 'number' },
                {
                    name: 'departureTimePreference',
                    type: 'select',
                    options: [
                        { label: 'Morning', value: 'morning' },
                        { label: 'Afternoon', value: 'afternoon' },
                        { label: 'Evening', value: 'evening' },
                        { label: 'Night', value: 'night' },
                    ],
                },
            ],
        },
        // Train Details
        {
            name: 'trainDetails',
            type: 'group',
            admin: {
                condition: (data) => data.serviceType === 'train',
            },
            fields: [
                { name: 'from', type: 'text', required: true },
                { name: 'to', type: 'text', required: true },
                { name: 'travelDate', type: 'date', required: true },
                { name: 'numberOfPassengers', type: 'number', defaultValue: 1, min: 1 },
                {
                    name: 'class',
                    type: 'select',
                    options: [
                        { label: 'Sleeper', value: 'sleeper' },
                        { label: '3AC', value: '3ac' },
                        { label: '2AC', value: '2ac' },
                        { label: '1AC', value: '1ac' },
                    ],
                },
                { name: 'tatkalBooking', type: 'checkbox', defaultValue: false },
                { name: 'budgetPerPerson', type: 'number' },
            ],
        },
        // Tour Package Details
        {
            name: 'tourPackageDetails',
            type: 'group',
            admin: {
                condition: (data) => data.serviceType === 'tour-package',
            },
            fields: [
                { name: 'destinations', type: 'text', required: true },
                { name: 'duration', type: 'text', required: true },
                { name: 'travelDates', type: 'date', required: true },
                { name: 'flexibleDates', type: 'checkbox', defaultValue: false },
                { name: 'numberOfTravelers', type: 'number', defaultValue: 1, min: 1 },
                { name: 'budgetPerPerson', type: 'number' },
                {
                    name: 'travelTheme',
                    type: 'select',
                    options: [
                        { label: 'Honeymoon', value: 'honeymoon' },
                        { label: 'Family', value: 'family' },
                        { label: 'Adventure', value: 'adventure' },
                        { label: 'Religious', value: 'religious' },
                        { label: 'Beach', value: 'beach' },
                        { label: 'Hill Station', value: 'hill-station' },
                    ],
                },
                {
                    name: 'inclusions',
                    type: 'select',
                    hasMany: true,
                    options: [
                        { label: 'Flights', value: 'flights' },
                        { label: 'Hotels', value: 'hotels' },
                        { label: 'Meals', value: 'meals' },
                        { label: 'Sightseeing', value: 'sightseeing' },
                        { label: 'Transport', value: 'transport' },
                    ],
                },
            ],
        },
        {
            name: 'additionalNotes',
            type: 'textarea',
        },
        {
            name: 'quotes',
            type: 'relationship',
            relationTo: 'quotes',
            hasMany: true,
        },
    ],
}
