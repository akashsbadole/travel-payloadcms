import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { messages, requirement } = await request.json()

        // TODO: Integrate with OpenAI API
        // For now, using simple pattern matching
        const lastMessage = messages[messages.length - 1]
        const userInput = lastMessage.content.toLowerCase()

        let response = ''
        const updatedRequirement = { ...requirement }

        // Destination detection
        const destinations = ['dubai', 'goa', 'maldives', 'paris', 'london', 'bali', 'thailand', 'singapore']
        const foundDestination = destinations.find((dest) => userInput.includes(dest))

        if (foundDestination) {
            updatedRequirement.destination = foundDestination.charAt(0).toUpperCase() + foundDestination.slice(1)
            response = `Excellent choice! ${updatedRequirement.destination} is a fantastic destination! 🌍\n\nTo help you plan better, could you share:\n- When are you planning to travel?\n- How many days?\n- What's your approximate budget?`
        }
        // Date/Duration detection
        else if (userInput.match(/\d+\s*(day|night|week|month)/)) {
            const duration = userInput.match(/\d+\s*(day|night|week|month)/)?.[0]
            updatedRequirement.duration = duration
            response = `Perfect! A ${duration} trip sounds great! 📅\n\nWhat's your budget range for this trip? (e.g., ₹50,000 or $1000)`
        }
        // Budget detection
        else if (userInput.match(/₹?\$?\d{4,}/)) {
            const budget = userInput.match(/\d{4,}/)?.[0]
            updatedRequirement.budget = budget
            response = `Got it! Budget of ₹${budget} noted. 💰\n\nHow many people will be traveling with you?`
        }
        // Travelers count
        else if (userInput.match(/\d+\s*(person|people|traveler|adult|pax)/)) {
            const count = parseInt(userInput.match(/\d+/)?.[0] || '1')
            updatedRequirement.travelers = count
            response = `Wonderful! ${count} traveler${count > 1 ? 's' : ''}. 👥\n\nWhat type of experience are you looking for?\n- Relaxation & Beach\n- Adventure & Activities\n- Culture & Heritage\n- Shopping & Nightlife\n- Family-friendly\n- Romantic getaway`
        }
        // Preferences
        else if (
            userInput.includes('beach') ||
            userInput.includes('adventure') ||
            userInput.includes('culture') ||
            userInput.includes('shopping') ||
            userInput.includes('family') ||
            userInput.includes('romantic')
        ) {
            const preferences = []
            if (userInput.includes('beach')) preferences.push('Beach & Relaxation')
            if (userInput.includes('adventure')) preferences.push('Adventure Activities')
            if (userInput.includes('culture')) preferences.push('Cultural Experiences')
            if (userInput.includes('shopping')) preferences.push('Shopping')
            if (userInput.includes('family')) preferences.push('Family-friendly')
            if (userInput.includes('romantic')) preferences.push('Romantic')

            updatedRequirement.preferences = preferences
            response = `Great! I've noted your preferences: ${preferences.join(', ')} ✨\n\nNow, would you like me to:\n\n1️⃣ Generate a detailed day-by-day itinerary\n2️⃣ Get personalized quotes from verified travel agents\n3️⃣ Both itinerary and quotes\n\nJust type the number or tell me what you'd prefer!`
        }
        // Itinerary request
        else if (
            userInput.includes('itinerary') ||
            userInput.includes('plan') ||
            userInput.includes('schedule') ||
            userInput === '1' ||
            userInput === '1️⃣'
        ) {
            response = generateDetailedItinerary(updatedRequirement)
        }
        // Quote request
        else if (
            userInput.includes('quote') ||
            userInput.includes('agent') ||
            userInput.includes('price') ||
            userInput === '2' ||
            userInput === '2️⃣'
        ) {
            response = `Perfect! I'll connect you with our verified travel agents. 🎯\n\n**Your Travel Summary:**\n${formatRequirementSummary(updatedRequirement)}\n\nShall I submit this to our agent network? They'll send you personalized quotes within 2-4 hours.\n\nType "yes" to confirm or "edit" to make changes.`
        }
        // Both
        else if (userInput === '3' || userInput === '3️⃣' || userInput.includes('both')) {
            response = `Excellent! I'll provide both! 🎉\n\n${generateDetailedItinerary(updatedRequirement)}\n\n---\n\nI'll also submit your requirement to our verified agents for personalized quotes. Type "confirm" to proceed!`
        }
        // Confirmation
        else if (userInput.includes('yes') || userInput.includes('confirm') || userInput.includes('submit')) {
            response = `✅ Perfect! Your requirement has been submitted to our verified travel agents.\n\nYou'll receive personalized quotes via:\n- Email notifications\n- Dashboard updates\n- SMS alerts\n\nExpected response time: 2-4 hours\n\nIn the meantime, you can:\n- View your dashboard\n- Explore more destinations\n- Chat with me for other trips!\n\nIs there anything else I can help you with? 😊`
        }
        // Default response
        else {
            response = `I'm here to help you plan an amazing trip! 🌟\n\nTo get started, please tell me:\n\n📍 Where would you like to go?\n📅 When and for how long?\n💰 What's your budget?\n👥 How many people are traveling?\n\nOr try saying something like:\n- "I want to visit Dubai for 5 days"\n- "Plan a beach vacation under ₹50,000"\n- "Family trip to Goa next month"`
        }

        return NextResponse.json({
            message: response,
            updatedRequirement,
        })
    } catch (error) {
        console.error('AI Chat Error:', error)
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 },
        )
    }
}

