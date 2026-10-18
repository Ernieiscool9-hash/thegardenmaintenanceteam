import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  FileText,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  ShieldCheck,
  Send,
  Printer,
  Copy,
  Check,
  Building2,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { CustomerQuote, CustomJobRequest, QuoteLineItem, PlatformConfig } from '../types/gardening';
import { BusinessLogo } from './BusinessLogo';

interface QuoteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuote: (quote: CustomerQuote) => void;
  initialRequest?: CustomJobRequest | null;
  platformConfig?: PlatformConfig;
  gardenerName?: string;
}

export const QuoteCustomerModal: React.FC<QuoteCustomerModalProps> = ({
  isOpen,
  onClose,
  onSendQuote,
  initialRequest,
  platformConfig,
  gardenerName
}) => {
  const businessName = platformConfig?.businessName || 'Verdant';

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [postcode, setPostcode] = useState('N5 2UP');
  const [serviceTitle, setServiceTitle] = useState('Garden Clearance & Overhaul');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(240);
  const [estimatedHours, setEstimatedHours] = useState<number>(4);
  const [proposedDate, setProposedDate] = useState('This Thursday · 9:00 AM');
  const [validDays, setValidDays] = useState<number>(14);
  const [notes, setNotes] = useState('Includes all commercial green waste hauling and licensed RHS disposal.');
  const [items, setItems] = useState<QuoteLineItem[]>([
    { id: '1', description: 'Initial site clearance & bramble pruning', amount: 140 },
    { id: '2', description: 'Mechanical waste chipping & haul-away', amount: 60 },
    { id: '3', description: 'Border re-edging & lawn scalping', amount: 40 }
  ]);

  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const [sentQuote, setSentQuote] = useState<CustomerQuote | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Synchronize when initialRequest changes
  useEffect(() => {
    if (initialRequest) {
      setCustomerName(initialRequest.customerName || 'Prospective Client');
      setCustomerEmail(initialRequest.customerEmail || 'client@example.com');
      setCustomerPhone(initialRequest.customerPhone || '07700 900142');
      setPropertyAddress(`${initialRequest.postcode}, London`);
      setPostcode(initialRequest.postcode || 'N5 2UP');
      setServiceTitle(initialRequest.title || 'Custom Garden Project');
      setDescription(initialRequest.description || '');

      // Parse budget if available
      const parsedBudget = parseInt(initialRequest.budgetRange.replace(/[^0-9]/g, '')) || 260;
      setTotalAmount(parsedBudget);

      setItems([
        { id: '1', description: `Full execution of ${initialRequest.title}`, amount: Math.round(parsedBudget * 0.75) },
        { id: '2', description: 'Waste handling & council compliant haul', amount: Math.round(parsedBudget * 0.25) }
      ]);
    } else {
      // Default clean state
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setPropertyAddress('');
      setPostcode('N5 2UP');
      setServiceTitle('Garden Maintenance & Restoration');
      setDescription('Comprehensive lawn treatment, hedge shaping, and border cultivation.');
      setTotalAmount(240);
    }
    setSentQuote(null);
  }, [initialRequest, isOpen]);

  // Recalculate total when items change
  const handleAddItem = () => {
    if (!newItemDesc.trim() || !newItemAmount) return;
    const num = parseFloat(newItemAmount) || 0;
    const newItems = [...items, { id: String(Date.now()), description: newItemDesc.trim(), amount: num }];
    setItems(newItems);
    const sum = newItems.reduce((acc, it) => acc + it.amount, 0);
    setTotalAmount(sum);
    setNewItemDesc('');
    setNewItemAmount('');
  };

  const handleRemoveItem = (id: string) => {
    const filtered = items.filter(it => it.id !== id);
    setItems(filtered);
    const sum = filtered.reduce((acc, it) => acc + it.amount, 0);
    setTotalAmount(sum > 0 ? sum : totalAmount);
  };

  const handlePresetSelect = (preset: { title: string; price: number; hours: number; desc: string }) => {
    setServiceTitle(preset.title);
    setTotalAmount(preset.price);
    setEstimatedHours(preset.hours);
    setDescription(preset.desc);
    setItems([
      { id: '1', description: `Primary labor & execution for ${preset.title}`, amount: Math.round(preset.price * 0.8) },
      { id: '2', description: 'Equipment wear & green waste haulage', amount: Math.round(preset.price * 0.2) }
    ]);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;

    const refNumber = `QTE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQuote: CustomerQuote = {
      id: `qte_${Date.now()}`,
      quoteRef: refNumber,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim() || undefined,
      propertyAddress: propertyAddress.trim() || `${postcode}, London`,
      postcode: postcode.trim().toUpperCase(),
      serviceTitle: serviceTitle.trim(),
      description: description.trim(),
      items: items.length > 0 ? items : [{ id: '1', description: serviceTitle, amount: totalAmount }],
      totalAmount,
      estimatedHours,
      proposedDate,
      validDays,
      notes: notes.trim() || undefined,
      status: 'sent',
      createdAt: 'Just now',
      sentBy: gardenerName || `${businessName} Admin`
    };

    onSendQuote(newQuote);
    setSentQuote(newQuote);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <BusinessLogo size="xs" businessName={businessName} />
                <span>{businessName}</span>
                <span aria-hidden="true">·</span>
                <span>Customer Quotation Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white">
                {sentQuote ? 'Quote Sent Successfully' : 'Create & Send Customer Quote'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {sentQuote ? (
          /* Confirmation Screen after sending quote */
          <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-emerald-800 font-bold tracking-wider">
                Official Quotation Dispatched
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {sentQuote.quoteRef}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                We have generated a formal price quote for <strong className="text-stone-900">{sentQuote.customerName}</strong> for <strong className="text-emerald-900 font-mono">£{sentQuote.totalAmount.toFixed(2)}</strong>.
              </p>
            </div>

            {/* Quote Summary Document Card */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 text-left max-w-lg mx-auto space-y-3 shadow-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                <div>
                  <div className="text-xs font-bold text-stone-900">{businessName} Quotation</div>
                  <div className="text-[11px] text-stone-500">Ref: {sentQuote.quoteRef} · Valid {sentQuote.validDays} days</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Sent to {sentQuote.customerEmail}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-semibold text-stone-800">{sentQuote.serviceTitle}</div>
                <div className="text-stone-500 text-[11px]">{sentQuote.description}</div>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
                {sentQuote.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-stone-600">
                    <span>{it.description}</span>
                    <span className="font-mono">£{it.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-stone-200 font-bold text-stone-900">
                <span>Total Guaranteed Price:</span>
                <span className="text-lg font-serif font-bold text-emerald-900 font-mono">
                  £{sentQuote.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Quotes are agreed directly with the client. Settled upon job completion (cash, BACS, or invoice).</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://verdant.co.uk/quote/${sentQuote.quoteRef}?amount=${sentQuote.totalAmount}`
                  );
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
                <span>{copiedLink ? 'Quote Link Copied!' : 'Copy Shareable Quote Link'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Quote Form */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Quick Presets */}
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Quick Quote Presets (1-Click Fill):</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    title: 'Lawn Aeration & Spring Overseeding',
                    price: 185,
                    hours: 3.5,
                    desc: 'Scarification, hollow tine aeration, overseeding and organic fertilizer treatment.'
                  },
                  {
                    title: 'Boundary Hedge Overhaul & Shaping',
                    price: 220,
                    hours: 4,
                    desc: 'Precision leveling of top line, trimming back sides, and bagging all green waste.'
                  },
                  {
                    title: 'Full Overgrown Garden Clearance',
                    price: 360,
                    hours: 6,
                    desc: 'Total bramble scalping, deadwood coppicing, weeding borders, and 1000L waste disposal haul.'
                  },
                  {
                    title: 'Seasonal Bed Care & Flower Planting',
                    price: 140,
                    hours: 2.5,
                    desc: 'Bed turning, compost enrichment, border mulching, and planting perennial flowers.'
                  }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{preset.title}</span>
                    <span className="font-mono text-emerald-800 font-bold">£{preset.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Customer & Job Details (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Customer & Location Information</span>
                  </h4>
                  <span className="text-[11px] text-stone-400">Step 1 of 2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Claire Watson"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. claire@example.com"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 07700 900142"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      required
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="e.g. N1 2TH"
                      className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Property Address / Street
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. 14 Highbury Hill, London"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                {/* Service Details */}
                <div className="pt-2 border-t border-stone-100">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quoted Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="e.g. Victorian Walled Garden Clearance & Turfing"
                    className="w-full px-3 py-2 text-xs font-medium border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Scope of Work & Project Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed explanation of the gardening tasks included in this quote..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                {/* Itemized Line Items */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Itemized Breakdown
                    </label>
                    <span className="text-[11px] text-stone-400">Shown on client estimate</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                        <span className="text-stone-800 font-medium truncate max-w-[280px]">{item.description}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">£{item.amount.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-stone-400 hover:text-red-600 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Line Item */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      placeholder="Line item description (e.g. 5 bags of mulch)"
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                    />
                    <input
                      type="number"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      placeholder="£ Amount"
                      className="w-24 px-3 py-1.5 text-xs font-mono border border-stone-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing, Schedule & Live Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Pricing & Schedule Terms</span>
                  </h4>
                </div>

                {/* Total Guaranteed Price */}
                <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-900 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs text-emerald-300">
                    <span className="font-semibold uppercase tracking-wider">Total Quote Amount</span>
                    <span className="bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-mono text-[10px]">
                      Fixed Price
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-serif font-bold text-white font-mono">
                      £
                    </span>
                    <input
                      type="number"
                      required
                      min={10}
                      step={1}
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                      className="w-full text-3xl font-serif font-bold text-white bg-transparent border-b border-emerald-700 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div className="text-[11px] text-emerald-300/80 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Includes all labor, equipment, and green haulage.</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quote Validity
                    </label>
                    <select
                      value={validDays}
                      onChange={(e) => setValidDays(parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50"
                    >
                      <option value={7}>7 Days</option>
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Proposed Service Date / Slot
                  </label>
                  <input
                    type="text"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    placeholder="e.g. This Saturday · 8:30 AM"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Terms & Site Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Customer provides water tap access; gate unlocked."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50"
                  />
                </div>

                {/* Direct settlement reminder */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Direct client settlement: payment is settled on-site or invoiced after job completion. No online payment processing.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Form Submit */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer order-2 sm:order-1"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>Send Official Quote (£{totalAmount.toFixed(2)})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
