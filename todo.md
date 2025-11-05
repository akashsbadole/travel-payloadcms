# Travel Marketplace MVP - PayloadCMS Architecture

Based on your requirements and the comprehensive spec, here's a streamlined MVP focused on **Flight, Hotels, Bus, Train & Tour Packages** using **PayloadCMS**.

---

## **MVP CORE FEATURES (Simplified)**

### **1. USER SIDE - Core Features**

#### **A. User Authentication & Profile**
- Email/Password registration
- Google OAuth login
- User profile with:
  - Basic info (name, email, phone)
  - Travel preferences
  - Booking history
  - Saved requirements

#### **B. Requirement Submission System (Main Feature)**
**Users submit travel requirements instead of direct booking:**

**Travel Type Selection:**
- ✈️ Flight
- 🏨 Hotel
- 🚌 Bus
- 🚂 Train
- 🎒 Tour Package

**Requirement Form (Dynamic based on type):**

**For Flights:**
- From → To
- Departure date
- Return date (optional)
- Passengers (Adults/Children/Infants)
- Class preference (Economy/Business)
- Budget range
- Additional notes

**For Hotels:**
- Destination
- Check-in / Check-out dates
- Number of rooms
- Guests per room
- Star rating preference (3/4/5 star)
- Budget per night
- Meal preference
- Additional requirements

**For Bus:**
- From → To
- Travel date
- Number of passengers
- Bus type (AC/Non-AC, Sleeper/Seater)
- Budget range
- Departure time preference

**For Train:**
- From → To
- Travel date
- Number of passengers
- Class preference (Sleeper/3AC/2AC/1AC)
- Tatkal booking needed (Yes/No)
- Budget per person

**For Tour Packages:**
- Destination(s)
- Duration (X days / Y nights)
- Travel dates (Fixed/Flexible)
- Number of travelers
- Budget per person
- Travel theme (Honeymoon/Family/Adventure/etc.)
- Inclusions needed (Flights/Hotels/Meals/Sightseeing)
- Special requirements

#### **C. Quote Management Dashboard**
- View all submitted requirements
- Track status:
  - 📤 Submitted
  - 👀 Agents viewing
  - 💬 Quotes received
  - ✅ Quote accepted
  - 💰 Payment pending
  - ✈️ Confirmed
  - ❌ Cancelled

**Quote Comparison:**
- Receive multiple quotes from agents
- Side-by-side comparison
- Price, inclusions, agent rating
- Chat with agent
- Accept quote
- Request modifications

#### **D. Communication System**
- In-app messaging with agents
- File sharing (images, PDFs)
- Email notifications
- SMS alerts

#### **E. Booking & Payment**
- Accept quote → Proceed to book
- Enter traveler details
- Payment options:
  - Full payment
  - Partial payment (deposit)
  - UPI, Cards, Net Banking
- Payment gateway integration (Razorpay/Stripe)
- Booking confirmation
- Download vouchers/tickets

#### **F. My Bookings**
- Upcoming bookings
- Past bookings
- Download invoices
- Track booking status
- Contact agent
- Write reviews

---

### **2. AGENT SIDE - Core Features**

#### **A. Agent Registration & Verification**
- Business registration form
- Upload documents:
  - Company registration
  - GST certificate
  - PAN card
  - Trade license
- Admin verification (manual approval)
- Verified badge after approval

#### **B. Agent Dashboard**
- New requirements feed
- Filter by:
  - Service type (Flight/Hotel/Bus/Train/Package)
  - Date
  - Budget range
  - Destination
  - Status
- Quick stats:
  - Pending quotes
  - Active leads
  - Conversions
  - Revenue

#### **C. Requirement Management**
- View requirement details
- Accept/Skip requirement
- Set reminder
- Add internal notes

#### **D. Quote Builder**
**Simple Quote Creation:**

For each service type, agent can:
- Enter pricing
- Add inclusions/exclusions
- Upload supporting documents
- Set validity period
- Add terms & conditions
- Submit quote to user

**Quote Actions:**
- Edit draft quotes
- Track quote status (Sent/Viewed/Accepted/Rejected)
- Revise quotes based on user feedback
- Send follow-up messages

