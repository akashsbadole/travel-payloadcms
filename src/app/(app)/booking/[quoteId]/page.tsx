'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, CreditCard, Loader2, Shield, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BookingPage({ params }: { params: { quoteId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Details, 2: Payment, 3: Confirmation
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [travelers, setTravelers] = useState([
    {
      firstName: '',
      lastName: '',
      age: '',
      gender: 'male',
      email: '',
      phone: '',
      passportNumber: '',
    },
  ])

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  })

  const [specialRequests, setSpecialRequests] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')

  const addTraveler = () => {
    setTravelers([
      ...travelers,
      {
        firstName: '',
        lastName: '',
        age: '',
        gender: 'male',
        email: '',
        phone: '',
        passportNumber: '',
      },
    ])
  }

  const removeTraveler = (index: number) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((_, i) => i !== index))
    }
  }

  const updateTraveler = (index: number, field: string, value: string) => {
    const updated = [...travelers]
    updated[index] = { ...updated[index], [field]: value }
    setTravelers(updated)
  }

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement booking API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Booking confirmed!')
      router.push('/booking/success')
    } catch (error) {
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-[#e8e8e4]-200'}`}
            >
              {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
            </div>
            <span className="font-medium">Traveler Details</span>
          </div>
          <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-[#e8e8e4]-200'}`} />
          <div
            className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-[#e8e8e4]-200'}`}
            >
              {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
            </div>
            <span className="font-medium">Payment</span>
          </div>
          <div className={`h-0.5 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-[#e8e8e4]-200'}`} />
          <div
            className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-[#e8e8e4]-200'}`}
            >
              3
            </div>
            <span className="font-medium">Confirmation</span>
          </div>
        </div>

        {/* Step 1: Traveler Details */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-bold">Traveler Details</h2>

              {travelers.map((traveler, index) => (
                <div key={index} className="mb-6 rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Traveler {index + 1}</h3>
                    {travelers.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeTraveler(index)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>First Name *</Label>
                      <Input
                        required
                        value={traveler.firstName}
                        onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input
                        required
                        value={traveler.lastName}
                        onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Age *</Label>
                      <Input
                        type="number"
                        required
                        value={traveler.age}
                        onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Gender *</Label>
                      <Select
                        value={traveler.gender}
                        onValueChange={(value) => updateTraveler(index, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={traveler.email}
                        onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={traveler.phone}
                        onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Passport Number (for international travel)</Label>
                      <Input
                        value={traveler.passportNumber}
                        onChange={(e) => updateTraveler(index, 'passportNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addTraveler} className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Add Another Traveler
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Emergency Contact</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={emergencyContact.name}
                    onChange={(e) =>
                      setEmergencyContact({ ...emergencyContact, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={emergencyContact.phone}
                    onChange={(e) =>
                      setEmergencyContact({ ...emergencyContact, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Input
                    value={emergencyContact.relationship}
                    onChange={(e) =>
                      setEmergencyContact({ ...emergencyContact, relationship: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Special Requests</h3>
              <Textarea
                placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                rows={4}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </Card>

            <Button onClick={() => setStep(2)} className="w-full" size="lg">
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-bold">Payment Method</h2>

              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <Card
                  className={`cursor-pointer p-4 ${paymentMethod === 'card' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  <div className="font-semibold">Credit/Debit Card</div>
                </Card>
                <Card
                  className={`cursor-pointer p-4 ${paymentMethod === 'upi' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  <div className="font-semibold">UPI</div>
                </Card>
                <Card
                  className={`cursor-pointer p-4 ${paymentMethod === 'emi' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setPaymentMethod('emi')}
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  <div className="font-semibold">EMI</div>
                </Card>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <Label>Expiry Date</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" maxLength={3} />
                    </div>
                  </div>
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input placeholder="Name on card" />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>₹50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>₹5,000</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹55,000</span>
                </div>
              </div>
            </Card>

            <Card className="bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Your payment is secure and protected by our money-back guarantee
                </span>
              </div>
            </Card>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="cursor-pointer text-sm">
                I accept the terms and conditions, cancellation policy, and privacy policy
              </Label>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !acceptedTerms}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