function generateDetailedItinerary(requirement: any): string {
    const destination = requirement.destination || 'your destination'
    const duration = requirement.duration || '4 days'

    return `🗺️ **AI-Generated Itinerary for ${destination}**\n\n**Day 1: Arrival & City Orientation**\n⏰ Morning:\n- Arrive at ${destination}\n- Hotel check-in and freshen up\n- Welcome drink and orientation\n\n⏰ Afternoon:\n- Lunch at local restaurant\n- Visit main city center\n- Explore local markets\n\n⏰ Evening:\n- Sunset point visit\n- Dinner at popular eatery\n- Rest and relax\n\n**Day 2: Main Attractions**\n⏰ Morning:\n- Breakfast at hotel\n- Visit top landmark #1\n- Guided tour experience\n\n⏰ Afternoon:\n- Lunch break\n- Visit top landmark #2\n- Photo opportunities\n\n⏰ Evening:\n- Cultural show/performance\n- Traditional dinner\n- Night market exploration\n\n**Day 3: Adventure & Leisure**\n⏰ Morning:\n- Adventure activity (water sports/hiking)\n- Beach time or nature walk\n\n⏰ Afternoon:\n- Lunch with a view\n- Shopping district visit\n- Spa or relaxation time\n\n⏰ Evening:\n- Rooftop dinner\n- City lights tour\n- Free time\n\n**Day 4: Departure**\n⏰ Morning:\n- Breakfast and check-out\n- Last-minute shopping\n- Airport transfer\n\n💡 **Included:**\n- Accommodation (${requirement.budget ? '₹' + requirement.budget : 'as per budget'})\n- Daily breakfast\n- Airport transfers\n- Sightseeing tours\n- Local guide\n\n📝 **Notes:**\n- Customize based on your preferences\n- Flexible timings\n- Weather-dependent activities\n\nWould you like me to:\n- Adjust the itinerary\n- Add more activities\n- Get quotes from agents for this plan`
}

function formatRequirementSummary(requirement: any): string {
    let summary = ''
    if (requirement.destination) summary += `📍 Destination: ${requirement.destination}\n`
    if (requirement.duration) summary += `📅 Duration: ${requirement.duration}\n`
    if (requirement.budget) summary += `💰 Budget: ₹${requirement.budget}\n`
    if (requirement.travelers) summary += `👥 Travelers: ${requirement.travelers}\n`
    if (requirement.preferences)
        summary += `✨ Preferences: ${requirement.preferences.join(', ')}\n`

    return summary || '(Please provide more details)'
}
