import React from 'react';
import { Calendar, Briefcase, ShieldCheck, User, Sparkles, LogIn, LogOut, FileText, Phone } from 'lucide-react';
import { BusinessLogo } from './BusinessLogo';

interface NavbarProps {
  activeTab: 'services' | 'our-work' | 'estimator' | 'gardeners' | 'my-bookings' | 'gardener-portal' | 'admin' | 'login';
  setActiveTab: (tab: 'services' | 'our-work' | 'estimator' | 'gardeners' | 'my-bookings' | 'gardener-portal' | 'admin' | 'login') => void;
  onOpenBooking: () => void;
  onCallToBookQuote?: () => void;
  onOpenCustomJob: () => void;
  bookingsCount: number;
  openRequestsCount: number;
  currentUserEmail: string | null;
  onOpenAuthModal: () => void;
  businessName?: string;
  onOpenQuoteModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onCallToBookQuote,
  bookingsCount,
  currentUserEmail,
  onOpenAuthModal,
  businessName = 'Verdant',
  onOpenQuoteModal
}) => {
  const isAdmin = currentUserEmail?.toLowerCase() === 'kairowood@gmail.com';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 h-16 flex items-center justify-between gap-4">
        {/* Brand with K Logo */}
        <button
          onClick={() => setActiveTab('services')}
          className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-emerald-950 hover:text-emerald-800 transition-colors flex items-center gap-2.5 cursor-pointer"
        >
          <BusinessLogo size="sm" businessName={businessName} />
          <span>{businessName}</span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors hover:text-stone-950 cursor-pointer pb-0.5 ${
              activeTab === 'services'
                ? 'text-emerald-900 font-bold border-b-2 border-emerald-800'
                : ''
            }`}
          >
            Services
          </button>

          <button
            onClick={() => setActiveTab('our-work')}
            className={`transition-colors hover:text-stone-950 cursor-pointer pb-0.5 flex items-center gap-1.5 ${
              activeTab === 'our-work'
                ? 'text-emerald-900 font-bold border-b-2 border-emerald-800'
                : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>See Our Work</span>
          </button>

          <button
            onClick={() => setActiveTab('gardeners')}
            className={`transition-colors hover:text-stone-950 cursor-pointer pb-0.5 ${
              activeTab === 'gardeners'
                ? 'text-emerald-900 font-bold border-b-2 border-emerald-800'
                : ''
            }`}
          >
            Gardeners
          </button>

          <button
            onClick={() => setActiveTab('estimator')}
            className={`transition-colors hover:text-stone-950 cursor-pointer pb-0.5 ${
              activeTab === 'estimator'
                ? 'text-emerald-900 font-bold border-b-2 border-emerald-800'
                : ''
            }`}
          >
            Price Calculator
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`transition-colors hover:text-stone-950 cursor-pointer pb-0.5 flex items-center gap-1.5 ${
              activeTab === 'my-bookings'
                ? 'text-emerald-900 font-bold border-b-2 border-emerald-800'
                : ''
            }`}
          >
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* ADMIN TAB - STRICTLY HIDDEN TO CUSTOMERS */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors cursor-pointer pb-0.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                activeTab === 'admin'
                  ? 'text-emerald-900 font-extrabold border-b-2 border-emerald-800'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account / Login button */}
          {currentUserEmail ? (
            isAdmin ? (
              <>
                {onOpenQuoteModal && (
                  <button
                    onClick={onOpenQuoteModal}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    title="Quote people"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-200" />
                    <span className="hidden sm:inline">Quote People</span>
                    <span className="sm:hidden">Quote</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Signed in as Admin Kairowood@gmail.com"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Admin (Kairowood)</span>
                  <span className="sm:hidden">Admin</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
                title={`Signed in as ${currentUserEmail}`}
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline max-w-[120px] truncate">{currentUserEmail}</span>
                <span className="sm:hidden">Account</span>
              </button>
            )
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'login'
                  ? 'text-emerald-900 font-bold bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-stone-500" />
              <span>Log In</span>
            </button>
          )}

          <button
            onClick={onCallToBookQuote || onOpenBooking}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Call to Book a Quote</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-100 bg-white py-2 px-2 text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'services' ? 'text-emerald-900 font-bold' : ''}`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('our-work')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'our-work' ? 'text-emerald-900 font-bold' : ''}`}
        >
          Our Work
        </button>
        <button
          onClick={() => setActiveTab('gardeners')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'gardeners' ? 'text-emerald-900 font-bold' : ''}`}
        >
          Gardeners
        </button>
        <button
          onClick={() => setActiveTab('estimator')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'estimator' ? 'text-emerald-900 font-bold' : ''}`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`px-2 py-1 whitespace-nowrap flex items-center gap-1 ${activeTab === 'my-bookings' ? 'text-emerald-900 font-bold' : ''}`}
        >
          Bookings ({bookingsCount})
        </button>

        {/* Login or Account for mobile */}
        <button
          onClick={() => setActiveTab('login')}
          className={`px-2 py-1 whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'login' ? 'text-emerald-900 font-bold' : ''
          }`}
        >
          {currentUserEmail ? 'Account' : 'Log In'}
        </button>

        {/* STRICTLY HIDDEN TO CUSTOMERS */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2 py-1 whitespace-nowrap flex items-center gap-1 text-emerald-700 font-bold ${
              activeTab === 'admin' ? 'text-emerald-900 font-extrabold' : ''
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
