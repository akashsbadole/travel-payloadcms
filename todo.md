# Travel Marketplace - Implementation TODO List

## **COMPLETED ✅**

### Backend Collections (PayloadCMS)
- ✅ Users Collection (with auth)
- ✅ Agents Collection (company info, verification, specializations)
- ✅ Requirements Collection (flight, hotel, bus, train, tour package details)
- ✅ Quotes Collection (pricing, inclusions, itinerary)
- ✅ Bookings Collection
- ✅ Messages Collection
- ✅ Notifications Collection
- ✅ Payments Collection
- ✅ Reviews Collection
- ✅ Media Collection
- ✅ Categories & Pages Collections

### Tech Stack Setup
- ✅ Next.js 15 with App Router
- ✅ PayloadCMS 3.62.1 configured
- ✅ SQLite database adapter
- ✅ Lexical rich text editor
- ✅ TypeScript configuration
- ✅ Tailwind CSS + Shadcn/UI
- ✅ Authentication system

---

## **TODO - PRIORITY ORDER 🎯**

### **PHASE 1: Commission System (CRITICAL)**

**Requirement:** 2% commission from agents, 1% commission from customers

#### Tasks:
- [ ] Add commission fields to Bookings collection:
  - `agentCommission` (number, calculated as 2% of booking amount)
  - `customerCommission` (number, calculated as 1% of booking amount)
  - `platformCommission` (number, total = agentCommission + customerCommission)
  - `agentPayout` (number, booking amount - agentCommission)
  
- [ ] Create commission calculation hooks:
  - `beforeChange` hook on Bookings to auto-calculate commissions
  - Update agent earnings when booking is confirmed
  
- [ ] Add commission tracking to Agents collection:
  - `totalEarnings` (number)
  - `pendingPayout` (number)
  - `paidOut` (number)
  - `commissionRate` (number, default 2%)

- [ ] Create Settings Global for commission configuration:
  - Agent commission rate (default 2%)
  - Customer commission rate (default 1%)
  - Minimum payout threshold
  - Payout schedule

---

### **PHASE 2: User Frontend Pages**

#### A. Homepage & Navigation
- [ ] Create landing page (`src/app/(app)/page.tsx`)
  - Hero section with travel types
  - How it works section
  - Featured destinations
  - Testimonials
  
- [ ] Update navigation header
  - Add "Submit Requirement" CTA button
  - User profile dropdown
  - Notifications icon

#### B. Requirement Submission Flow
- [ ] Create `/requirements/new` page
  - Service type selection (Flight/Hotel/Bus/Train/Package)
  - Dynamic form based on service type
  - Form validation
  - Submit to PayloadCMS API
  
- [ ] Create requirement form components:
  - `FlightRequirementForm.tsx`
  - `HotelRequirementForm.tsx`
  - `BusRequirementForm.tsx`
  - `TrainRequirementForm.tsx`
  - `TourPackageRequirementForm.tsx`

#### C. User Dashboard
- [ ] Create `/dashboard` page
  - Overview stats (active requirements, quotes received, bookings)
  - Recent activity feed
  
- [ ] Create `/dashboard/requirements` page
  - List all user requirements
  - Filter by status, service type, date
  - View requirement details
  - Track quote count per requirement

#### D. Quote Management
- [ ] Create `/dashboard/requirements/[id]` page
  - View requirement details
  - List all quotes received
  - Quote comparison table
  - Accept/reject quote actions
  - Chat with agent button
  
- [ ] Create quote comparison component
  - Side-by-side comparison
  - Highlight best price
  - Show agent ratings
  - View detailed itinerary

#### E. Booking & Payment
- [ ] Create `/booking/[quoteId]` page
  - Display quote summary
  - Traveler details form
  - Payment method selection
  - Terms & conditions
  
- [ ] Integrate PayPal payment gateway
  - PayPal SDK setup
  - Payment processing
  - Success/failure handling
  - Generate booking confirmation
  
- [ ] Create `/booking/success` page
  - Booking confirmation
  - Download invoice/voucher
  - Share booking details

#### F. My Bookings
- [ ] Create `/dashboard/bookings` page
  - Upcoming bookings tab
  - Past bookings tab
  - Cancelled bookings tab
  - Filter and search
  
- [ ] Create `/dashboard/bookings/[id]` page
  - Booking details
  - Traveler information
  - Payment history
  - Download vouchers
  - Contact agent
  - Write review (after trip)

---

### **PHASE 3: Agent Frontend Pages**

#### A. Agent Registration
- [ ] Create `/agent/register` page
  - Company information form
  - Document upload (GST, PAN, Trade License)
  - Specialization selection
  - Submit for verification
  
- [ ] Create `/agent/verification-pending` page
  - Status message
  - What happens next
  - Contact admin

