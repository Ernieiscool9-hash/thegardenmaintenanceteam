import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceGrid } from './components/ServiceGrid';
import { OurWorkView } from './components/OurWorkView';
import { EstimatorCalculator } from './components/EstimatorCalculator';
import { GardenerDirectory } from './components/GardenerDirectory';
import { MyBookingsView } from './components/MyBookingsView';
import { GardenerPortalView } from './components/GardenerPortalView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerLoginView } from './components/CustomerLoginView';
import { BookingModal } from './components/BookingModal';
import { CustomJobModal } from './components/CustomJobModal';
import { QuoteCustomerModal } from './components/QuoteCustomerModal';
import { CallToBookQuoteModal } from './components/CallToBookQuoteModal';
import { Footer } from './components/Footer';

import {
  GARDENING_SERVICES,
  VETTED_GARDENERS,
  DEFAULT_PLATFORM_CONFIG,
  INITIAL_QUOTES,
  INITIAL_CUSTOM_REQUESTS,
  INITIAL_WORK_GALLERY
} from './data/mockData';
import {
  GardeningService,
  GardenerProfile,
  GardenJobBooking,
  CustomJobRequest,
  GardenerApplication,
  YardSize,
  LawnHeight,
  WasteHandling,
  BookingFrequency,
  BookingStatus,
  JobBid,
  BookingReview,
  PlatformConfig,
  BookingPayment,
  DirectCardTransfer,
  CustomerQuote,
  WorkGalleryItem
} from './types/gardening';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'services' | 'our-work' | 'estimator' | 'gardeners' | 'my-bookings' | 'gardener-portal' | 'admin' | 'login'
  >('services');

  // Customer by default: Admin button is hidden until logged in as Kairowood@gmail.com
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('verdant_user_email');
    } catch (e) {
      return null;
    }
  });

  const isAdmin = currentUserEmail?.toLowerCase() === 'kairowood@gmail.com';

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Platform Configuration (Support phone/email, business name and service locations)
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    try {
      const saved = localStorage.getItem('verdant_platform_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PLATFORM_CONFIG,
          ...parsed,
          businessName: parsed.businessName || DEFAULT_PLATFORM_CONFIG.businessName || 'Verdant',
          payoutCard: parsed.payoutCard || DEFAULT_PLATFORM_CONFIG.payoutCard
        };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_PLATFORM_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('verdant_platform_config', JSON.stringify(platformConfig));
    } catch (e) {
      // ignore
    }
    if (platformConfig.businessName) {
      document.title = `${platformConfig.businessName} - Professional Gardening Services`;
    }
  }, [platformConfig]);

  // Services catalog with persistence for admin price adjustments
  const [services, setServices] = useState<GardeningService[]>(() => {
    try {
      const saved = localStorage.getItem('verdant_services');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return GARDENING_SERVICES;
  });

  // Gardeners state with persistence
  const [gardeners, setGardeners] = useState<GardenerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('verdant_gardeners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return VETTED_GARDENERS;
  });

  // Bookings state - cleared as requested
  const [bookings, setBookings] = useState<GardenJobBooking[]>(() => {
    try {
      localStorage.removeItem('verdant_bookings');
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Gardener applications - cleared as requested
  const [gardenerApplications, setGardenerApplications] = useState<GardenerApplication[]>(() => {
    try {
      localStorage.removeItem('verdant_gardener_applications');
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Custom project requests & applications
  const [customRequests, setCustomRequests] = useState<CustomJobRequest[]>(() => {
    try {
      const saved = localStorage.getItem('verdant_custom_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_CUSTOM_REQUESTS;
  });

  // Customer quotes
  const [quotes, setQuotes] = useState<CustomerQuote[]>(() => {
    try {
      const saved = localStorage.getItem('verdant_customer_quotes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_QUOTES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('verdant_customer_quotes', JSON.stringify(quotes));
    } catch (e) {
      // ignore
    }
  }, [quotes]);

  // Work gallery items state with persistence
  const [galleryItems, setGalleryItems] = useState<WorkGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('verdant_work_gallery');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_WORK_GALLERY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('verdant_work_gallery', JSON.stringify(galleryItems));
    } catch (e) {
      // ignore
    }
  }, [galleryItems]);

  const handleAddGalleryItem = (newItem: WorkGalleryItem) => {
    setGalleryItems(prev => [newItem, ...prev]);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  // Modal controls
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCustomJobModalOpen, setIsCustomJobModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCallToBookModalOpen, setIsCallToBookModalOpen] = useState(false);
  const [callInquiryDetails, setCallInquiryDetails] = useState<{
    serviceTitle?: string;
    estimatedPrice?: number;
    yardSize?: string;
    postcode?: string;
  } | null>(null);
  const [quotingRequest, setQuotingRequest] = useState<CustomJobRequest | null>(null);

  const handleOpenCallToBookQuote = (details?: {
    serviceTitle?: string;
    estimatedPrice?: number;
    yardSize?: string;
    postcode?: string;
  }) => {
    setCallInquiryDetails(details || null);
    setIsCallToBookModalOpen(true);
  };

  const handleRequestCallback = (inquiry: {
    name: string;
    phone: string;
    postcode: string;
    serviceTitle: string;
    notes?: string;
  }) => {
    const newReq: CustomJobRequest = {
      id: `callback_${Date.now()}`,
      title: `${inquiry.serviceTitle} (Phone Quote Callback)`,
      category: 'Callback Request',
      yardSize: 'medium',
      description: inquiry.notes ? `${inquiry.notes} (Customer requested a call back)` : 'Customer requested a phone quote callback.',
      budgetRange: 'Phone Quote',
      preferredDate: 'ASAP / Today',
      postcode: inquiry.postcode,
      customerName: inquiry.name,
      customerPhone: inquiry.phone,
      customerEmail: `${inquiry.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@phonequote.local`,
      status: 'open',
      bids: [],
      createdAt: 'Just now'
    };
    setCustomRequests(prev => [newReq, ...prev]);
  };

  const handleOpenQuoteModal = (req?: CustomJobRequest) => {
    setQuotingRequest(req || null);
    setIsQuoteModalOpen(true);
  };

  const handleSendQuote = (newQuote: CustomerQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
    if (quotingRequest) {
      setCustomRequests(prev =>
        prev.map(r =>
          r.id === quotingRequest.id
            ? { ...r, status: 'assigned' }
            : r
        )
      );
    }
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const handleConvertQuoteToBooking = (quote: CustomerQuote) => {
    const bookingRef = `VRD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: GardenJobBooking = {
      id: `booking_${Date.now()}`,
      bookingRef,
      serviceTitle: quote.serviceTitle,
      yardSize: 'medium',
      yardSqFt: 500,
      lawnHeight: 'tidy',
      wasteHandling: 'removal_haul',
      frequency: 'one_off',
      scheduledDate: quote.proposedDate.split('·')[0].trim() || 'This Week',
      timeSlot: quote.proposedDate.split('·')[1]?.trim() || '9:00 AM - 1:00 PM',
      status: 'scheduled',
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone || '07700 900142',
      address: {
        street: quote.propertyAddress.split(',')[0] || 'Property Street',
        city: 'London',
        postcode: quote.postcode,
        accessNotes: quote.notes || 'Front and side gate access'
      },
      pricing: {
        baseAmount: quote.totalAmount,
        sizeMultiplierAmount: 0,
        conditionSurcharge: 0,
        wasteDisposalAmount: 0,
        frequencyDiscount: 0,
        total: quote.totalAmount
      },
      createdAt: new Date().toISOString().split('T')[0],
      payment: {
        method: 'pay_on_completion',
        status: 'pending',
        amount: quote.totalAmount,
        currency: 'GBP',
        paidAt: '',
        receiptNumber: `INV-${bookingRef}`
      }
    };

    handleBookingConfirmed(newBooking);
    setQuotes(prev =>
      prev.map(q => (q.id === quote.id ? { ...q, status: 'converted' } : q))
    );
  };

  useEffect(() => {
    try {
      if (currentUserEmail) {
        localStorage.setItem('verdant_user_email', currentUserEmail);
      } else {
        localStorage.removeItem('verdant_user_email');
      }
    } catch (e) {
      // ignore
    }
  }, [currentUserEmail]);

  useEffect(() => {
    try {
      localStorage.setItem('verdant_services', JSON.stringify(services));
    } catch (e) {
      // ignore
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('verdant_gardeners', JSON.stringify(gardeners));
    } catch (e) {
      // ignore
    }
  }, [gardeners]);

  useEffect(() => {
    try {
      localStorage.setItem('verdant_bookings', JSON.stringify(bookings));
    } catch (e) {
      // ignore
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('verdant_gardener_applications', JSON.stringify(gardenerApplications));
    } catch (e) {
      // ignore
    }
  }, [gardenerApplications]);

  useEffect(() => {
    try {
      localStorage.setItem('verdant_custom_requests', JSON.stringify(customRequests));
    } catch (e) {
      // ignore
    }
  }, [customRequests]);

  // Pre-fill parameters for booking modal
  const [bookingPreset, setBookingPreset] = useState<{
    serviceId: string;
    gardenerId?: string;
    yardSize: YardSize;
    postcode: string;
  }>({
    serviceId: 'lawn-care',
    gardenerId: undefined,
    yardSize: 'medium',
    postcode: 'N5 2UP'
  });

  const [estimatorServiceId, setEstimatorServiceId] = useState<string>('lawn-care');

  // Handlers - Redirect booking to direct phone quote desk as requested
  const handleOpenBooking = () => {
    handleOpenCallToBookQuote();
  };

  const handleStartBookingFromHero = (serviceId?: string, yardSize?: YardSize, postcode?: string) => {
    const svc = services.find(s => s.id === serviceId);
    handleOpenCallToBookQuote({
      serviceTitle: svc?.title || 'Gardening Service',
      estimatedPrice: svc?.basePrice || 45,
      yardSize: yardSize || 'medium',
      postcode: postcode || 'N5 2UP'
    });
  };

  const handleSelectServiceFromGrid = (service: GardeningService) => {
    handleOpenCallToBookQuote({
      serviceTitle: service.title,
      estimatedPrice: service.basePrice
    });
  };

  const handleOpenEstimatorWithService = (serviceId: string) => {
    setEstimatorServiceId(serviceId);
    setActiveTab('estimator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookWithEstimate = (estimateData: {
    serviceId: string;
    yardSize: YardSize;
    lawnHeight: LawnHeight;
    wasteHandling: WasteHandling;
    frequency: BookingFrequency;
    addOns: string[];
    pricing: any;
  }) => {
    const svc = services.find(s => s.id === estimateData.serviceId);
    handleOpenCallToBookQuote({
      serviceTitle: svc?.title || 'Gardening Service',
      estimatedPrice: estimateData.pricing.total,
      yardSize: estimateData.yardSize
    });
  };

  const handleBookSpecificGardener = (gardener: GardenerProfile) => {
    handleOpenCallToBookQuote({
      serviceTitle: `Gardening Request with ${gardener.name}`
    });
  };

  const handleBookingConfirmed = (newBooking: GardenJobBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleJobPosted = (newJob: CustomJobRequest) => {
    setCustomRequests(prev => [newJob, ...prev]);
  };

  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      handleUpdateBookingStatus(id, 'cancelled');
    }
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateBookingPayment = (bookingId: string, payment: BookingPayment) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, payment } : b))
    );
  };

  // Clear every booking (Direct user requirement)
  const handleClearAllBookings = () => {
    if (window.confirm('Clear all bookings? This will remove every booking from the system.')) {
      setBookings([]);
      try {
        localStorage.removeItem('verdant_bookings');
      } catch (e) {}
    }
  };

  // Clear every gardener application (Direct user requirement)
  const handleClearAllApplications = () => {
    if (window.confirm('Clear all gardener applications and bids?')) {
      setGardenerApplications([]);
      setCustomRequests([]);
      try {
        localStorage.removeItem('verdant_gardener_applications');
        localStorage.removeItem('verdant_custom_requests');
      } catch (e) {}
    }
  };

  const handleUpdateGardener = (updated: GardenerProfile) => {
    setGardeners(prev => prev.map(g => (g.id === updated.id ? updated : g)));
  };

  const handleUpdateServicePrice = (serviceId: string, newBasePrice: number) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, basePrice: newBasePrice } : s))
    );
  };

  const handleAddService = (newService: GardeningService) => {
    setServices(prev => [newService, ...prev]);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleResetServices = () => {
    setServices(GARDENING_SERVICES);
    try {
      localStorage.setItem('verdant_services', JSON.stringify(GARDENING_SERVICES));
    } catch (e) {}
  };

  const handleAcceptBid = (requestId: string, bid: JobBid) => {
    const req = customRequests.find(r => r.id === requestId);
    if (!req) return;

    const newBooking: GardenJobBooking = {
      id: `book-${Date.now()}`,
      bookingRef: `VRD-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceTitle: req.title,
      gardenerId: bid.gardenerId,
      gardenerName: bid.gardenerName,
      yardSize: req.yardSize,
      yardSqFt: 1200,
      lawnHeight: 'tidy',
      wasteHandling: 'removal_haul',
      frequency: 'one_off',
      scheduledDate: bid.availableDate,
      timeSlot: 'Morning (09:00 - 12:00)',
      status: 'scheduled',
      customerName: 'Claire Davenport',
      customerEmail: 'claire@example.com',
      customerPhone: '+44 7700 900142',
      address: {
        street: '14 Elmwood Crescent',
        city: 'London',
        postcode: req.postcode,
        accessNotes: 'Side gate unlocked.'
      },
      pricing: {
        baseAmount: bid.quoteAmount,
        sizeMultiplierAmount: 0,
        conditionSurcharge: 0,
        wasteDisposalAmount: 0,
        frequencyDiscount: 0,
        total: bid.quoteAmount
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [newBooking, ...prev]);
    setCustomRequests(prev => prev.filter(r => r.id !== requestId));
    setActiveTab('my-bookings');
  };

  const handleSubmitReview = (bookingId: string, review: BookingReview) => {
    // 1. Update booking with review
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, review } : b))
    );

    // 2. Find target booking and update gardener rating
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking?.gardenerId) {
      setGardeners(prev =>
        prev.map(g => {
          if (g.id === targetBooking.gardenerId) {
            const newCount = g.reviewsCount + 1;
            const newRating =
              Math.round(((g.rating * g.reviewsCount + review.rating) / newCount) * 100) / 100;
            const newRecentReview = {
              id: review.id,
              author: targetBooking.customerName || 'Verified Customer',
              date: 'Today',
              rating: review.rating,
              comment: review.comment,
              serviceName: targetBooking.serviceTitle
            };
            return {
              ...g,
              reviewsCount: newCount,
              rating: newRating,
              recentReviews: [newRecentReview, ...g.recentReviews]
            };
          }
          return g;
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F4] text-stone-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={handleOpenBooking}
        onCallToBookQuote={() => handleOpenCallToBookQuote()}
        onOpenCustomJob={() => setIsCustomJobModalOpen(true)}
        bookingsCount={bookings.filter(b => b.status === 'scheduled' || b.status === 'en_route' || b.status === 'in_progress').length}
        openRequestsCount={customRequests.length}
        currentUserEmail={currentUserEmail}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        businessName={platformConfig.businessName || 'Verdant'}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'services' && (
          <>
            <HeroSection
              services={services}
              onStartBooking={handleStartBookingFromHero}
              onCallToBookQuote={handleOpenCallToBookQuote}
              onNavigateToEstimator={() => setActiveTab('estimator')}
              onNavigateToGardeners={() => setActiveTab('gardeners')}
              onSeeOurWork={() => setActiveTab('our-work')}
              businessName={platformConfig.businessName || 'Verdant'}
              supportPhone={platformConfig.supportPhone}
            />
            <ServiceGrid
              services={services}
              isAdmin={isAdmin}
              onSelectService={(service) =>
                handleOpenCallToBookQuote({
                  serviceTitle: service.title,
                  estimatedPrice: service.basePrice
                })
              }
              onOpenEstimatorWithService={handleOpenEstimatorWithService}
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
              onResetServices={handleResetServices}
            />
          </>
        )}

        {activeTab === 'our-work' && (
          <OurWorkView
            galleryItems={galleryItems}
            isAdmin={isAdmin}
            onAddPic={handleAddGalleryItem}
            onDeletePic={handleDeleteGalleryItem}
            onCallToBookQuote={handleOpenCallToBookQuote}
            supportPhone={platformConfig.supportPhone}
            businessName={platformConfig.businessName || 'Verdant'}
          />
        )}

        {activeTab === 'estimator' && (
          <EstimatorCalculator
            services={services}
            initialServiceId={estimatorServiceId}
            onBookWithEstimate={(data) => {
              const svc = services.find(s => s.id === data.serviceId);
              handleOpenCallToBookQuote({
                serviceTitle: svc?.title || 'Gardening Service',
                estimatedPrice: data.pricing.total,
                yardSize: data.yardSize
              });
            }}
          />
        )}

        {activeTab === 'gardeners' && (
          <GardenerDirectory
            gardeners={gardeners}
            onBookGardener={(g) =>
              handleOpenCallToBookQuote({
                serviceTitle: `Gardening Request with ${g.name}`
              })
            }
          />
        )}

        {activeTab === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            customRequests={customRequests}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onCancelBooking={handleCancelBooking}
            onAcceptBid={handleAcceptBid}
            onOpenBookingModal={() => handleOpenCallToBookQuote()}
            onOpenCustomJobModal={() => setIsCustomJobModalOpen(true)}
            onSubmitReview={handleSubmitReview}
            onUpdateBookingPayment={handleUpdateBookingPayment}
            businessName={platformConfig.businessName || 'Verdant'}
          />
        )}

        {activeTab === 'gardener-portal' && (
          <GardenerPortalView
            bookings={bookings}
            customRequests={customRequests}
            onUpdateStatus={handleUpdateBookingStatus}
            onAcceptJobAsPro={(id) => handleUpdateBookingStatus(id, 'scheduled')}
            onSwitchToCustomer={() => setActiveTab('services')}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardView
            currentUserEmail={currentUserEmail}
            onLoginAsAdmin={() => {
              setCurrentUserEmail('Kairowood@gmail.com');
              try {
                localStorage.setItem('verdant_user_email', 'Kairowood@gmail.com');
              } catch (e) {}
              setActiveTab('admin');
            }}
            onLogout={() => {
              setCurrentUserEmail(null);
              try {
                localStorage.removeItem('verdant_user_email');
              } catch (e) {}
              setActiveTab('services');
            }}
            bookings={bookings}
            gardenerApplications={gardenerApplications}
            customRequests={customRequests}
            quotes={quotes}
            gardeners={gardeners}
            services={services}
            platformConfig={platformConfig}
            onUpdatePlatformConfig={setPlatformConfig}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onClearAllBookings={handleClearAllBookings}
            onClearAllApplications={handleClearAllApplications}
            onUpdateGardener={handleUpdateGardener}
            onUpdateServicePrice={handleUpdateServicePrice}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
            onResetServices={handleResetServices}
            onOpenQuoteModal={handleOpenQuoteModal}
            onConvertQuoteToBooking={handleConvertQuoteToBooking}
            onDeleteQuote={handleDeleteQuote}
            galleryItems={galleryItems}
            onAddGalleryItem={handleAddGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
          />
        )}

        {activeTab === 'login' && (
          <CustomerLoginView
            currentUserEmail={currentUserEmail}
            onLoginSuccess={(email, isUserAdmin) => {
              setCurrentUserEmail(email);
              try {
                localStorage.setItem('verdant_user_email', email);
              } catch (e) {}
              if (isUserAdmin || email.toLowerCase() === 'kairowood@gmail.com') {
                setActiveTab('admin');
              } else {
                setActiveTab('my-bookings');
              }
            }}
            onLogout={() => {
              setCurrentUserEmail(null);
              try {
                localStorage.removeItem('verdant_user_email');
              } catch (e) {}
              setActiveTab('services');
            }}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookingModal={handleOpenBooking}
          />
        )}
      </main>

      {/* Account / Admin Sign In Modal */}
      <AdminLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUserEmail={currentUserEmail}
        onLogin={(email) => {
          setCurrentUserEmail(email);
          try {
            localStorage.setItem('verdant_user_email', email);
          } catch (e) {}
          if (email.toLowerCase() === 'kairowood@gmail.com') {
            setActiveTab('admin');
          } else {
            setActiveTab('my-bookings');
          }
        }}
        onLogout={() => {
          setCurrentUserEmail(null);
          try {
            localStorage.removeItem('verdant_user_email');
          } catch (e) {}
          if (activeTab === 'admin') {
            setActiveTab('services');
          }
        }}
        onOpenFullLoginPage={() => {
          setActiveTab('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
        services={services}
        currentUserEmail={currentUserEmail}
        platformConfig={platformConfig}
        initialServiceId={bookingPreset.serviceId}
        initialGardenerId={bookingPreset.gardenerId}
        initialYardSize={bookingPreset.yardSize}
        initialPostcode={bookingPreset.postcode}
      />

      {/* Custom Job Request Modal */}
      <CustomJobModal
        isOpen={isCustomJobModalOpen}
        onClose={() => setIsCustomJobModalOpen(false)}
        onJobPosted={handleJobPosted}
      />

      {/* Quote Customer Modal */}
      <QuoteCustomerModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setQuotingRequest(null);
        }}
        onSendQuote={handleSendQuote}
        initialRequest={quotingRequest}
        platformConfig={platformConfig}
        gardenerName={currentUserEmail === 'Kairowood@gmail.com' ? `${platformConfig.businessName || 'Verdant'} Admin` : undefined}
      />

      {/* Call To Book Quote Modal */}
      <CallToBookQuoteModal
        isOpen={isCallToBookModalOpen}
        onClose={() => {
          setIsCallToBookModalOpen(false);
          setCallInquiryDetails(null);
        }}
        platformConfig={platformConfig}
        inquiryDetails={callInquiryDetails}
        onRequestCallback={handleRequestCallback}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        platformConfig={platformConfig}
        isAdmin={isAdmin}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
