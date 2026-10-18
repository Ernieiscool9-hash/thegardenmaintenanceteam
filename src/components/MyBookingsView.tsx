import React, { useState } from 'react';
import { GardenJobBooking, CustomJobRequest, BookingStatus, JobBid, BookingReview, BookingPayment } from '../types/gardening';
import { ReviewModal } from './ReviewModal';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  Plus,
  ArrowRight,
  MessageSquare,
  Phone
} from 'lucide-react';

interface MyBookingsViewProps {
  bookings: GardenJobBooking[];
  customRequests: CustomJobRequest[];
  onUpdateBookingStatus: (id: string, newStatus: BookingStatus) => void;
  onCancelBooking: (id: string) => void;
  onAcceptBid: (requestId: string, bid: JobBid) => void;
  onOpenBookingModal: () => void;
  onOpenCustomJobModal: () => void;
  onSubmitReview: (bookingId: string, review: BookingReview) => void;
  onUpdateBookingPayment?: (bookingId: string, payment: BookingPayment) => void;
  businessName?: string;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onUpdateBookingStatus,
  onCancelBooking,
  onOpenBookingModal,
  onSubmitReview,
  onUpdateBookingPayment,
  businessName = 'Verdant'
}) => {
  const [subTab, setSubTab] = useState<'all' | 'completed'>('all');
  const [reviewingBooking, setReviewingBooking] = useState<GardenJobBooking | null>(null);

  const displayedBookings = subTab === 'completed'
    ? bookings.filter(b => b.status === 'completed')
    : bookings;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Scheduled</span>;
      case 'en_route':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">On the Way</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">{status}</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-bold">
            My Gardening Bookings
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Track your appointments, view details, and leave reviews for your gardeners.
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-center"
        >
          <Phone className="w-4 h-4 text-emerald-300" />
          <span>Call to Book a Quote</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSubTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            subTab === 'all'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setSubTab('completed')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            subTab === 'completed'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Completed ({bookings.filter(b => b.status === 'completed').length})
        </button>
      </div>

      {/* Bookings List */}
      {displayedBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              No bookings yet
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              You haven't booked any gardening jobs yet. Browse services or call our desk to book a bespoke quote.
            </p>
          </div>
          <button
            onClick={onOpenBookingModal}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>Call to Book a Quote</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div>
                  <div className="text-xs font-mono text-stone-400 font-bold mb-0.5">
                    {b.bookingRef}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    {b.serviceTitle}
                  </h3>
                </div>
                <div>{getStatusBadge(b.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{b.scheduledDate} ({b.timeSlot})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{b.address.postcode} ({b.address.street})</span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="text-stone-400">Total:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    £{b.pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {b.gardenerName && (
                <div className="text-xs text-stone-500 pt-1">
                  Gardener assigned: <strong className="text-stone-800">{b.gardenerName}</strong>
                </div>
              )}

              {/* Settlement / Billing Information */}
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-stone-200 text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-stone-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-stone-700 flex-wrap">
                      <span className="font-semibold text-stone-900">Direct Settlement on Completion</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-600">Pay directly after work is done (cash, bank transfer, or invoice)</span>
                      <span className="text-stone-400">·</span>
                      <span className="font-mono font-bold text-stone-800">£{b.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 font-medium self-start sm:self-center">
                  Zero online payment required
                </div>
              </div>

              {/* Status Controls / Actions */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {/* Quick status stepper for demonstration */}
                  {b.status !== 'completed' && b.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        if (b.status === 'scheduled') onUpdateBookingStatus(b.id, 'en_route');
                        else if (b.status === 'en_route') onUpdateBookingStatus(b.id, 'in_progress');
                        else if (b.status === 'in_progress') {
                          onUpdateBookingStatus(b.id, 'completed');
                          setReviewingBooking(b);
                        }
                      }}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium cursor-pointer"
                    >
                      {b.status === 'scheduled' && 'Mark: On the Way'}
                      {b.status === 'en_route' && 'Mark: In Progress'}
                      {b.status === 'in_progress' && 'Mark: Completed'}
                    </button>
                  )}

                  {b.status === 'scheduled' && (
                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

                {/* Review section if completed */}
                {b.status === 'completed' && (
                  <div>
                    {b.review ? (
                      <div className="flex items-center gap-1.5 text-stone-700 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                        <span className="text-xs font-semibold">Your Review:</span>
                        <div className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                          <span>{b.review.rating}/5</span>
                        </div>
                        <span className="text-stone-500 italic ml-1 truncate max-w-xs">
                          &ldquo;{b.review.comment}&rdquo;
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewingBooking(b)}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        <span>Leave Review & Rating</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewingBooking && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewingBooking(null)}
          booking={reviewingBooking}
          onSubmitReview={(bookingId, review) => {
            onSubmitReview(bookingId, review);
            setReviewingBooking(null);
          }}
        />
      )}
    </div>
  );
};