#### B. Agent Dashboard
- [ ] Create `/agent/dashboard` page
  - Stats cards (pending quotes, active leads, revenue)
  - Recent requirements feed
  - Quick actions
  
- [ ] Create `/agent/requirements` page
  - Browse all requirements
  - Filter by service type, budget, date, destination
  - Mark as interested
  - View requirement details

#### C. Quote Builder
- [ ] Create `/agent/requirements/[id]/quote` page
  - Requirement summary
  - Quote form (pricing, inclusions, exclusions)
  - Itinerary builder (rich text editor)
  - Upload supporting documents
  - Set validity period
  - Submit quote
  
- [ ] Create quote templates feature
  - Save common quote structures
  - Quick fill from templates

#### D. Agent Bookings
- [ ] Create `/agent/bookings` page
  - Active bookings
  - Completed bookings
  - Upload vouchers/tickets
  - Update booking status
  
- [ ] Create `/agent/bookings/[id]` page
  - Booking details
  - Customer information
  - Upload documents
  - Mark as completed

#### E. Earnings & Payouts
- [ ] Create `/agent/earnings` page
  - Total earnings overview
  - Pending payout
  - Payout history
  - Commission breakdown
  - Generate invoice
  
- [ ] Create payout request system
  - Request payout button
  - Minimum threshold check
  - Bank details form
  - Admin approval workflow

---

### **PHASE 4: Communication System**

#### A. In-App Messaging
- [ ] Create Messages UI component
  - Chat interface
  - Real-time updates (polling or websockets)
  - File attachments
  - Message notifications
  
- [ ] Create `/messages` page
  - Conversation list
  - Unread count badges
  - Search conversations
  
- [ ] Create `/messages/[requirementId]` page
  - Chat thread
  - Send messages
  - Upload files
  - View requirement context

#### B. Notifications System
- [ ] Create notification dropdown component
  - Unread notifications
  - Mark as read
  - Notification types (quote, booking, message, payment)
  - Click to navigate
  
- [ ] Create `/notifications` page
  - All notifications list
  - Filter by type
  - Mark all as read

#### C. Email Notifications
- [ ] Setup email service (Nodemailer already in package.json)
  - Configure SMTP
  - Email templates
  
- [ ] Create email templates:
  - New requirement submitted
  - Quote received
  - Quote accepted
  - Booking confirmed
  - Payment received
  - Review request

---

### **PHASE 5: Admin Panel Enhancements**

#### A. Dashboard Analytics
- [ ] Create custom admin dashboard
  - Total users, agents, requirements, bookings
  - Revenue charts
  - Conversion rates
  - Recent activities
  
- [ ] Add analytics endpoints
  - `/api/admin/stats`
  - `/api/admin/revenue`
  - `/api/admin/conversion-rates`

#### B. Agent Verification
- [ ] Create agent verification workflow
  - Pending agents list
  - View documents
  - Approve/reject with reason
  - Send notification to agent
  
- [ ] Add verification status email notifications

#### C. Commission Management
- [ ] Create commission tracking dashboard
  - Total platform revenue
  - Agent payouts pending
  - Customer commissions collected
  - Monthly/yearly reports
  
- [ ] Create payout management page
  - Pending payout requests
  - Approve/reject payouts
  - Payment processing
  - Payout history

#### D. Dispute Resolution
- [ ] Add dispute field to Bookings collection
  - `disputeStatus` (none, raised, in-review, resolved)
  - `disputeReason` (textarea)
  - `disputeResolution` (textarea)
  
- [ ] Create dispute management page
  - View all disputes
  - Assign to admin
  - Communicate with parties
  - Resolve dispute

---

### **PHASE 6: Additional Features**

#### A. Reviews & Ratings
- [ ] Create review submission form
  - Star rating (1-5)
  - Written review
  - Photo upload
  - Submit after trip completion
  
- [ ] Display reviews on agent profiles
  - Average rating
  - Review list
  - Filter by rating
  - Verified badge for completed bookings

#### B. Search & Filters
- [ ] Create advanced search for requirements
  - Destination search
  - Date range
  - Budget range
  - Service type
  
- [ ] Create agent search/directory
  - Search by specialization
  - Filter by rating
  - Sort by bookings count

#### C. User Profile
- [ ] Create `/profile` page
  - Edit personal information
  - Change password
  - Travel preferences
  - Notification settings
  
- [ ] Create `/profile/settings` page
  - Email preferences
  - SMS preferences
  - Privacy settings

#### D. Mobile Responsiveness
- [ ] Ensure all pages are mobile-friendly
  - Responsive layouts
  - Touch-friendly buttons
  - Mobile navigation menu
  - Test on various devices

---

### **PHASE 7: Amadeus API Integration (Flight & Travel Data)**

