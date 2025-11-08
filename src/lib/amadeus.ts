// Amadeus API Integration
// Documentation: https://developers.amadeus.com/

interface AmadeusConfig {
    clientId: string
    clientSecret: string
    environment: 'test' | 'production'
}

class AmadeusAPI {
    private config: AmadeusConfig
    private accessToken: string | null = null
    private tokenExpiry: number = 0
    private baseUrl: string

    constructor(config: AmadeusConfig) {
        this.config = config
        this.baseUrl = config.environment === 'production'
            ? 'https://api.amadeus.com'
            : 'https://test.api.amadeus.com'
    }

    private async getAccessToken(): Promise<string> {
        // Check if token is still valid
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken
        }

        // Get new token
        const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
            }),
        })

        const data = await response.json()
        this.accessToken = data.access_token
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 min before expiry

        return this.accessToken
    }

    // Flight Search
    async searchFlights(params: {
        origin: string
        destination: string
        departureDate: string
        returnDate?: string
        adults: number
        children?: number
        infants?: number
        travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'
        max?: number
    }) {
        const token = await this.getAccessToken()

        const queryParams = new URLSearchParams({
            originLocationCode: params.origin,
            destinationLocationCode: params.destination,
            departureDate: params.departureDate,
            adults: params.adults.toString(),
            max: (params.max || 10).toString(),
        })

        if (params.returnDate) queryParams.append('returnDate', params.returnDate)
        if (params.children) queryParams.append('children', params.children.toString())
        if (params.infants) queryParams.append('infants', params.infants.toString())
        if (params.travelClass) queryParams.append('travelClass', params.travelClass)

        const response = await fetch(
            `${this.baseUrl}/v2/shopping/flight-offers?${queryParams}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.json()
    }

    // Hotel Search
    async searchHotels(params: {
        cityCode: string
        checkInDate: string
        checkOutDate: string
        adults: number
        roomQuantity?: number
        radius?: number
        radiusUnit?: 'KM' | 'MILE'
    }) {
        const token = await this.getAccessToken()

        const queryParams = new URLSearchParams({
            cityCode: params.cityCode,
            checkInDate: params.checkInDate,
            checkOutDate: params.checkOutDate,
            adults: params.adults.toString(),
            roomQuantity: (params.roomQuantity || 1).toString(),
        })

        if (params.radius) queryParams.append('radius', params.radius.toString())
        if (params.radiusUnit) queryParams.append('radiusUnit', params.radiusUnit)

        const response = await fetch(
            `${this.baseUrl}/v3/shopping/hotel-offers?${queryParams}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.json()
    }

    // Airport Search (for autocomplete)
    async searchAirports(keyword: string) {
        const token = await this.getAccessToken()

        const response = await fetch(
            `${this.baseUrl}/v1/reference-data/locations?subType=AIRPORT&keyword=${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.json()
    }

    // City Search
    async searchCities(keyword: string) {
        const token = await this.getAccessToken()

        const response = await fetch(
            `${this.baseUrl}/v1/reference-data/locations/cities?keyword=${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.json()
    }

    // Flight Price Analysis
    async getFlightPriceAnalysis(params: {
        origin: string
        destination: string
        departureDate: string
    }) {
        const token = await this.getAccessToken()

        const queryParams = new URLSearchParams({
            originIataCode: params.origin,
            destinationIataCode: params.destination,
            departureDate: params.departureDate,
        })

        const response = await fetch(
            `${this.baseUrl}/v1/analytics/itinerary-price-metrics?${queryParams}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.json()
    }

    // Points of Interest
    async getPointsOfInterest(params: {
        latitude: number
        longitude: number
        radius?: number
    }) {
        const token = await this.getAccessToken()

        const queryParams = new URLSearchParams({
            latitude: params.latitude.toString(),
            longitude: params.longitude.toString(),
            radius: (params.radius || 1).toString(),
        })

        const response = await fetch(
            `${this.baseUrl}/v1/shopping/activities?${queryParams}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.json()
    }
}

// Initialize Amadeus API
export const amadeus = new AmadeusAPI({
    clientId: process.env.AMADEUS_CLIENT_ID || '',
    clientSecret: process.env.AMADEUS_CLIENT_SECRET || '',
    environment: (process.env.AMADEUS_ENV as 'test' | 'production') || 'test',
})

// Bus API Integration (using RedBus-like API)
export class BusAPI {
    private apiKey: string
    private baseUrl: string

    constructor() {
        this.apiKey = process.env.BUS_API_KEY || ''
        this.baseUrl = process.env.BUS_API_URL || 'https://api.redbus.in'
    }

    async searchBuses(params: {
        source: string
        destination: string
        date: string
    }) {
        const response = await fetch(
            `${this.baseUrl}/v1/search?source=${params.source}&destination=${params.destination}&date=${params.date}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        return response.json()
    }

    async getBusDetails(busId: string) {
        const response = await fetch(
            `${this.baseUrl}/v1/buses/${busId}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            }
        )

        return response.json()
    }
}

// Train API Integration (using IRCTC-like API)
export class TrainAPI {
    private apiKey: string
    private baseUrl: string

    constructor() {
        this.apiKey = process.env.TRAIN_API_KEY || ''
        this.baseUrl = process.env.TRAIN_API_URL || 'https://api.railwayapi.com'
    }

    async searchTrains(params: {
        source: string
        destination: string
        date: string
    }) {
        const response = await fetch(
            `${this.baseUrl}/v2/between/source/${params.source}/dest/${params.destination}/date/${params.date}/apikey/${this.apiKey}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response.json()
    }

    async getTrainSchedule(trainNumber: string) {
        const response = await fetch(
            `${this.baseUrl}/v2/route/train/${trainNumber}/apikey/${this.apiKey}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response.json()
    }

    async checkSeatAvailability(params: {
        trainNumber: string
        source: string
        destination: string
        date: string
        class: string
        quota: string
    }) {
        const response = await fetch(
            `${this.baseUrl}/v2/check-seat/train/${params.trainNumber}/source/${params.source}/dest/${params.destination}/date/${params.date}/pref/${params.class}/quota/${params.quota}/apikey/${this.apiKey}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response.json()
    }
}

export const busAPI = new BusAPI()
export const trainAPI = new TrainAPI()
