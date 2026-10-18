import React, { useState } from 'react';
import { GARDENING_SERVICES, VETTED_GARDENERS } from '../data/mockData';
import {
  GardeningService,
  GardenerProfile,
  YardSize,
  LawnHeight,
  WasteHandling,
  BookingFrequency,
  GardenJobBooking,
  BookingPayment,
  CardPaymentDetails,
  PaymentMethod,
  PlatformConfig
} from '../types/gardening';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  Sparkles,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (newBooking: GardenJobBooking) => void;
  services?: GardeningService[];
  currentUserEmail?: string | null;
  platformConfig?: PlatformConfig;
  initialServiceId?: string;
  initialGardenerId?: string;
  initialYardSize?: YardSize;
  initialPostcode?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onBookingConfirmed,
  services = GARDENING_SERVICES,
  currentUserEmail,
  platformConfig,
  initialServiceId = 'lawn-care',
  initialGardenerId,
  initialYardSize = 'medium',
  initialPostcode = 'N5 2UP'
}) => {
  const [step, setStep] = useState<number>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<GardenJobBooking | null>(null);

  // Form states
  const [serviceId, setServiceId] = useState<string>(initialServiceId);
  const [gardenerId, setGardenerId] = useState<string>(initialGardenerId || 'auto_match');
  const [yardSize, setYardSize] = useState<YardSize>(initialYardSize);
  const [lawnHeight, setLawnHeight] = useState<LawnHeight>('tidy');
  const [wasteHandling, setWasteHandling] = useState<WasteHandling>('removal_haul');
  const [frequency, setFrequency] = useState<BookingFrequency>('one_off');

  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatDateStr = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  const dateOptions = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + 1 + offset);
    return {
      dateString: d.toISOString().split('T')[0],
      display: formatDateStr(d),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].display);
  const [timeSlot, setTimeSlot] = useState<string>('Morning (09:00 - 12:00)');

  // Access & Address
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('London');
  const [postcode, setPostcode] = useState<string>(initialPostcode || 'N5 2UP');
  const [accessNotes, setAccessNotes] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUserEmail || '');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Card & Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [billingPostcode, setBillingPostcode] = useState<string>('');
  const [saveCardForFuture, setSaveCardForFuture] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  const detectCardBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'generic' => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'generic';
  };

  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setCardExpiry(clean);
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCardholderName(customerName || 'Claire Watson');
    setBillingPostcode(postcode || 'N5 2UP');
  };

  const handleProceedToPayment = () => {
    setFormValidationError(null);
    if (!street.trim()) {
      setFormValidationError('Please enter your street address.');
      return;
    }
    if (!customerName.trim()) {
      setFormValidationError('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setFormValidationError('Please enter a valid email address for receipt delivery.');
      return;
    }
    if (!customerPhone.trim()) {
      setFormValidationError('Please enter your contact phone number.');
      return;
    }

    if (!cardholderName.trim()) {
      setCardholderName(customerName.trim());
    }
    if (!billingPostcode.trim()) {
      setBillingPostcode(postcode.trim());
    }

    setStep(5);
  };

  if (!isOpen) return null;

  const activeServices = services.length > 0 ? services : GARDENING_SERVICES;
  const currentService = activeServices.find(s => s.id === serviceId) || activeServices[0];
  const assignedGardener = gardenerId !== 'auto_match'
    ? VETTED_GARDENERS.find(g => g.id === gardenerId)
    : VETTED_GARDENERS[0]; // fallback top gardener

  // Pricing math
  const sizeMultipliers: Record<YardSize, number> = {
    small: 1.0,
    medium: 1.45,
    large: 2.1,
    estate: 3.2
  };
  const conditionMultipliers: Record<LawnHeight, number> = {
    tidy: 0,
    overgrown: 0.25,
    jungle: 0.60
  };
  const wasteCosts: Record<WasteHandling, number> = {
    removal_haul: 18,
    green_bin: 5,
    compost_onsite: 0
  };

  const basePrice = currentService.basePrice;
  const sizeMultiplierAmount = Math.round(basePrice * (sizeMultipliers[yardSize] - 1));
  const subtotal = basePrice + sizeMultiplierAmount;
  const conditionSurcharge = Math.round(subtotal * conditionMultipliers[lawnHeight]);
  const wasteDisposalAmount = wasteCosts[wasteHandling];
  const gross = subtotal + conditionSurcharge + wasteDisposalAmount;

  let discountPct = 0;
  if (frequency === 'biweekly') discountPct = 0.15;
  if (frequency === 'monthly') discountPct = 0.10;
  const frequencyDiscount = Math.round(gross * discountPct * 100) / 100;
  const total = Math.max(30, Math.round((gross - frequencyDiscount) * 100) / 100);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const bookingRef = `VRD-${Math.floor(1000 + Math.random() * 9000)}`;

      const paymentRecord: BookingPayment = {
        method: 'pay_on_completion',
        status: 'pending',
        amount: total,
        currency: 'GBP',
        paidAt: '',
        receiptNumber: `INV-${bookingRef}`
      };

      const newBooking: GardenJobBooking = {
        id: `book-${Date.now()}`,
        bookingRef,
        serviceId: currentService.id,
        serviceTitle: currentService.title,
        gardenerId: gardenerId === 'auto_match' ? assignedGardener?.id : gardenerId,
        gardenerName: gardenerId === 'auto_match' ? `${assignedGardener?.name} (Auto-Matched)` : assignedGardener?.name,
        yardSize,
        yardSqFt: yardSize === 'small' ? 400 : yardSize === 'medium' ? 1200 : yardSize === 'large' ? 2600 : 4500,
        lawnHeight,
        wasteHandling,
        frequency,
        scheduledDate: `${selectedDate}`,
        timeSlot,
        status: 'scheduled',
        customerName,
        customerEmail,
        customerPhone,
        address: {
          street,
          city,
          postcode,
          accessNotes
        },
        notes: specialNotes,
        pricing: {
          baseAmount: basePrice,
          sizeMultiplierAmount,
          conditionSurcharge,
          wasteDisposalAmount,
          frequencyDiscount,
          total
        },
        createdAt: new Date().toISOString().split('T')[0],
        payment: paymentRecord
      };

      setConfirmedBooking(newBooking);
      onBookingConfirmed(newBooking);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Banner */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Garden Job Booking
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              {confirmedBooking ? 'Booking Confirmed' : currentService.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Confirmed Screen */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-1">
                Booking Reference
              </div>
              <div className="text-3xl font-serif font-bold text-stone-900">
                {confirmedBooking.bookingRef}
              </div>
              <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
                Your gardening appointment has been locked in. We have notified {confirmedBooking.gardenerName}.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-500">Service:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Assigned Pro:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.gardenerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.scheduledDate} · {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Address:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.address.street}, {confirmedBooking.address.postcode}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-stone-900 font-bold">
                <span>Total Guaranteed Price:</span>
                <span className="font-mono tabular-nums text-emerald-800 text-sm">£{confirmedBooking.pricing.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 max-w-md mx-auto text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct settlement: No online payment taken today. Settle directly with your gardener upon job completion.</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Go to My Bookings Hub
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Indicators (5 Steps) */}
            <div className="bg-stone-100/70 px-4 sm:px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 overflow-x-auto">
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>
                  1
                </span>
                <span className={step === 1 ? 'font-bold text-stone-900' : ''}>Specs</span>
              </div>
              <div className="w-3 sm:w-6 h-px bg-stone-300 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>
                  2
                </span>
                <span className={step === 2 ? 'font-bold text-stone-900' : ''}>Gardener</span>
              </div>
              <div className="w-3 sm:w-6 h-px bg-stone-300 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>
                  3
                </span>
                <span className={step === 3 ? 'font-bold text-stone-900' : ''}>Schedule</span>
              </div>
              <div className="w-3 sm:w-6 h-px bg-stone-300 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>
                  4
                </span>
                <span className={step === 4 ? 'font-bold text-stone-900' : ''}>Details</span>
              </div>
              <div className="w-3 sm:w-6 h-px bg-stone-300 shrink-0" />
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 5 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>
                  5
                </span>
                <span className={step === 5 ? 'font-bold text-stone-900' : ''}>Confirmation</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[68vh] overflow-y-auto">
              {/* STEP 1: Specs */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                      Change Service
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-800"
                    >
                      {activeServices.map(s => (
                        <option key={s.id} value={s.id}>{s.title} (from £{s.basePrice})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                      Garden Dimensions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['small', 'medium', 'large', 'estate'] as YardSize[]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setYardSize(sz)}
                          className={`p-2.5 text-xs rounded-xl border text-center cursor-pointer transition-all ${
                            yardSize === sz
                              ? 'border-emerald-900 bg-emerald-900 text-white font-semibold'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="capitalize">{sz}</div>
                          <div className={`text-[10px] ${yardSize === sz ? 'text-emerald-200' : 'text-stone-400'}`}>
                            {sz === 'small' ? '<500 sq ft' : sz === 'medium' ? '500-1.8k' : sz === 'large' ? '1.8k-3.5k' : '3.5k+ sq ft'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                      Growth Condition
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'tidy', label: 'Tidy', sub: 'Standard maintenance' },
                        { id: 'overgrown', label: 'Tall Growth', sub: 'Knee-height brush' },
                        { id: 'jungle', label: 'Heavy Jungle', sub: 'Brambles & woody vines' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLawnHeight(item.id as LawnHeight)}
                          className={`p-2.5 text-xs rounded-xl border text-center cursor-pointer transition-all ${
                            lawnHeight === item.id
                              ? 'border-emerald-800 bg-emerald-50 text-stone-900 font-semibold'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-[10px] text-stone-500">{item.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                      Green Waste Disposal
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'removal_haul', label: 'Vehicle Haul-Away', cost: '+£18' },
                        { id: 'green_bin', label: 'Your Council Bin', cost: '+£5' },
                        { id: 'compost_onsite', label: 'Compost On-Site', cost: 'Free' }
                      ].map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setWasteHandling(w.id as WasteHandling)}
                          className={`p-2.5 text-xs rounded-xl border text-center cursor-pointer transition-all ${
                            wasteHandling === w.id
                              ? 'border-emerald-800 bg-emerald-50 text-stone-900 font-semibold'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div>{w.label}</div>
                          <div className="text-[10px] font-mono text-stone-500">{w.cost}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Gardener Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-xs text-stone-600 mb-3">
                    Choose who will take care of your garden:
                  </div>

                  {/* Auto-match option */}
                  <div
                    onClick={() => setGardenerId('auto_match')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      gardenerId === 'auto_match'
                        ? 'border-emerald-800 bg-emerald-50/70 text-stone-900 ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          Auto-Match Fastest Available Pro
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Instant confirmation · Matches top-rated gardener nearest your postcode
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800">
                      Recommended
                    </span>
                  </div>

                  {/* Named Gardeners */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2">
                      Or Select a Specific Local Pro:
                    </span>
                    <div className="space-y-2">
                      {VETTED_GARDENERS.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => setGardenerId(g.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            gardenerId === g.id
                              ? 'border-emerald-800 bg-emerald-50/70 text-stone-900 ring-1 ring-emerald-700'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-stone-900 text-emerald-300 flex items-center justify-center font-serif font-bold text-sm">
                              {g.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900">{g.name}</div>
                              <div className="text-[11px] text-stone-500">
                                {g.location} · {g.rating} ★ ({g.reviewsCount} jobs) · £{g.hourlyRate}/hr
                              </div>
                            </div>
                          </div>
                          {gardenerId === g.id && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Schedule */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                      Select Date (Upcoming 7 Days)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.dateString}
                          type="button"
                          onClick={() => setSelectedDate(opt.display)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedDate === opt.display
                              ? 'border-emerald-900 bg-emerald-900 text-white font-semibold'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="text-xs">{opt.display}</div>
                          {opt.isWeekend && (
                            <div className={`text-[10px] mt-0.5 ${selectedDate === opt.display ? 'text-emerald-200' : 'text-stone-400'}`}>
                              Weekend Slot
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                      Arrival Window
                    </label>
                    <div className="space-y-2">
                      {[
                        { slot: 'Morning (09:00 - 12:00)', note: 'Cooler morning dew, ideal for lawn cut & edging' },
                        { slot: 'Midday (12:00 - 15:00)', note: 'Great for hedge trimming and waste clearance' },
                        { slot: 'Afternoon (15:00 - 18:00)', note: 'Late afternoon slot, completed before dusk' }
                      ].map((item) => (
                        <button
                          key={item.slot}
                          type="button"
                          onClick={() => setTimeSlot(item.slot)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                            timeSlot === item.slot
                              ? 'border-emerald-800 bg-emerald-50 text-stone-900 font-semibold ring-1 ring-emerald-700/50'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-stone-900">{item.slot}</div>
                            <div className="text-[11px] text-stone-500">{item.note}</div>
                          </div>
                          {timeSlot === item.slot && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Address & Review */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. 14 Elmwood Crescent"
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                        placeholder="e.g. N5 2UP"
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Access Instructions (Gate lock, pets, outdoor tap)
                    </label>
                    <input
                      type="text"
                      value={accessNotes}
                      onChange={(e) => setAccessNotes(e.target.value)}
                      placeholder="e.g. Side gate unlocked, dogs inside house"
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Claire Watson"
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Email (For Receipt)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. claire@example.com"
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Phone (Arrival SMS)
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 07700 900142"
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Specific Notes for Gardener (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Please take extra care around the newly planted hydrangeas near the patio."
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>

                  {/* Price Summary Breakdown */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Service base ({currentService.title}):</span>
                      <span className="font-mono tabular-nums">£{basePrice.toFixed(2)}</span>
                    </div>
                    {sizeMultiplierAmount > 0 && (
                      <div className="flex justify-between text-stone-600">
                        <span>Yard scale adjustment ({yardSize}):</span>
                        <span className="font-mono tabular-nums">+£{sizeMultiplierAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {conditionSurcharge > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Overgrowth surcharge ({lawnHeight}):</span>
                        <span className="font-mono tabular-nums">+£{conditionSurcharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-600">
                      <span>Green waste handling:</span>
                      <span className="font-mono tabular-nums">+£{wasteDisposalAmount.toFixed(2)}</span>
                    </div>
                    {frequencyDiscount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Routine discount ({frequency}):</span>
                        <span className="font-mono tabular-nums">-£{frequencyDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-stone-200 text-stone-900 font-bold text-sm">
                      <span>Total Guaranteed Price:</span>
                      <span className="font-mono tabular-nums text-emerald-900 text-base">£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Direct Settlement Confirmation */}
              {step === 5 && (
                <div className="space-y-5">
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <span>Zero Online Payment — Pay Upon Completion</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      All online card checkouts are removed. You pay directly after your gardener completes the work to your full satisfaction via cash, direct bank transfer, or invoice.
                    </p>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs space-y-2.5">
                    <div className="flex justify-between text-stone-600">
                      <span>Service:</span>
                      <strong className="text-stone-900">{currentService.title}</strong>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Property Location:</span>
                      <strong className="text-stone-900">{street || "Customer address"}, {postcode}</strong>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Scheduled Slot:</span>
                      <strong className="text-stone-900">{selectedDate} ({timeSlot})</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-stone-200 text-stone-900 font-bold text-sm">
                      <span>Agreed Total (Pay After Service):</span>
                      <span className="font-mono text-emerald-900 font-bold text-base">£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Controls */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Confirmation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Confirm Booking (£0 Online)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
