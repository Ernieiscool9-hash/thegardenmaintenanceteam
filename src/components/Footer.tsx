import React from 'react';
import { Phone, Mail, Clock, MapPin, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';
import { PlatformConfig } from '../types/gardening';
import { BusinessLogo } from './BusinessLogo';

interface FooterProps {
  onNavigate: (tab: 'services' | 'our-work' | 'estimator' | 'gardeners' | 'my-bookings' | 'gardener-portal' | 'admin' | 'login') => void;
  platformConfig?: PlatformConfig;
  isAdmin?: boolean;
  onOpenAuthModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  platformConfig,
  isAdmin,
  onOpenAuthModal
}) => {
  const businessName = platformConfig?.businessName || 'Verdant';
  const phone = platformConfig?.supportPhone || '+44 20 7946 0912';
  const email = platformConfig?.supportEmail || `support@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'verdant'}.co.uk`;
  const hours = platformConfig?.supportHours || 'Mon – Sun · 8am – 6pm';
  const locations = platformConfig?.serviceLocations || [
    'Highbury & Islington (N1, N5)',
    'Hampstead & Highgate (NW3, N6)',
    'Richmond & Kew (TW9, TW10)',
    'Dulwich & Greenwich (SE21, SE10)',
    'Wimbledon & Putney (SW19, SW15)',
    'St Albans & Harpenden (AL1, AL5)'
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Customer Support */}
        <div className="space-y-3">
          <div className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
            <BusinessLogo size="sm" businessName={businessName} />
            <span>{businessName}</span>
          </div>
          <p className="text-stone-400 leading-relaxed text-xs">
            Friendly, dependable gardening services for your home. Simple upfront prices and vetted local gardeners.
          </p>

          {/* Dynamic Customer Support Channels */}
          <div className="pt-2 space-y-2 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono font-bold text-white">{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-[11px]">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <span>{hours}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-3">
            Quick Links
          </span>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button
                onClick={() => onNavigate('services')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Gardening Services
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('our-work')}
                className="hover:text-white transition-colors cursor-pointer text-emerald-400 font-medium"
              >
                See Our Work (Portfolio)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('gardeners')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Vetted Gardeners
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('estimator')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Price Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('my-bookings')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                My Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('login')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Customer Sign In
              </button>
            </li>

            {/* STRICTLY HIDDEN TO CUSTOMERS */}
            {isAdmin && (
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Admin Dashboard
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Service Locations (Dynamic) */}
        <div className="md:col-span-2">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-3">
            Locations We Serve ({locations.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-400 text-xs">
            {locations.slice(0, 8).map((loc, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{loc}</span>
              </div>
            ))}
          </div>
          {locations.length > 8 && (
            <div className="text-[11px] text-stone-500 mt-2">
              + {locations.length - 8} more neighborhoods served
            </div>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Verdant Gardening Co. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Fair Upfront Pricing</span>
            <span aria-hidden="true">·</span>
            <span>Fully Insured Gardeners</span>
            <span aria-hidden="true">·</span>
            <span>Customer Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