#### **E. Booking Management**
Once quote accepted:
- View booking details
- Upload vouchers/tickets
- Update booking status
- Handle modifications
- Process refunds (if needed)
- Mark as completed

#### **F. Communication Hub**
- Chat with customers
- Quick reply templates
- File uploads
- Email/SMS integration

#### **G. Payment & Earnings**
- View earnings
- Payment history
- Pending payouts
- Commission structure
- Generate invoices

---

### **3. ADMIN PANEL - Core Features**

#### **A. Dashboard**
- Total users
- Total agents
- Total requirements submitted
- Total bookings
- Revenue metrics
- Recent activities

#### **B. User Management**
- View all users
- User details & activity
- Block/Unblock users
- Support tickets

#### **C. Agent Management**
- Pending verifications
- Approve/Reject agents
- View agent performance
- Manage agent status
- Handle agent disputes

#### **D. Requirement Monitoring**
- View all requirements
- Track fulfillment rate
- Unassigned requirements
- Send to more agents

#### **E. Booking Management**
- View all bookings
- Booking details
- Resolve disputes
- Refund management
- Generate reports

#### **F. Payment Management**
- Transaction history
- Commission tracking
- Agent payouts
- Refund processing
- Financial reports

#### **G. Content Management**
- Homepage banners
- Featured destinations
- Blog/guides
- FAQs
- Notifications

#### **H. System Settings**
- Commission rates
- Payment gateway config
- Email/SMS templates
- Platform fees
- Service categories

---

## **PAYLOADCMS COLLECTIONS STRUCTURE**

### **Collections to Create:**

