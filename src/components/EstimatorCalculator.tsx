import React, { useState, useMemo } from 'react';
import { GARDENING_SERVICES } from '../data/mockData';
import { YardSize, LawnHeight, WasteHandling, BookingFrequency, GardeningService } from '../types/gardening';
import { Check, ArrowRight, Sparkles, CheckCircle2, Phone } from 'lucide-react';

interface EstimatorCalculatorProps {
  services?: GardeningService[];
  initialServiceId?: string;
  onBookWithEstimate: (estimateData: {
    serviceId: string;
    yardSize: YardSize;
    lawnHeight: LawnHeight;
    wasteHandling: WasteHandling;
    frequency: BookingFrequency;
    addOns: string[];
    pricing: {
      baseAmount: number;
      sizeMultiplierAmount: number;
      conditionSurcharge: number;
      wasteDisposalAmount: number;
      frequencyDiscount: number;
      total: number;
    };
  }) => void;
}

export const EstimatorCalculator: React.FC<EstimatorCalculatorProps> = ({
  services = GARDENING_SERVICES,
  initialServiceId = 'lawn-care',
  onBookWithEstimate
}) => {
  const [serviceId, setServiceId] = useState<string>(initialServiceId);
  const [yardSize, setYardSize] = useState<YardSize>('medium');
  const [frequency, setFrequency] = useState<BookingFrequency>('one_off');
  const [includeWasteRemoval, setIncludeWasteRemoval] = useState<boolean>(true);

  // Fallback if selected service was deleted or not in list
  const activeServiceList = services.length > 0 ? services : GARDENING_SERVICES;
  const currentService = useMemo(() => {
    return activeServiceList.find(s => s.id === serviceId) || activeServiceList[0];
  }, [activeServiceList, serviceId]);

  // Clean size multipliers
  const sizeConfig = {
    small: { multiplier: 1.0, label: 'Small Garden', desc: 'Up to 500 sq ft (small patio/terrace lawn)' },
    medium: { multiplier: 1.35, label: 'Medium Garden', desc: '500 – 1,500 sq ft (standard residential garden)' },
    large: { multiplier: 1.85, label: 'Large Garden', desc: '1,500 – 3,500 sq ft (spacious front & back lawn)' },
    estate: { multiplier: 2.5, label: 'Very Large / Acreage', desc: 'Over 3,500 sq ft (large grounds)' }
  };

  const pricing = useMemo(() => {
    const base = currentService.basePrice;
    const sizeMultiplierAmount = Math.round(base * (sizeConfig[yardSize].multiplier - 1));
    const wasteDisposalAmount = includeWasteRemoval ? 15 : 0;
    const subtotal = base + sizeMultiplierAmount + wasteDisposalAmount;

    let discountPct = 0;
    if (frequency === 'biweekly') discountPct = 0.15;
    if (frequency === 'monthly') discountPct = 0.10;

    const frequencyDiscount = Math.round(subtotal * discountPct);
    const total = Math.max(30, subtotal - frequencyDiscount);

    return {
      baseAmount: base,
      sizeMultiplierAmount,
      conditionSurcharge: 0,
      wasteDisposalAmount,
      frequencyDiscount,
      total
    };
  }, [currentService, yardSize, frequency, includeWasteRemoval]);

  const handleBook = () => {
    onBookWithEstimate({
      serviceId,
      yardSize,
      lawnHeight: 'tidy',
      wasteHandling: includeWasteRemoval ? 'removal_haul' : 'green_bin',
      frequency,
      addOns: includeWasteRemoval ? ['waste-haul'] : [],
      pricing
    });
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
          Instant Price Calculator
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold mb-2">
          Get an instant price estimate
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          Select your garden size and service for a clear, upfront estimate. No obligation to book.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="md:col-span-7 space-y-6">
          {/* Step 1: Service */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              1. Choose Service
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activeServiceList.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    serviceId === s.id
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div className="text-xs font-semibold">{s.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5 font-normal">from £{s.basePrice}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Garden Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              2. Garden Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['small', 'medium', 'large', 'estate'] as YardSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setYardSize(sz)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    yardSize === sz
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold capitalize">{sz}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {sz === 'small' ? '< 500 sq ft' : sz === 'medium' ? 'Standard' : sz === 'large' ? 'Spacious' : '3,500+ sq ft'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Frequency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              3. How Often?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'one_off', label: 'One-Time Job', desc: 'Standard rate' },
                { id: 'biweekly', label: 'Every 2 Weeks', desc: 'Save 15%' },
                { id: 'monthly', label: 'Once a Month', desc: 'Save 10%' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequency(f.id as BookingFrequency)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    frequency === f.id
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Waste removal toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeWasteRemoval}
                onChange={(e) => setIncludeWasteRemoval(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-700"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-900">Include Green Waste Removal (+£15)</span>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  We bag and haul away all trimmings and cuttings for licensed recycling.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Summary: 5 cols */}
        <div className="md:col-span-5 bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
              Estimated Total
            </span>
            <div className="text-4xl font-serif font-bold text-stone-900 font-mono">
              £{pricing.total}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {frequency === 'one_off' ? 'For a single visit' : 'Per visit scheduled'}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200 pt-3">
            <div className="flex justify-between">
              <span>{currentService.title}</span>
              <span className="font-medium text-stone-900">£{pricing.baseAmount}</span>
            </div>
            {pricing.sizeMultiplierAmount > 0 && (
              <div className="flex justify-between">
                <span>Garden size adjustment</span>
                <span className="font-medium text-stone-900">+£{pricing.sizeMultiplierAmount}</span>
              </div>
            )}
            {includeWasteRemoval && (
              <div className="flex justify-between">
                <span>Green waste removal</span>
                <span className="font-medium text-stone-900">+£15</span>
              </div>
            )}
            {pricing.frequencyDiscount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Repeat discount</span>
                <span>-£{pricing.frequencyDiscount}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleBook}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Call to Book this Quote (£{pricing.total})</span>
            </button>
          </div>

          <div className="space-y-1 text-[11px] text-stone-500 pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No payment taken now — pay after completion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free cancellation up to 24h before</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
