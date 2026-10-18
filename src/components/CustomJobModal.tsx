import React, { useState } from 'react';
import { CustomJobRequest, YardSize } from '../types/gardening';
import { X, Plus, Sparkles, CheckCircle2, Upload, Calendar, DollarSign } from 'lucide-react';

interface CustomJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: (newJob: CustomJobRequest) => void;
}

export const CustomJobModal: React.FC<CustomJobModalProps> = ({
  isOpen,
  onClose,
  onJobPosted
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Garden Reclamation & Clearance');
  const [yardSize, setYardSize] = useState<YardSize>('medium');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('£250 - £400');
  const [preferredDate, setPreferredDate] = useState('Next 7 Days');
  const [postcode, setPostcode] = useState('N5 2UP');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newJob: CustomJobRequest = {
      id: `custom-${Date.now()}`,
      title,
      category,
      yardSize,
      description,
      budgetRange,
      preferredDate,
      postcode: postcode.toUpperCase(),
      status: 'open',
      bids: [
        {
          gardenerId: 'g-arthur',
          gardenerName: 'Arthur Pendelton',
          gardenerRating: 4.96,
          quoteAmount: parseInt(budgetRange.replace(/[^0-9]/g, '')) || 280,
          estimatedHours: 5,
          availableDate: 'This Friday',
          proposalNote: 'I specialize in this kind of project and have commercial equipment ready. Includes full waste disposal.'
        }
      ],
      createdAt: 'Just now'
    };

    onJobPosted(newJob);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto">
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Bespoke Project
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              Post a Custom Gardening Job
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-serif font-bold text-stone-900">
              Job Posted to Local Gardeners
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              We notified vetted local groundskeepers in your postcode radius. You already have an initial trade bid waiting in your Bookings Hub!
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              View My Posted Jobs & Bids
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build 2 Raised Herb Beds & Clear Bramble Thicket"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Garden Reclamation & Clearance">Garden Reclamation & Clearance</option>
                  <option value="Landscaping & Raised Beds">Landscaping & Raised Beds</option>
                  <option value="Turf Laying & Seeding">Turf Laying & Seeding</option>
                  <option value="Hedge Restoration & Topiary">Hedge Restoration & Topiary</option>
                  <option value="Planting Scheme Design">Planting Scheme Design</option>
                  <option value="Tree Canopy Pruning">Tree Canopy Pruning</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Approx Yard Scale
                </label>
                <select
                  value={yardSize}
                  onChange={(e) => setYardSize(e.target.value as YardSize)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="small">Small (&lt;500 sq ft)</option>
                  <option value="medium">Medium (500-1,800 sq ft)</option>
                  <option value="large">Large (1,800-3,500 sq ft)</option>
                  <option value="estate">Estate (3,500+ sq ft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Detailed Description & Special Requests
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current garden state, materials needed, access hurdles, and any specific plants or equipment required."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Budget Estimate
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white font-mono"
                >
                  <option value="£120 - £200">£120 - £200</option>
                  <option value="£200 - £350">£200 - £350</option>
                  <option value="£350 - £600">£350 - £600</option>
                  <option value="£600 - £1,200">£600 - £1,200</option>
                  <option value="£1,200+">£1,200+</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Timeline
                </label>
                <select
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Urgent (Next 48h)">Urgent (Next 48h)</option>
                  <option value="Next 7 Days">Next 7 Days</option>
                  <option value="Within 2 Weeks">Within 2 Weeks</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Broadcast Job to Gardeners
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
