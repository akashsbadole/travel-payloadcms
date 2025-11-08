'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Camera,
    Loader2,
    Star,
    X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function WriteReviewPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const [formData, setFormData] = useState({
        title: '',
        review: '',
        pros: [''],
        cons: [''],
        tripType: 'family',
        communication: 0,
        valueForMoney: 0,
        professionalism: 0,
        responsiveness: 0,
    })

    const [photos, setPhotos] = useState<File[]>([])

    const addPro = () => {
        setFormData({ ...formData, pros: [...formData.pros, ''] })
    }

    const addCon = () => {
        setFormData({ ...formData, cons: [...formData.cons, ''] })
    }

    const updatePro = (index: number, value: string) => {
        const updated = [...formData.pros]
        updated[index] = value
        setFormData({ ...formData, pros: updated })
    }

    const updateCon = (index: number, value: string) => {
        const updated = [...formData.cons]
        updated[index] = value
        setFormData({ ...formData, cons: updated })
    }

    const removePro = (index: number) => {
        if (formData.pros.length > 1) {
            setFormData({ ...formData, pros: formData.pros.filter((_, i) => i !== index) })
        }
    }

    const removeCon = (index: number) => {
        if (formData.cons.length > 1) {
            setFormData({ ...formData, cons: formData.cons.filter((_, i) => i !== index) })
        }
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos([...photos, ...Array.from(e.target.files)])
        }
    }

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        setLoading(true)
        try {
            // TODO: Implement review submission API
            await new Promise((resolve) => setTimeout(resolve, 2000))
            toast.success('Review submitted successfully!')
            router.push(`/dashboard/bookings/${params.id}`)
        } catch (error) {
            toast.error('Failed to submit review')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Write a Review</h1>
                    <p className="text-gray-600">Share your experience to help other travelers</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Overall Rating */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold">Overall Rating *</h2>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-12 w-12 ${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="mt-2 text-sm text-gray-600">
                                {rating === 5 && 'Excellent!'}
                                {rating === 4 && 'Very Good'}
                                {rating === 3 && 'Good'}
                                {rating === 2 && 'Fair'}
                                {rating === 1 && 'Poor'}
                            </p>
                        )}
                    </Card>

                    {/* Detailed Ratings */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold">Detailed Ratings</h2>
                        <div className="space-y-4">
                            {[
                                { key: 'communication', label: 'Communication' },
                                { key: 'valueForMoney', label: 'Value for Money' },
                                { key: 'professionalism', label: 'Professionalism' },
                                { key: 'responsiveness', label: 'Responsiveness' },
                            ].map((item) => (
                                <div key={item.key}>
                                    <Label className="mb-2 block">{item.label}</Label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, [item.key]: star })}
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= (formData[item.key as keyof typeof formData] as number)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Review Title */}
                    <Card className="p-6">
                        <Label htmlFor="title">Review Title *</Label>
                        <Input
                            id="title"
                            required
                            placeholder="Summarize your experience"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-2"
                        />
                    </Card>

                    {/* Review Text */}
                    <Card className="p-6">
                        <Label htmlFor="review">Your Review *</Label>
                        <Textarea
                            id="review"
                            required
                            placeholder="Share details of your experience..."
                            rows={6}
                            value={formData.review}
                            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                            className="mt-2"
                        />
                    </Card>

                    {/* Pros */}
                    <Card className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <Label>What did you like?</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addPro}>
                                Add Pro
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.pros.map((pro, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., Great communication"
                                        value={pro}
                                        onChange={(e) => updatePro(index, e.target.value)}
                                    />
                                    {formData.pros.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePro(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Cons */}
                    <Card className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <Label>What could be improved?</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addCon}>
                                Add Con
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.cons.map((con, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., Response time could be faster"
                                        value={con}
                                        onChange={(e) => updateCon(index, e.target.value)}
                                    />
                                    {formData.cons.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCon(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Photos */}
                    <Card className="p-6">
                        <Label>Add Photos (Optional)</Label>
                        <div className="mt-4">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="hidden"
                                id="photo-upload"
                            />
                            <label htmlFor="photo-upload">
                                <Button type="button" variant="outline" asChild>
                                    <span>
                                        <Camera className="mr-2 h-4 w-4" />
                                        Upload Photos
                                    </span>
                                </Button>
                            </label>
                            {photos.length > 0 && (
                                <div className="mt-4 grid grid-cols-4 gap-4">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Upload ${index + 1}`}
                                                className="h-24 w-24 rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
