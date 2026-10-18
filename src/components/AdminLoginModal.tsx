import React, { useState } from 'react';
import { ShieldCheck, X, ArrowRight, User, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onOpenFullLoginPage?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
  onLogin,
  onLogout,
  onOpenFullLoginPage
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = currentUserEmail?.toLowerCase() === 'kairowood@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!passwordInput) {
      setErrorMsg('Please enter your password.');
      return;
    }

    onLogin(cleanEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-serif font-bold text-white">
              Account Sign In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {currentUserEmail ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                  Signed in as:
                </span>
                <div className="font-mono font-bold text-stone-900 text-sm">
                  {currentUserEmail}
                </div>
                <div className="text-emerald-700 font-semibold mt-1">
                  {isAdmin ? '✓ Administrator Account' : 'Customer Account'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Enter your account email and password to access your bookings and services.
              </p>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. claire@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      className="w-full text-xs p-2.5 pr-8 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {onOpenFullLoginPage && (
                <div className="text-center pt-1 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullLoginPage();
                    }}
                    className="text-[11px] text-emerald-800 hover:underline font-semibold"
                  >
                    Open dedicated login page →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
