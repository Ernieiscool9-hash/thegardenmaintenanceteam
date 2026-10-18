export interface DirectCardTransfer {
  id: string;
  bookingRef: string;
  customerName: string;
  amount: number;
  timestamp: string;
  cardLast4: string;
  status: 'completed' | 'processing';
  note?: string;
}

export interface PayoutCardConfig {
  cardholderName: string;
  cardNumber: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'generic';
  expiryDate: string;
  cvv?: string;
  bankName: string;
  autoTransferEnabled: boolean;
  totalReceived: number;
  lastTransferAt?: string;
  transferMethod: 'instant_card' | 'direct_debit';
  transfersHistory?: DirectCardTransfer[];
}

export interface PlatformConfig {
  businessName?: string;
  supportPhone: string;
  supportEmail: string;
  supportHours: string;
  emergencyHotline: string;
  serviceLocations: string[];
  payoutCard?: PayoutCardConfig;
}

export type ServiceCategory = 'lawn' | 'hedge' | 'clearance' | 'planting' | 'maintenance' | 'trees' | 'other';

export interface GardeningService {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDesc: string;
  detailedDesc: string;
  basePrice: number;
  priceUnit: string;
  estimatedHours: number;
  image: string;
  includedTasks: string[];
  recommendedFrequency: string;
}

export interface GardenerReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  serviceName: string;
}

export interface GardenerProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  distanceMiles: number;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  hourlyRate: number;
  bio: string;
  specialties: string[];
  certifications: string[];
  equipment: string[];
  availableThisWeek: boolean;
  insuranceCoverage: string;
  recentReviews: GardenerReview[];
  completedJobsCount: number;
}

export type YardSize = 'small' | 'medium' | 'large' | 'estate';
export type LawnHeight = 'tidy' | 'overgrown' | 'jungle';
export type WasteHandling = 'compost_onsite' | 'removal_haul' | 'green_bin';
export type BookingFrequency = 'one_off' | 'biweekly' | 'monthly';
export type BookingStatus = 'scheduled' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingPricing {
  baseAmount: number;
  sizeMultiplierAmount: number;
  conditionSurcharge: number;
  wasteDisposalAmount: number;
  frequencyDiscount: number;
  total: number;
}

export interface BookingReview {
  id: string;
  rating: number;
  subRatings?: {
    punctuality: number;
    craftsmanship: number;
    cleanliness: number;
  };
  comment: string;
  tags: string[];
  recommend: boolean;
  tipAmount?: number;
  createdAt: string;
}

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'pay_on_completion';
export type PaymentStatus = 'paid' | 'authorized' | 'pending' | 'refunded';

export interface CardPaymentDetails {
  brand: 'visa' | 'mastercard' | 'amex' | 'generic';
  last4: string;
  expMonth: string;
  expYear: string;
  cardholderName: string;
  transactionId: string;
  paidAt: string;
}

export interface BookingPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  card?: CardPaymentDetails;
  paidAt: string;
  receiptNumber: string;
}

export interface GardenJobBooking {
  id: string;
  bookingRef: string;
  serviceId?: string;
  serviceTitle: string;
  customJobTitle?: string;
  gardenerId?: string;
  gardenerName?: string;
  yardSize: YardSize;
  yardSqFt: number;
  lawnHeight: LawnHeight;
  wasteHandling: WasteHandling;
  frequency: BookingFrequency;
  scheduledDate: string;
  timeSlot: string;
  status: BookingStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    accessNotes: string;
  };
  notes?: string;
  pricing: BookingPricing;
  createdAt: string;
  payment?: BookingPayment;
  review?: BookingReview;
}

export interface JobBid {
  gardenerId: string;
  gardenerName: string;
  gardenerRating: number;
  quoteAmount: number;
  estimatedHours: number;
  availableDate: string;
  proposalNote: string;
}

export interface CustomJobRequest {
  id: string;
  title: string;
  category: string;
  yardSize: YardSize;
  description: string;
  budgetRange: string;
  preferredDate: string;
  postcode: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status: 'open' | 'assigned' | 'completed';
  bids: JobBid[];
  createdAt: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  amount: number;
}

export interface CustomerQuote {
  id: string;
  quoteRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  propertyAddress: string;
  postcode: string;
  serviceTitle: string;
  description: string;
  items: QuoteLineItem[];
  totalAmount: number;
  estimatedHours: number;
  proposedDate: string;
  validDays: number;
  notes?: string;
  status: 'sent' | 'accepted' | 'declined' | 'converted';
  createdAt: string;
  sentBy: string;
}

export interface GardenerApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  experienceYears: number;
  primaryService: string;
  postcode: string;
  hasInsurance: boolean;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  notes?: string;
}

export interface WorkGalleryItem {
  id: string;
  title: string;
  category: ServiceCategory | 'transformation' | 'general';
  imageUrl: string;
  beforeImageUrl?: string;
  location: string;
  description: string;
  completedDate?: string;
  gardenerName?: string;
}
