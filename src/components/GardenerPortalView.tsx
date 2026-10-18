import React, { useState } from 'react';
import { GardenJobBooking, CustomJobRequest, BookingStatus } from '../types/gardening';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Wrench,
  BatteryCharging,
  DollarSign,
  AlertCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface GardenerPortalViewProps {
  bookings: GardenJobBooking[];
  customRequests: CustomJobRequest[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onAcceptJobAsPro: (bookingId: string) => void;
  onSwitchToCustomer: () => void;
  onOpenQuoteModal?: (req?: CustomJobRequest) => void;
}

export const GardenerPortalView: React.FC<GardenerPortalViewProps> = ({
  bookings,
  customRequests,
  onUpdateStatus,
  onAcceptJobAsPro,
  onSwitchToCustomer,
  onOpenQuoteModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'available' | 'earnings'>('schedule');

  // Gardener Direct Bank (BACS) Settlement State
  const [accountNumber, setAccountNumber] = useState('78192034');
  const [sortCode, setSortCode] = useState('20-45-11');
  const [accountName, setAccountName] = useState('Arthur Pendelton');
  const [bankName, setBankName] = useState('Starling Bank');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const assignedJobs = bookings.filter(b => b.status !== 'cancelled');

  const checklistItems = [
    { label: 'Roller & rotary blades inspected & balanced', checked: true },
    { label: '4x 56V 10Ah batteries charged to 100%', checked: true },
    { label: 'Heavy-duty 1000L waste bulk sacks on van', checked: true },
    { label: 'Strimmer line spools & eye protection ready', checked: true }
  ];

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner for Pro Mode */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 mb-8 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gardener Pro Console</span>
            <span aria-hidden="true">·</span>
            <span>Arthur Pendelton (Verified RHS L3)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white">
            Daily Route & Job Manifest
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your daily garden visits, navigate to client addresses, and submit completion sign-offs to trigger direct payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToCustomer}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg border border-stone-700 transition-colors cursor-pointer"
          >
            Switch to Customer View
          </button>
        </div>
      </div>

      {/* Metric Cards (Zero Pill, Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
            Month Earnings
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            £1,845.00
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            Next payout: Friday via BACS
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
            Jobs Scheduled
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {assignedJobs.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            In North London zone
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
            Customer Rating
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            4.96 ★
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            142 verified reviews
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
            Liability Insurance
          </span>
          <div className="text-base font-serif font-bold text-emerald-950 mt-1">
            Active £5M
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Direct Line Policy #7781-B
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide cursor-pointer transition-colors border-b-2 ${
            activeSubTab === 'schedule'
              ? 'border-emerald-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          My Scheduled Route ({assignedJobs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('available')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide cursor-pointer transition-colors border-b-2 ml-4 ${
            activeSubTab === 'available'
              ? 'border-emerald-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Available Inquiries in Radius ({customRequests.length})
        </button>
        <button
          onClick={() => setActiveSubTab('earnings')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide cursor-pointer transition-colors border-b-2 ml-4 ${
            activeSubTab === 'earnings'
              ? 'border-emerald-800 text-stone-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          🏛️ Direct Bank Payouts (BACS)
        </button>
      </div>

      {activeSubTab === 'schedule' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Manifest Jobs (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {assignedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-stone-800">{job.bookingRef}</span>
                      <span aria-hidden="true">·</span>
                      <span>Slot: {job.timeSlot}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-900">
                      {job.serviceTitle}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">Payout value</span>
                    <span className="text-xl font-serif font-bold text-stone-900 tabular-nums">
                      £{job.pricing.total.toFixed(2)}
                    </span>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>Settle with Client upon Completion</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                      Customer & Address
                    </span>
                    <div className="font-semibold text-stone-900">{job.customerName}</div>
                    <div className="text-stone-600">{job.address.street}, {job.address.city}</div>
                    <div className="font-mono text-stone-800 font-semibold">{job.address.postcode}</div>
                    <div className="text-stone-500 mt-1">Tel: {job.customerPhone}</div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                      Access & Job Specs
                    </span>
                    <div className="text-stone-700 italic bg-stone-50 p-2 rounded-lg border border-stone-200/60 mb-2">
                      &ldquo;{job.address.accessNotes}&rdquo;
                    </div>
                    <div className="text-stone-600">
                      Scale: <span className="font-semibold text-stone-900">{job.yardSize} ({job.yardSqFt} sq ft)</span> · Waste: <span className="font-semibold text-stone-900">{job.wasteHandling}</span>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Current status:</span>
                    <span className="font-semibold uppercase tracking-wider text-emerald-800">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === 'scheduled' && (
                      <button
                        onClick={() => onUpdateStatus(job.id, 'en_route')}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-xs cursor-pointer"
                      >
                        Depart Van (En Route)
                      </button>
                    )}
                    {job.status === 'en_route' && (
                      <button
                        onClick={() => onUpdateStatus(job.id, 'in_progress')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-xs cursor-pointer"
                      >
                        Arrived & Start Mowing
                      </button>
                    )}
                    {job.status === 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus(job.id, 'completed')}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                      >
                        Complete & Sign Off
                      </button>
                    )}
                    {job.status === 'completed' && (
                      <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Signed off & Invoiced
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Pre-Flight Van Checklist (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                Equipment Readiness
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Van & Safety Check
              </h3>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 bg-stone-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500">
              Licensed waste carrier reference: <span className="font-mono text-stone-800">CBDU39210</span>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'earnings' ? (
        /* BACS Direct Bank Deposit Details */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Pro BACS Direct Deposit Account</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Bank Settlement & Earnings Disbursement
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Earnings for completed gardening jobs are transferred directly to your UK bank account via weekly BACS transfer.
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Weekly BACS Active</span>
              </div>
            </div>

            {saveSuccess && (
              <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
              {/* Account Summary Visual */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-stone-900 rounded-3xl shadow-xl border border-stone-800 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono text-emerald-400 font-bold">UK BACS SETTLEMENT</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-stone-300">DIRECT DISBURSEMENT</span>
                  </div>

                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Account Name</div>
                    <div className="text-base font-bold text-white uppercase">{accountName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-mono">Sort Code</div>
                      <div className="font-mono font-bold text-emerald-300 text-sm">{sortCode}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-mono">Account No.</div>
                      <div className="font-mono font-bold text-emerald-300 text-sm">•••• {accountNumber.slice(-4)}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                    <span>{bankName}</span>
                    <span className="text-emerald-400 font-medium">Verified RHS Pro</span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="font-bold text-stone-800">Direct Settlement Model</div>
                  <div className="text-stone-500">
                    Online client card payments are disabled. Clients settle jobs directly upon completion, and contracted balance is disbursed via BACS.
                  </div>
                </div>
              </div>

              {/* Form to enter / update bank details */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Sort Code (6 Digits)
                    </label>
                    <input
                      type="text"
                      value={sortCode}
                      onChange={(e) => setSortCode(e.target.value)}
                      placeholder="e.g. 20-45-11"
                      className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Account Number (8 Digits)
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 78192034"
                      className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSaveSuccess(`Bank settlement account updated! Weekly disbursements will route to account ending in ${accountNumber.slice(-4)}.`);
                      setTimeout(() => setSaveSuccess(null), 4000);
                    }}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Bank Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Available Custom Requests in radius */
        <div className="space-y-5">
          {customRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>{req.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{req.postcode} (2.1 mi)</span>
                  <span aria-hidden="true">·</span>
                  <span>Timeframe: {req.preferredDate}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  {req.title}
                </h3>
                <p className="text-xs text-stone-600 max-w-2xl">
                  {req.description}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Customer budget</span>
                  <span className="text-xl font-serif font-bold text-stone-900">
                    {req.budgetRange}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenQuoteModal) {
                      onOpenQuoteModal(req);
                    } else {
                      alert(`Quote builder opened for ${req.title}!`);
                    }
                  }}
                  className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Quote Customer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
