import React from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { ShieldCheck, Award, CheckCircle2, Phone, Star, MapPin, Sparkles } from 'lucide-react';
import { GardeningService, YardSize } from '../types/gardening';
import { BusinessLogo } from './BusinessLogo';

interface HeroSectionProps {
  services?: GardeningService[];
  onStartBooking?: (serviceId?: string, yardSize?: YardSize, postcode?: string) => void;
  onCallToBookQuote?: (details?: any) => void;
  onNavigateToEstimator?: () => void;
  onNavigateToGardeners?: () => void;
  onSeeOurWork?: () => void;
  businessName?: string;
  supportPhone?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCallToBookQuote,
  onSeeOurWork,
  businessName = 'Verdant',
  supportPhone = '+44 20 7946 0912'
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100">
      {/* Background garden image with subtle darkening */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Green residential garden lawn and flower borders"
          className="w-full h-full object-cover opacity-30 object-center filter saturate-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-900/50" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          {/* Side-aligned text in portrait orientation */}
          <div className="w-full max-w-md sm:max-w-lg bg-stone-950/80 sm:bg-stone-950/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-9 border border-white/15 shadow-2xl text-left">
            {/* Logo and trust badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600/50 text-emerald-300 text-xs font-medium mb-5 shadow-sm">
              <BusinessLogo size="xs" businessName={businessName} />
              <span className="font-bold text-white">{businessName}</span>
              <span className="text-emerald-500" aria-hidden="true">·</span>
              <span>Call to Book Quote</span>
            </div>

            {/* Main Heading in portrait typography */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white mb-4 leading-[1.15]">
              Call to book a local gardener & lock in your quote
            </h1>

            {/* Subheading text */}
            <p className="text-sm sm:text-base text-stone-200 mb-6 font-light leading-relaxed">
              Reliable help with lawn mowing, hedge trimming, weeding, and garden cleanups.
              Speak directly with our team for transparent pricing, vetted local pros, and no hidden fees.
            </p>

            {/* Action buttons stacked in portrait flow */}
            <div className="flex flex-col gap-2.5 mb-6">
              <button
                type="button"
                onClick={() => onCallToBookQuote?.()}
                className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-900/40 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-200" />
                <span>Call to Book Quote</span>
              </button>

              <button
                type="button"
                onClick={() => onSeeOurWork?.()}
                className="w-full py-3 px-5 bg-white/12 hover:bg-white/20 active:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs group shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>See Our Work</span>
              </button>

              <a
                href={`tel:${supportPhone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 bg-stone-900/60 hover:bg-stone-900/80 text-stone-300 hover:text-white font-medium text-xs rounded-xl border border-white/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="text-stone-400">Direct line:</span>
                <span className="text-emerald-300 font-mono font-bold text-xs">{supportPhone}</span>
              </a>
            </div>

            {/* Vertical portrait checklist of guarantees */}
            <div className="space-y-2.5 pt-5 border-t border-white/15 text-xs text-stone-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Fully Insured Gardeners (£2M Public Liability)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Vetted Local Professionals & RHS Trained</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>

          {/* Complementary Portrait Image Card on Desktop alongside side-aligned text */}
          <div className="hidden lg:flex flex-col w-80 xl:w-96 rounded-3xl overflow-hidden border border-white/20 bg-stone-950/70 backdrop-blur-md shadow-2xl shrink-0">
            {/* Portrait Aspect Ratio Image (3:4) */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img
                src={HERO_IMAGE}
                alt="Professional gardening transformation"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

              {/* Floating Top Rating Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.96 Rating</span>
                  <span className="text-stone-400 text-[11px]">(240+ reviews)</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-white/15 text-white">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>London & Local Boroughs</span>
                </div>
                <p className="text-xs text-stone-200 italic mb-2">
                  "Lawn looks immaculate and cleared up every single clipping."
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1.5 border-t border-white/10">
                  <span>Available this week</span>
                  <button
                    type="button"
                    onClick={() => onSeeOurWork?.()}
                    className="text-emerald-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>See Our Work →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
