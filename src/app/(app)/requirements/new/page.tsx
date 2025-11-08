'use client'

import { BusRequirementForm } from '@/components/requirements/BusRequirementForm'
import { FlightRequirementForm } from '@/components/requirements/FlightRequirementForm'
import { HotelRequirementForm } from '@/components/requirements/HotelRequirementForm'
import { TourPackageRequirementForm } from '@/components/requirements/TourPackageRequirementForm'
import { TrainRequirementForm } from '@/components/requirements/TrainRequirementForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bus, Hotel, Package, Plane, Train } from 'lucide-react'
import { useState } from 'react'

type ServiceType = 'flight' | 'hotel' | 'bus' | 'train' | 'tour-package' | null

export default function NewRequirementPage() {
    const [selectedType, setSelectedType] = useState<ServiceType>(null)

    if (selectedType) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    onClick={() => setSelectedType(null)}
                    className="mb-6"
                >
                    ← Back to Service Selection
                </Button>
                {selectedType === 'flight' && <FlightRequirementForm />}
                {selectedType === 'hotel' && <HotelRequirementForm />}
                {selectedType === 'bus' && <BusRequirementForm />}
                {selectedType === 'train' && <TrainRequirementForm />}
                {selectedType === 'tour-package' && <TourPackageRequirementForm />}
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold">Submit Your Travel Requirement</h1>
                    <p className="text-lg text-gray-600">
                        Choose your travel type and fill in the details. Our verified agents will send you personalized quotes.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {serviceTypes.map((service) => (
                        <Card
                            key={service.type}
                            className="group cursor-pointer border-2 p-6 transition-all hover:border-blue-500 hover:shadow-lg"
                            onClick={() => setSelectedType(service.type as ServiceType)}
                        >
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-100 p-4 transition-colors group-hover:bg-blue-500">
                                    <service.icon className="h-10 w-10 text-blue-600 transition-colors group-hover:text-white" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-xl font-semibold">{service.name}</h3>
                            <p className="text-center text-sm text-gray-600">{service.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

const serviceTypes = [
    {
        name: 'Flight Booking',
        type: 'flight',
        icon: Plane,
        description: 'Domestic and international flights',
    },
    {
        name: 'Hotel Booking',
        type: 'hotel',
        icon: Hotel,
        description: 'Hotels, resorts, and accommodations',
    },
    {
        name: 'Bus Booking',
        type: 'bus',
        icon: Bus,
        description: 'Intercity and interstate bus travel',
    },
    {
        name: 'Train Booking',
        type: 'train',
        icon: Train,
        description: 'Railway tickets and reservations',
    },
    {
        name: 'Tour Package',
        type: 'tour-package',
        icon: Package,
        description: 'Complete tour packages with itinerary',
    },
]