**Purpose:** Integrate real-time flight search, hotel availability, and travel data from Amadeus API

#### A. Amadeus API Setup
- [ ] Register for Amadeus for Developers account
- [ ] Get API credentials (Client ID & Secret)
- [ ] Setup OAuth authentication flow
- [ ] Create API utility functions for token management
- [ ] Add environment variables for Amadeus credentials

#### B. Flight Search Integration
- [ ] Implement Flight Offers Search API
  - Search flights by origin, destination, dates
  - Filter by cabin class, airlines, stops
  - Get real-time pricing
  
- [ ] Implement Flight Offers Price API
  - Confirm pricing before booking
  - Get detailed fare rules
  
- [ ] Create flight search UI
  - Search form with autocomplete for airports
  - Display search results with filters
  - Show flight details (duration, stops, baggage)
  - Price comparison

#### C. Hotel Search Integration
- [ ] Implement Hotel Search API
  - Search hotels by city/location
  - Filter by star rating, amenities, price
  - Get availability and pricing
  
- [ ] Implement Hotel Booking API
  - Get detailed hotel information
  - Room availability
  - Booking confirmation
  
- [ ] Create hotel search UI
  - Location search with map integration
  - Display hotel cards with images
  - Filter and sort options
  - Hotel details page

#### D. Additional Amadeus APIs
- [ ] Airport & City Search API
  - Autocomplete for flight search
  - Get airport codes and names
  
- [ ] Flight Inspiration Search
  - Suggest destinations based on budget
  - Popular routes
  
- [ ] Hotel Ratings API
  - Get sentiment analysis and ratings
  - Display reviews
  
- [ ] Points of Interest API
  - Suggest attractions near hotels
  - Tour recommendations

#### E. Agent Quote Enhancement
- [ ] Allow agents to search Amadeus data when creating quotes
- [ ] Pre-fill quote forms with Amadeus pricing
- [ ] Add markup/commission on top of Amadeus prices
- [ ] Compare agent quotes with Amadeus live prices

#### F. Caching & Performance
- [ ] Implement caching for Amadeus API responses
- [ ] Rate limiting to avoid API quota issues
- [ ] Background jobs for price updates
- [ ] Webhook integration for booking updates

---

### **PHASE 8: Testing & Deployment**

#### A. Testing
- [ ] Write integration tests (Vitest already configured)
  - API endpoint tests
  - Collection CRUD tests
  - Commission calculation tests
  
- [ ] Write E2E tests (Playwright already configured)
  - User registration flow
  - Requirement submission flow
  - Quote acceptance flow
  - Payment flow
  - Agent quote creation flow

#### B. Security
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Secure file uploads
- [ ] Environment variable validation

#### C. Performance
- [ ] Optimize images
- [ ] Add caching strategy
- [ ] Database indexing
- [ ] Code splitting
- [ ] Lazy loading

#### D. Deployment
- [ ] Setup production database (PostgreSQL recommended)
- [ ] Configure environment variables
- [ ] Setup CI/CD pipeline
- [ ] Deploy to hosting (Vercel/Railway/AWS)
- [ ] Setup domain and SSL
- [ ] Configure email service
- [ ] Setup payment gateway (production keys)

---

## **IMMEDIATE NEXT STEPS (Start Here)**

1. **Add Commission System** (PHASE 1)
   - Update Bookings collection with commission fields
   - Create commission calculation hooks
   - Add Settings global for commission rates

2. **Create User Requirement Submission** (PHASE 2B)
   - Build `/requirements/new` page
   - Create service-specific forms
   - Connect to PayloadCMS API

3. **Create User Dashboard** (PHASE 2C)
   - Build `/dashboard` page
   - Show requirements list
   - Display quotes received

4. **Create Agent Dashboard** (PHASE 3B)
   - Build `/agent/dashboard` page
   - Show requirements feed
   - Create quote builder

5. **Implement Payment Integration** (PHASE 2E)
   - Setup PayPal SDK
   - Create payment flow
   - Handle success/failure

6. **Amadeus API Integration** (PHASE 7 - Later)
   - Real-time flight search and pricing
   - Hotel availability and booking
   - Travel data enrichment

---

## **TECH STACK (Current)**

- **Backend:** PayloadCMS 3.62.1 + SQLite
- **Frontend:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Auth:** Payload built-in auth
- **Payment:** PayPal (to be integrated)
- **Email:** Nodemailer (configured, needs templates)

---

## **NOTES**

- All backend collections are created and configured ✅
- Focus now is on building frontend user interfaces
- Commission system is critical for business model
- Payment integration is essential for MVP
- Start with user flow, then agent flow, then admin enhancements
- Amadeus API integration will provide real-time flight/hotel data in later phase
- Amadeus offers 2,000 free API calls per month for testing
