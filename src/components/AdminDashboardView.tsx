import React, { useState } from 'react';
import {
  GardenJobBooking,
  GardenerProfile,
  GardeningService,
  BookingStatus,
  PlatformConfig,
  GardenerApplication,
  CustomJobRequest,
  PayoutCardConfig,
  CustomerQuote,
  WorkGalleryItem
} from '../types/gardening';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Users,
  Search,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Building2,
  Sparkles,
  CreditCard,
  Receipt,
  ArrowDownRight,
  Eye,
  EyeOff,
  Zap,
  CheckCheck,
  FileText,
  Send,
  ArrowUpRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { AddServiceModal } from './AddServiceModal';
import { AddPicModal } from './AddPicModal';
import { BusinessLogo } from './BusinessLogo';

interface AdminDashboardViewProps {
  currentUserEmail: string | null;
  onLoginAsAdmin: () => void;
  onLogout: () => void;
  bookings: GardenJobBooking[];
  gardenerApplications?: GardenerApplication[];
  customRequests?: CustomJobRequest[];
  gardeners: GardenerProfile[];
  services: GardeningService[];
  platformConfig: PlatformConfig;
  onUpdatePlatformConfig: (updated: PlatformConfig) => void;
  onUpdateBookingStatus: (id: string, newStatus: BookingStatus) => void;
  onDeleteBooking?: (id: string) => void;
  onClearAllBookings: () => void;
  onClearAllApplications: () => void;
  onUpdateGardener: (updated: GardenerProfile) => void;
  onUpdateServicePrice: (serviceId: string, newBasePrice: number) => void;
  onAddService?: (newService: GardeningService) => void;
  onDeleteService?: (serviceId: string) => void;
  onResetServices?: () => void;
  quotes?: CustomerQuote[];
  onOpenQuoteModal: (req?: CustomJobRequest) => void;
  onConvertQuoteToBooking?: (quote: CustomerQuote) => void;
  onDeleteQuote?: (id: string) => void;
  galleryItems?: WorkGalleryItem[];
  onAddGalleryItem?: (pic: WorkGalleryItem) => void;
  onDeleteGalleryItem?: (id: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUserEmail,
  onLoginAsAdmin,
  onLogout,
  bookings,
  gardenerApplications = [],
  customRequests = [],
  quotes = [],
  gardeners,
  services,
  platformConfig,
  onUpdatePlatformConfig,
  onUpdateBookingStatus,
  onDeleteBooking,
  onClearAllBookings,
  onClearAllApplications,
  onUpdateGardener,
  onUpdateServicePrice,
  onAddService,
  onDeleteService,
  onResetServices,
  onOpenQuoteModal,
  onConvertQuoteToBooking,
  onDeleteQuote,
  galleryItems = [],
  onAddGalleryItem,
  onDeleteGalleryItem
}) => {
  const isAdmin = currentUserEmail?.toLowerCase() === 'kairowood@gmail.com';

  const [activeTab, setActiveTab] = useState<'locations-support' | 'gallery' | 'quotes' | 'bookings' | 'applications' | 'gardeners' | 'pricing'>('locations-support');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddPicModalOpen, setIsAddPicModalOpen] = useState(false);

  // Support & Location form state
  const [businessNameInput, setBusinessNameInput] = useState(platformConfig.businessName || 'Verdant');
  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
  const [nameModalInput, setNameModalInput] = useState(platformConfig.businessName || 'Verdant');
  const [businessNameSuccess, setBusinessNameSuccess] = useState<string | null>(null);

  const [supportPhone, setSupportPhone] = useState(platformConfig.supportPhone);
  const [supportEmail, setSupportEmail] = useState(platformConfig.supportEmail);
  const [supportHours, setSupportHours] = useState(platformConfig.supportHours);
  const [emergencyHotline, setEmergencyHotline] = useState(platformConfig.emergencyHotline);
  const [locations, setLocations] = useState<string[]>(platformConfig.serviceLocations);
  const [newLocation, setNewLocation] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize state when platformConfig changes
  React.useEffect(() => {
    if (platformConfig.businessName) {
      setBusinessNameInput(platformConfig.businessName);
      setNameModalInput(platformConfig.businessName);
    }
  }, [platformConfig.businessName]);

  // Booking search/filter
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<string>('all');

  // Service price editing
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  // Admin login form state for non-admin screen
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // If user is not logged in with Kairowood@gmail.com
  if (!isAdmin) {
    const handleAdminUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      setAdminAuthError(null);
      if (adminEmail.trim().toLowerCase() !== 'kairowood@gmail.com') {
        setAdminAuthError('Access denied: Email must be the administrator account (Kairowood@gmail.com).');
        return;
      }
      if (!adminPassword) {
        setAdminAuthError('Please enter your administrator password.');
        return;
      }
      onLoginAsAdmin();
    };

    return (
      <div className="py-16 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-700 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7 text-stone-800" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Admin Console Login
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enter your administrator email and password to access platform management and service locations.
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Kairowood@gmail.com"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Unlock Admin Version</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-stone-100">
            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              ← Back to customer website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle updating business name specifically
  const handleUpdateBusinessName = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setBusinessNameInput(trimmed);
    setNameModalInput(trimmed);
    onUpdatePlatformConfig({
      ...platformConfig,
      businessName: trimmed
    });
    setBusinessNameSuccess(`Business name changed to "${trimmed}" successfully!`);
    setTimeout(() => setBusinessNameSuccess(null), 4000);
  };

  // Handle saving platform settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlatformConfig({
      businessName: businessNameInput.trim() || 'Verdant',
      supportPhone: supportPhone.trim(),
      supportEmail: supportEmail.trim(),
      supportHours: supportHours.trim(),
      emergencyHotline: emergencyHotline.trim(),
      serviceLocations: locations
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.address.postcode.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-7 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1 flex-wrap">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Dashboard</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-white">Kairowood@gmail.com</span>
            <span aria-hidden="true">·</span>
            <span className="bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-2">
              <BusinessLogo size="xs" businessName={platformConfig.businessName || 'Verdant'} />
              <span>Business: {platformConfig.businessName || 'Verdant'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Platform Settings & Operations
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Manage business branding, customer support channels, service locations, bookings, and applications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
          {/* USER DIRECT REQUIREMENT: BUTTON TO ADD PICS */}
          <button
            type="button"
            onClick={() => setIsAddPicModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center gap-2 border border-emerald-500"
          >
            <Upload className="w-4 h-4 text-emerald-100" />
            <span>Add Pics</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuoteModal()}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center gap-2 border border-emerald-600"
          >
            <FileText className="w-4 h-4 text-emerald-100" />
            <span>Quote People</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNameModalInput(platformConfig.businessName || 'Verdant');
              setIsChangeNameModalOpen(true);
            }}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center gap-2 border border-stone-700"
          >
            <Building2 className="w-4 h-4 text-emerald-300" />
            <span>Change Business Name</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* Quick Action Reset Bar: Clear Bookings and Applications */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900">Database Operations</div>
            <div className="text-[11px] text-stone-500">
              Clear all records to start fresh ({bookings.length} bookings, {gardenerApplications.length} applications).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearAllBookings}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition-colors cursor-pointer"
          >
            Clear All Bookings
          </button>
          <button
            type="button"
            onClick={onClearAllApplications}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition-colors cursor-pointer"
          >
            Clear All Applications
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-stone-200 overflow-x-auto pb-1">
        {[
          { id: 'locations-support', label: 'Locations & Customer Support' },
          { id: 'gallery', label: `📸 Work Pics (${galleryItems.length})` },
          { id: 'quotes', label: `📋 Quotes (${quotes.length})` },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
          { id: 'applications', label: `Gardener Applications (${gardenerApplications.length})` },
          { id: 'gardeners', label: `Gardeners (${gardeners.length})` },
          { id: 'pricing', label: `Services & Rates (${services.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide cursor-pointer transition-colors border-b-2 whitespace-nowrap px-3 ${
              activeTab === tab.id
                ? 'border-emerald-800 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SERVICE LOCATIONS & CUSTOMER SUPPORT (Direct user requirement) */}
      {activeTab === 'locations-support' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Business Profile & Customer Support
              </h2>
              <p className="text-xs text-stone-500">
                Update business name, contact info, and coverage areas. Changes update across the website immediately.
              </p>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Save Changes</span>
            </button>
          </div>

          {businessNameSuccess && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{businessNameSuccess}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Support details and service locations have been updated successfully!</span>
            </div>
          )}

          {/* Business Profile & Brand Name Section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Business Name & Public Brand</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update the trading name displayed across navigation, website footer, booking forms, and receipts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400 font-medium">Current active brand:</span>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  {platformConfig.businessName || 'Verdant'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={businessNameInput}
                  onChange={(e) => setBusinessNameInput(e.target.value)}
                  placeholder="Enter your business name (e.g. Verdant Gardening)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="button"
                onClick={() => handleUpdateBusinessName(businessNameInput)}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Change Business Name</span>
              </button>
            </div>

            {/* Quick preset chips */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                Quick brand presets or click to try:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Verdant', 'Verdant Gardening', 'GreenThumb Pro', 'The Garden Collective', 'Bloom & Lawn Care', 'MeadowCraft Gardens'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setBusinessNameInput(preset);
                      handleUpdateBusinessName(preset);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                      (platformConfig.businessName || 'Verdant') === preset
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600 font-medium'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card Details Slot Quick Banner */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer Support Info (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>Customer Support Channels</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Customer Support Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="+44 20 7946 0912"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-medium focus:outline-none focus:border-emerald-700"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Displayed in the footer, header, and booking receipts.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Customer Support Email Address
                </label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@verdant.co.uk"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-medium focus:outline-none focus:border-emerald-700"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Used for booking help and customer inquiries.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Support Operating Hours
                </label>
                <input
                  type="text"
                  required
                  value={supportHours}
                  onChange={(e) => setSupportHours(e.target.value)}
                  placeholder="Mon – Sun · 8am – 6pm"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Field Emergency Hotline
                </label>
                <input
                  type="tel"
                  value={emergencyHotline}
                  onChange={(e) => setEmergencyHotline(e.target.value)}
                  placeholder="+44 20 7946 0999"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-medium focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>

            {/* Service Locations (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Service Locations ({locations.length})</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setLocations([
                      'Highbury & Islington (N1, N5)',
                      'Hampstead & Highgate (NW3, N6)',
                      'Richmond & Kew (TW9, TW10)',
                      'Dulwich & Greenwich (SE21, SE10)',
                      'Wimbledon & Putney (SW19, SW15)',
                      'St Albans & Harpenden (AL1, AL5)',
                      'Kensington & Chelsea (W8, SW3)'
                    ]);
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Add New Location */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Chelsea & Battersea (SW3, SW11)"
                  className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* List of Locations */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="font-medium text-stone-800">{loc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(idx)}
                      className="text-stone-400 hover:text-red-700 p-1 rounded cursor-pointer"
                      title="Remove location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB: WORK PICS & PORTFOLIO GALLERY (Direct user requirement) */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 text-left">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Public Portfolio Photos</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Work Pictures & Gallery ({galleryItems.length})
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
                Upload and manage photos of real jobs completed by your gardening team. Any pictures added here instantly appear on the public "See Our Work" page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddPicModalOpen(true)}
              className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
            >
              <Upload className="w-4 h-4 text-emerald-200" />
              <span>Add Pics</span>
            </button>
          </div>

          {/* Pictures Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Add Card */}
            <button
              type="button"
              onClick={() => setIsAddPicModalOpen(true)}
              className="border-2 border-dashed border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer group min-h-[260px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block mb-0.5">
                  Add New Work Picture
                </span>
                <span className="text-xs text-stone-500">
                  Upload file, link URL, or select from presets
                </span>
              </div>
            </button>

            {/* List of uploaded pictures */}
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.category}
                  </div>

                  {onDeleteGalleryItem && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete picture "${item.title}" from the public gallery?`)) {
                          onDeleteGalleryItem(item.id);
                        }
                      }}
                      className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-xl text-xs shadow-md cursor-pointer transition-colors"
                      title="Delete picture"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-base mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-medium text-stone-700">{item.gardenerName || 'Verdant Team'}</span>
                    <span>{item.completedDate || 'Recent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: QUOTES & CUSTOM INQUIRIES */}
      {activeTab === 'quotes' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Customer Quotation Hub</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Quotes & Project Estimates
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
                Create binding quotes for prospective clients. Quotes are confirmed directly by phone or email and settled upon job completion (cash, BACS bank transfer, or invoice). No online payment processing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>Quote Customer</span>
            </button>
          </div>

          {/* Section 1: Customer Inquiries Waiting for Quote */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Customer Inquiries Waiting for Quote ({customRequests.length})</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clients who submitted bespoke gardening project briefs requesting price quotes.
                </p>
              </div>
            </div>

            {customRequests.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200/80">
                <p className="text-xs text-stone-500">No open customer inquiries right now.</p>
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal()}
                  className="mt-2 text-xs text-emerald-800 font-bold hover:underline"
                >
                  Create a direct quote for anyone →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-emerald-50/20 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                        <span className="font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[10px]">
                          {req.category}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-stone-700">{req.postcode}</span>
                      </div>

                      <h4 className="text-sm font-serif font-bold text-stone-900">
                        {req.title}
                      </h4>

                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                        {req.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/60 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-stone-400 block">Client:</span>
                          <span className="font-semibold text-stone-800">{req.customerName || 'Inquirer'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Client Budget:</span>
                          <span className="font-mono font-bold text-emerald-900">{req.budgetRange}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200">
                      <span className="text-[11px] text-stone-500">
                        Needed: {req.preferredDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenQuoteModal(req)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Quote Customer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Sent Quotes Ledger */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span>Sent Quotes & Proposals ({quotes.length})</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Itemized quotes sent to clients. Convert to booked jobs once customer approves.
                </p>
              </div>

              <div className="text-xs text-stone-500">
                Auto-Deposit: <span className="text-emerald-800 font-bold">Enabled</span>
              </div>
            </div>

            {quotes.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200/80">
                <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-stone-800">No quotes issued yet</div>
                <div className="text-[11px] text-stone-500 max-w-sm mx-auto mt-1">
                  Click the "Quote Customer" button above to generate your first professional quote.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-emerald-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-stone-900 px-2 py-0.5 bg-stone-200/70 rounded text-[11px]">
                          {quote.quoteRef}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">{quote.customerName}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600">{quote.customerEmail}</span>
                        <span className="text-stone-400">·</span>
                        <span className="font-mono text-stone-500">{quote.postcode}</span>
                      </div>

                      <div className="font-semibold text-emerald-950 text-xs sm:text-sm">
                        {quote.serviceTitle}
                      </div>

                      <div className="text-stone-600 text-[11px] line-clamp-1">
                        {quote.description}
                      </div>

                      {/* Items pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {quote.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-600"
                          >
                            {it.description} (£{it.amount.toFixed(0)})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right side: Amount and actions */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block uppercase font-medium">Total Quote</span>
                        <span className="text-lg font-serif font-bold text-emerald-950 font-mono">
                          £{quote.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {quote.status === 'converted' ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Converted & Booked</span>
                          </span>
                        ) : (
                          onConvertQuoteToBooking && (
                            <button
                              type="button"
                              onClick={() => onConvertQuoteToBooking(quote)}
                              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Convert this quote to a confirmed booking"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Convert to Booking</span>
                            </button>
                          )
                        )}

                        {onDeleteQuote && (
                          <button
                            type="button"
                            onClick={() => onDeleteQuote(quote.id)}
                            className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                            title="Delete quote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search ref, customer, postcode..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              onClick={onClearAllBookings}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Clear All Bookings ({bookings.length})
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-xs text-stone-500">
              No bookings found. All bookings have been cleared or none have been submitted yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Billing</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-mono font-bold">{b.bookingRef}</td>
                      <td className="py-3 px-4 font-medium">{b.serviceTitle}</td>
                      <td className="py-3 px-4">
                        <div>{b.customerName}</div>
                        <div className="text-[11px] text-stone-400">{b.address.postcode}</div>
                      </td>
                      <td className="py-3 px-4">{b.scheduledDate}</td>
                      <td className="py-3 px-4 font-mono font-bold">£{b.pricing.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>Pay on Completion</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="text-xs bg-stone-50 border border-stone-300 rounded px-2 py-1 font-medium cursor-pointer"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="en_route">On the way</option>
                          <option value="in_progress">In progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onDeleteBooking && (
                          <button
                            onClick={() => onDeleteBooking(b.id)}
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GARDENER APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-stone-900">
              Gardener Trade Applications
            </h3>
            <button
              onClick={onClearAllApplications}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Clear All Applications ({gardenerApplications.length})
            </button>
          </div>

          {gardenerApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-xs text-stone-500">
              No gardener applications on file. Every application has been cleared.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {gardenerApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="py-3 px-4 font-bold">{app.applicantName}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{app.email} · {app.phone}</td>
                      <td className="py-3 px-4">{app.primaryService}</td>
                      <td className="py-3 px-4">{app.experienceYears} years</td>
                      <td className="py-3 px-4 capitalize font-semibold">{app.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GARDENERS ROSTER */}
      {activeTab === 'gardeners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gardeners.map((g) => (
            <div key={g.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">{g.name}</h4>
                  <div className="text-xs text-stone-500">{g.location}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-stone-900 text-sm">£{g.hourlyRate}/hr</div>
                  <button
                    onClick={() => {
                      const newRate = prompt(`Enter new hourly rate for ${g.name}:`, g.hourlyRate.toString());
                      if (newRate && !isNaN(Number(newRate))) {
                        onUpdateGardener({ ...g, hourlyRate: Number(newRate) });
                      }
                    }}
                    className="text-[11px] text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Change Rate
                  </button>
                </div>
              </div>
              <p className="text-xs text-stone-600">{g.bio}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: SERVICES & PRICING */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Gardening Services Catalog ({services.length})
              </h3>
              <p className="text-xs text-stone-500">
                Add new services, update rates, or remove obsolete services from the public catalog.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onResetServices && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Restore standard default services? Any newly created custom services will be reset.')) {
                      onResetServices();
                    }
                  }}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Defaults</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAddServiceModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
              <div className="text-sm font-semibold text-stone-700">No services currently in catalog</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Every service has been deleted. Add a service or restore defaults to make them visible on the customer site.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(true)}
                  className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Service
                </button>
                {onResetServices && (
                  <button
                    type="button"
                    onClick={onResetServices}
                    className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Restore Defaults
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Est. Hours</th>
                      <th className="py-3 px-4">Base Rate</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={s.image}
                              alt={s.title}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div>
                              <div className="font-bold text-stone-900 text-sm">{s.title}</div>
                              <div className="text-[11px] text-stone-500 line-clamp-1 max-w-md">
                                {s.shortDesc}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md font-semibold text-[11px]">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono">
                          {s.estimatedHours ? `${s.estimatedHours}h` : '1.5h'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {editingServiceId === s.id ? (
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="w-20 p-1 border rounded text-xs bg-white font-mono"
                            />
                          ) : (
                            <span className="text-stone-900">£{s.basePrice}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingServiceId === s.id ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newPrice && !isNaN(Number(newPrice))) {
                                      onUpdateServicePrice(s.id, Number(newPrice));
                                    }
                                    setEditingServiceId(null);
                                  }}
                                  className="px-2 py-1 bg-emerald-800 text-white rounded font-bold text-xs cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingServiceId(null)}
                                  className="px-2 py-1 text-stone-500 hover:text-stone-700 text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingServiceId(s.id);
                                  setNewPrice(s.basePrice.toString());
                                }}
                                className="text-emerald-800 font-semibold hover:underline cursor-pointer text-xs"
                              >
                                Edit Price
                              </button>
                            )}

                            {onDeleteService && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete the service "${s.title}"? This will remove it from the catalog and booking estimator.`)) {
                                    onDeleteService(s.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-1"
                                title="Delete service"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onAddService={(newSvc) => {
          if (onAddService) {
            onAddService(newSvc);
          }
        }}
      />

      {/* Change Business Name Modal */}
      {isChangeNameModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Modal Header */}
            <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    Change Business Name
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Update public company branding across the website
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangeNameModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateBusinessName(nameModalInput);
                setIsChangeNameModalOpen(false);
              }}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Business / Trading Name
                </label>
                <input
                  type="text"
                  required
                  value={nameModalInput}
                  onChange={(e) => setNameModalInput(e.target.value)}
                  placeholder="e.g. Verdant Gardening"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:border-emerald-700"
                  autoFocus
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Current Name: <strong className="text-stone-800">{platformConfig.businessName || 'Verdant'}</strong>
                </span>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Live Brand Preview:
                </span>
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-base font-serif font-bold text-emerald-950">
                    {nameModalInput.trim() || 'Your Business Name'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  This brand name will appear in the main navigation, mobile header, footer copyright, and customer emails.
                </p>
              </div>

              {/* Quick Preset Ideas */}
              <div>
                <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                  Quick Name Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Verdant', 'Verdant Gardening', 'GreenThumb Pro', 'The Garden Collective', 'Bloom & Lawn Care', 'MeadowCraft Gardens'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNameModalInput(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        nameModalInput === preset
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsChangeNameModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!nameModalInput.trim()}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Update Business Name</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pic Modal */}
      {isAddPicModalOpen && onAddGalleryItem && (
        <AddPicModal
          isOpen={isAddPicModalOpen}
          onClose={() => setIsAddPicModalOpen(false)}
          onAddPic={(pic) => {
            onAddGalleryItem(pic);
            setIsAddPicModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
