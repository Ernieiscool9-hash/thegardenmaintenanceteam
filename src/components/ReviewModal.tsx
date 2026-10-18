import React, { useState } from 'react';
import { GardenJobBooking, BookingReview } from '../types/gardening';
import { Star, X, Check, CheckCircle2, HeartHandshake, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReviewModalProps {
  booking: GardenJobBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (bookingId: string, review: BookingReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Sub ratings
  const [punctuality, setPunctuality] = useState<number>(5);
  const [craftsmanship, setCraftsmanship] = useState<number>(5);
  const [cleanliness, setCleanliness] = useState<number>(5);

  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Laser-Straight Edges',
    'Spotless Patio Sweep'
  ]);
  const [recommend, setRecommend] = useState<boolean>(true);
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const gardenerFirstName = booking.gardenerName?.split(' ')[0] || 'your gardener';

  const ratingDescriptions: Record<number, string> = {
    5: 'Excellent — Clean, tidy, and great work',
    4: 'Good — Reliable and well done',
    3: 'Satisfactory — Completed as agreed',
    2: 'Below expectations',
    1: 'Unsatisfactory'
  };

  const availableTags = [
    'Tidy Cleanup',
    'Neat Edges',
    'Polite & Friendly',
    'Punctual & On Time',
    'Careful Around Plants',
    'Fast & Efficient',
    'Great Advice',
    'Left Patio Spotless'
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tipAmount = customTip ? parseFloat(customTip) || 0 : selectedTip;

    const review: BookingReview = {
      id: `rev-${Date.now()}`,
      rating,
      subRatings: {
        punctuality,
        craftsmanship,
        cleanliness
      },
      comment: comment.trim() || 'Great gardening service. Very satisfied with the outcome.',
      tags: selectedTags,
      recommend,
      tipAmount: tipAmount > 0 ? tipAmount : undefined,
      createdAt: 'Just now'
    };

    onSubmitReview(booking.id, review);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Verified Job Feedback
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              {isSuccess ? 'Feedback Submitted' : `Review ${gardenerFirstName}'s Work`}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              {booking.serviceTitle} · Ref: {booking.bookingRef}
            </p>
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
            <h4 className="text-2xl font-serif font-bold text-stone-900">
              Thank You for Your Review!
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Your verified rating and compliments have been published to {booking.gardenerName}&rsquo;s professional dossier, helping fellow garden owners book with confidence.
            </p>
            {selectedTip > 0 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium max-w-xs mx-auto">
                £{selectedTip.toFixed(2)} gratuity successfully sent directly to {gardenerFirstName}.
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Close & Return to Bookings
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Overall Star Rating */}
            <div className="text-center py-2 bg-stone-50/70 rounded-2xl border border-stone-200/80 p-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Overall Experience Rating
              </label>

              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isHighlighted = (hoverRating ?? rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(starVal)}
                      className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isHighlighted
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-stone-200 text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-medium text-stone-700 min-h-5 italic">
                {ratingDescriptions[hoverRating ?? rating]}
              </div>
            </div>

            {/* Quality Sub-Ratings */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-2.5">
                Service Performance Criteria
              </span>
              <div className="space-y-2.5 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800">Finish & Craftsmanship</span>
                    <span className="block text-[11px] text-stone-500">Sharp lines, accurate cuts, uniform height</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCraftsmanship(val)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono transition-colors cursor-pointer ${
                          craftsmanship >= val
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                  <div>
                    <span className="font-semibold text-stone-800">Cleanliness & Waste Removal</span>
                    <span className="block text-[11px] text-stone-500">Patios swept, trimmings bagged & hauled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCleanliness(val)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono transition-colors cursor-pointer ${
                          cleanliness >= val
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                  <div>
                    <span className="font-semibold text-stone-800">Punctuality & Communication</span>
                    <span className="block text-[11px] text-stone-500">Arrived in time window, courteous conduct</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPunctuality(val)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono transition-colors cursor-pointer ${
                          punctuality >= val
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Compliments Quick-Tags */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                Highlight What Went Well (Click to select)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Comment */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Written Feedback for {gardenerFirstName}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Describe your experience with ${gardenerFirstName}. E.g., how the lawn or hedges look, the speed of clearance, or any advice they provided...`}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 bg-white"
              />
            </div>

            {/* Would Recommend Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs font-medium text-stone-800">
                Would you recommend {gardenerFirstName} to neighbors?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecommend(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    recommend
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecommend(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    !recommend
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No</span>
                </button>
              </div>
            </div>

            {/* Optional Gratuity / Tip */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Add a Trade Gratuity (100% goes to {gardenerFirstName})
                </span>
                {selectedTip > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                    +£{selectedTip.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'No Tip', amount: 0 },
                  { label: '£5.00', amount: 5 },
                  { label: '£10.00', amount: 10 },
                  { label: '£15.00', amount: 15 }
                ].map((opt) => (
                  <button
                    key={opt.amount}
                    type="button"
                    onClick={() => {
                      setSelectedTip(opt.amount);
                      setCustomTip('');
                    }}
                    className={`py-2 px-1 text-xs rounded-lg border text-center transition-all cursor-pointer font-medium ${
                      selectedTip === opt.amount && !customTip
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Feedback & Rating</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
