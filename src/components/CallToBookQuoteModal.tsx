import React, { useState } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  User,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PlatformConfig, CustomJobRequest } from '../types/gardening';
import { BusinessLogo } from './BusinessLogo';

interface CallToBookQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformConfig: PlatformConfig;
  inquiryDetails?: {
    serviceTitle?: string;
    estimatedPrice?: number;
    yardSize?: string;
    postcode?: string;
  } | null;
  onRequestCallback?: (inquiry: {
    name: string;
    phone: string;
    postcode: string;
    serviceTitle: string;
    notes?: string;
  }) => void;
}

export const CallToBookQuoteModal: React.FC<CallToBookQuoteModalProps> = ({
  isOpen,
  onClose,
  platformConfig,
  inquiryDetails,
  onRequestCallback
}) => {
  const businessName = platformConfig.businessName || 'Verdant';
  const supportPhone = platformConfig.supportPhone || '+44 20 7946 0912';
  const emergencyPhone = platformConfig.emergencyHotline || '+44 20 7946 0999';
  const hours = platformConfig.supportHours || 'Mon – Sun · 8:00 AM – 6:00 PM';

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPostcode, setClientPostcode] = useState(inquiryDetails?.postcode || 'N5 2UP');
  const [clientNotes, setClientNotes] = useState('');
  const [callbackSent, setCallbackSent] = useState(false);

  if (!isOpen) return null;

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    if (onRequestCallback) {
      onRequestCallback({
        name: clientName.trim(),
        phone: clientPhone.trim(),
        postcode: clientPostcode.trim(),
        serviceTitle: inquiryDetails?.serviceTitle || 'General Garden Quote',
        notes: clientNotes.trim()
      });
    }

    setCallbackSent(true);
    setTimeout(() => {
      setCallbackSent(false);
      onClose();
    }, 4000);
  };

  const rawPhone = supportPhone.replace(/\s+/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-950 text-white p-6 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <BusinessLogo size="sm" businessName={businessName} />
            <div className="text-xs uppercase font-mono font-semibold tracking-wider text-emerald-300">
              {businessName} Direct Quote Line
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
            Call to Book Your Quote
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            Online checkout is paused so our team can provide tailored, exact quotes. Speak with our head gardener for a free 5-minute phone quote.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* Inquiry Context if opened from a specific service */}
          {inquiryDetails?.serviceTitle && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Requested Quote For:
                </span>
                <span className="font-bold text-emerald-950 text-sm">
                  {inquiryDetails.serviceTitle}
                </span>
                {inquiryDetails.postcode && (
                  <span className="text-emerald-700 text-[11px] block mt-0.5">
                    Location: {inquiryDetails.postcode}
                  </span>
                )}
              </div>
              {inquiryDetails.estimatedPrice && (
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 block">Est. Range</span>
                  <span className="font-mono font-bold text-emerald-900 text-base">
                    ~£{inquiryDetails.estimatedPrice}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Primary Phone Action Card */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
              <PhoneCall className="w-7 h-7 text-emerald-300 animate-pulse" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
                Direct Booking & Quotations Desk
              </div>
              <a
                href={`tel:${rawPhone}`}
                className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 hover:text-emerald-700 transition-colors block font-mono"
              >
                {supportPhone}
              </a>
              <div className="text-xs text-stone-500 flex items-center justify-center gap-1.5 mt-2">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{hours}</span>
              </div>
            </div>

            <a
              href={`tel:${rawPhone}`}
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Tap to Call {supportPhone}</span>
            </a>

            <div className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free quote · Zero obligation · Friendly local advice</span>
            </div>
          </div>

          {/* Quick Callback Request Option */}
          <div className="border-t border-stone-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Or Request a Free Call Back
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Leave your number and our head gardener will ring you right back.
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>

            {callbackSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 text-emerald-950 animate-fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold text-xs">Call Back Requested!</div>
                <div className="text-[11px] text-emerald-800">
                  We have received your number and will call you within 15 minutes.
                </div>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Your Phone Number"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={clientPostcode}
                    onChange={(e) => setClientPostcode(e.target.value)}
                    placeholder="Postcode (e.g. N1)"
                    className="sm:col-span-1 w-full px-3 py-2 text-xs font-mono uppercase border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Brief note (e.g. 20m hedge, lawn)"
                    className="sm:col-span-2 w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Request Call Back for Quote</span>
                </button>
              </form>
            )}
          </div>

          {/* Hotline footer */}
          <div className="text-[11px] text-stone-400 text-center pt-2">
            Urgent storm damage or hazardous fallen branches? Direct line:{' '}
            <a href={`tel:${emergencyPhone.replace(/\s+/g, '')}`} className="text-emerald-800 font-bold hover:underline">
              {emergencyPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
