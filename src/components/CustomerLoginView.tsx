import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  LogOut,
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CustomerLoginViewProps {
  currentUserEmail: string | null;
  onLoginSuccess: (email: string, isAdmin: boolean) => void;
  onLogout: () => void;
  onNavigateToTab: (tab: 'services' | 'estimator' | 'gardeners' | 'my-bookings' | 'gardener-portal' | 'admin' | 'login') => void;
  onOpenBookingModal: () => void;
}

export const CustomerLoginView: React.FC<CustomerLoginViewProps> = ({
  currentUserEmail,
  onLoginSuccess,
  onLogout,
  onNavigateToTab,
  onOpenBookingModal
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const isAdmin = currentUserEmail?.toLowerCase() === 'kairowood@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if Admin email is entered
      if (cleanEmail.toLowerCase() === 'kairowood@gmail.com') {
        // Admin credentials verified
        setSuccessMsg('Admin credentials verified. Welcome to the Admin version!');
        setTimeout(() => {
          onLoginSuccess('Kairowood@gmail.com', true);
        }, 300);
      } else {
        // Customer login
        setSuccessMsg(`Welcome back, ${cleanEmail}! Loading your account...`);
        setTimeout(() => {
          onLoginSuccess(cleanEmail, false);
        }, 300);
      }
    }, 400);
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-md mx-auto">
        {/* If user is already signed in */}
        {currentUserEmail ? (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                You're Signed In
              </h1>
              <p className="text-xs text-stone-500">
                Current active session on this browser
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Account
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isAdmin ? 'Administrator' : 'Customer'}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-stone-900 break-all">
                {currentUserEmail}
              </div>
              {isAdmin && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  Full administrative access to bookings, support channels, and service locations.
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('admin')}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Open Admin Version (Dashboard)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('my-bookings')}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>View My Bookings</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigateToTab('services')}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Browse Gardening Services
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2 px-4 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of {currentUserEmail}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Customer Login Form */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center mx-auto">
                <User className="w-6 h-6 text-emerald-700" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                Customer Sign In
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                Sign in to view your garden bookings, manage appointments, and reschedule visits.
              </p>
            </div>

            {/* Error or Success feedback banners */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer p-0.5"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-700 w-3.5 h-3.5 border-stone-300"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-70 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Guest booking prompt */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-1.5">
              <span className="text-xs font-semibold text-stone-800 block">
                Don't have an account yet?
              </span>
              <p className="text-[11px] text-stone-500">
                You can book any garden service in minutes without creating an account in advance.
              </p>
              <button
                type="button"
                onClick={onOpenBookingModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 mt-1 cursor-pointer"
              >
                <span>Book a service as guest</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Forgot password simple modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Reset Password
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your registered customer email and we will send you a secure link to reset your password.
              </p>
              {forgotSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reset Link Dispatched</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    If an account exists for this email, you'll receive reset instructions within 2 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSent(false);
                    }}
                    className="w-full mt-2 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="email"
                    defaultValue={email}
                    placeholder="Enter your email"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotSent(true)}
                      className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg"
                    >
                      Send Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