```javascript
// 1. Users Collection
{
  slug: 'users',
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    { name: 'role', type: 'select', options: ['user', 'agent', 'admin'] },
    { name: 'travelPreferences', type: 'group', fields: [...] },
    { name: 'savedRequirements', type: 'relationship', relationTo: 'requirements' }
  ]
}

// 2. Agents Collection
{
  slug: 'agents',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'companyName', type: 'text', required: true },
    { name: 'gstNumber', type: 'text' },
    { name: 'documents', type: 'upload', relationTo: 'media' },
    { name: 'verificationStatus', type: 'select', 
      options: ['pending', 'verified', 'rejected'] },
    { name: 'specializations', type: 'array', fields: [...] },
    { name: 'rating', type: 'number' },
    { name: 'totalBookings', type: 'number' }
  ]
}

// 3. Requirements Collection (Main)
{
  slug: 'requirements',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'serviceType', type: 'select', 
      options: ['flight', 'hotel', 'bus', 'train', 'tour-package'] },
    { name: 'status', type: 'select',
      options: ['submitted', 'in-review', 'quoted', 'accepted', 'booked', 'completed', 'cancelled'] },
    
    // Flight specific fields
    { name: 'flightDetails', type: 'group', 
      admin: { condition: (data) => data.serviceType === 'flight' },
      fields: [
        { name: 'from', type: 'text' },
        { name: 'to', type: 'text' },
        { name: 'departureDate', type: 'date' },
        { name: 'returnDate', type: 'date' },
        { name: 'passengers', type: 'group', fields: [...] },
        { name: 'class', type: 'select' },
        { name: 'budget', type: 'number' }
      ]
    },
    
    // Hotel specific fields
    { name: 'hotelDetails', type: 'group',
      admin: { condition: (data) => data.serviceType === 'hotel' },
      fields: [...]
    },
    
    // Similar for bus, train, tour-package
    
    { name: 'additionalNotes', type: 'textarea' },
    { name: 'quotes', type: 'relationship', relationTo: 'quotes', hasMany: true }
  ]
}

// 4. Quotes Collection
{
  slug: 'quotes',
  fields: [
    { name: 'requirement', type: 'relationship', relationTo: 'requirements' },
    { name: 'agent', type: 'relationship', relationTo: 'agents' },
    { name: 'pricing', type: 'group', fields: [
      { name: 'basePrice', type: 'number' },
      { name: 'taxes', type: 'number' },
      { name: 'total', type: 'number' }
    ]},
    { name: 'inclusions', type: 'array', of: 'text' },
    { name: 'exclusions', type: 'array', of: 'text' },
    { name: 'validity', type: 'date' },
    { name: 'termsAndConditions', type: 'richText' },
    { name: 'documents', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'status', type: 'select', 
      options: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'] },
    { name: 'detailedItinerary', type: 'richText' }
  ]
}

// 5. Bookings Collection
{
  slug: 'bookings',
  fields: [
    { name: 'requirement', type: 'relationship', relationTo: 'requirements' },
    { name: 'quote', type: 'relationship', relationTo: 'quotes' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'agent', type: 'relationship', relationTo: 'agents' },
    { name: 'bookingId', type: 'text', unique: true },
    { name: 'travelerDetails', type: 'array', fields: [...] },
    { name: 'paymentStatus', type: 'select',
      options: ['pending', 'partial', 'paid', 'refunded'] },
    { name: 'bookingStatus', type: 'select',
      options: ['confirmed', 'pending', 'cancelled', 'completed'] },
    { name: 'totalAmount', type: 'number' },
    { name: 'paidAmount', type: 'number' },
    { name: 'vouchers', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'bookingDate', type: 'date' },
    { name: 'travelDate', type: 'date' }
  ]
}

// 6. Messages Collection
{
  slug: 'messages',
  fields: [
    { name: 'requirement', type: 'relationship', relationTo: 'requirements' },
    { name: 'sender', type: 'relationship', relationTo: 'users' },
    { name: 'receiver', type: 'relationship', relationTo: 'users' },
    { name: 'message', type: 'textarea' },
    { name: 'attachments', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'read', type: 'checkbox', defaultValue: false }
  ]
}

// 7. Payments Collection
{
  slug: 'payments',
  fields: [
    { name: 'booking', type: 'relationship', relationTo: 'bookings' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'amount', type: 'number' },
    { name: 'paymentMethod', type: 'select',
      options: ['card', 'upi', 'netbanking', 'wallet'] },
    { name: 'paymentStatus', type: 'select',
      options: ['pending', 'success', 'failed', 'refunded'] },
    { name: 'transactionId', type: 'text' },
    { name: 'paymentGateway', type: 'text' },
    { name: 'paymentDate', type: 'date' }
  ]
}

// 8. Reviews Collection
{
  slug: 'reviews',
  fields: [
    { name: 'booking', type: 'relationship', relationTo: 'bookings' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'agent', type: 'relationship', relationTo: 'agents' },
    { name: 'rating', type: 'number', min: 1, max: 5 },
    { name: 'review', type: 'textarea' },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'verified', type: 'checkbox' }
  ]
}

// 9. Notifications Collection
{
  slug: 'notifications',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'title', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'type', type: 'select',
      options: ['requirement', 'quote', 'booking', 'payment', 'message'] },
    { name: 'read', type: 'checkbox', defaultValue: false },
    { name: 'link', type: 'text' }
  ]
}

// 10. Media Collection (built-in, just configure)
{
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
  }
}
```

---

## **TECH STACK**

### **Backend:**
- **PayloadCMS** (Node.js + sqlite/postgreysql , for local sqlite)
- **Database:** MongoDB
- **Authentication:** Payload's built-in auth
- **File Storage:** Local
- **Payment Gateway:** paypal

### **Frontend:**
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI** components
- **React Query** for data fetching
- **Zustand** for state management

### **Additional Services:**
- **Email:** SendGrid/Resend
- **SMS:** Twilio/MSG91
- **Real-time:** Socket.io (for chat)
- **Push Notifications:** Firebase Cloud Messaging

---

## **MVP FLOW SUMMARY**

1. **User signs up** → Browses or submits requirement
2. **Requirement created** → Matched with relevant agents
3. **Agents receive notification** → View requirement → Create quote
4. **User receives quotes** → Compare → Chat with agents → Accept quote
5. **Payment** → Booking confirmed
6. **Agent uploads vouchers/tickets** → User receives confirmation
7. **Trip completed** → User writes review
8. **Admin monitors** → Ensures smooth operation → Handles disputes

---

This MVP structure is **PayloadCMS-friendly**, scalable, and focuses on your core requirement submission flow. Would you like me to elaborate on any specific section or provide code examples for payload config?