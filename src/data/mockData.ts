import { GardeningService, GardenerProfile, GardenJobBooking, CustomJobRequest, GardenerApplication, CustomerQuote, WorkGalleryItem } from '../types/gardening';
import heroImg from '../assets/images/hero_garden_landscaping_1790637196480.jpg';
import lawnImg from '../assets/images/service_lawn_mowing_1790637208295.jpg';
import hedgeImg from '../assets/images/service_hedge_trimming_1790637219652.jpg';
import clearanceImg from '../assets/images/service_garden_clearance_1790637230334.jpg';
import plantingImg from '../assets/images/service_flower_planting_1790637238791.jpg';

export const HERO_IMAGE = heroImg;

export const GARDENING_SERVICES: GardeningService[] = [
  {
    id: 'lawn-care',
    title: 'Lawn Mowing & Edging',
    category: 'lawn',
    shortDesc: 'Clean grass cutting with neat edges and all paths swept tidy.',
    detailedDesc: 'Full lawn cut to your preferred height, string-trimming around fences and edges, and blowing grass clippings off paths and patios.',
    basePrice: 35,
    priceUnit: 'from',
    estimatedHours: 1.0,
    image: lawnImg,
    includedTasks: [
      'Mowing front and back lawns',
      'Neat border edging',
      'Clippings collected & bagged',
      'Paths and driveways swept'
    ],
    recommendedFrequency: 'Every 2 weeks'
  },
  {
    id: 'hedge-trimming',
    title: 'Hedge & Bush Trimming',
    category: 'hedge',
    shortDesc: 'Neat, straight trimming for hedges, bushes, and decorative shrubs.',
    detailedDesc: 'Level tops, tidy straight sides, and removal of overgrown branches. Includes full rake-up and cleanup of all hedge trimmings.',
    basePrice: 50,
    priceUnit: 'from',
    estimatedHours: 1.5,
    image: hedgeImg,
    includedTasks: [
      'Level top and side hedge cutting',
      'Trimming overgrown shrubs',
      'Dead branch removal',
      'Tarp drop and clean sweep'
    ],
    recommendedFrequency: 'Monthly or seasonal'
  },
  {
    id: 'weeding-mulch',
    title: 'Garden Weeding & Tidy Up',
    category: 'maintenance',
    shortDesc: 'Weeding flower beds, clearing dead plants, and making your garden look fresh.',
    detailedDesc: 'Hand-weeding flower beds and borders, cleaning up patio weeds, deadheading flowers, and leaving your garden tidy and presentable.',
    basePrice: 45,
    priceUnit: 'from',
    estimatedHours: 2.0,
    image: lawnImg,
    includedTasks: [
      'Weeding beds, borders, and paths',
      'Clearing dead leaves and branches',
      'Light pruning of shrubs',
      'Full patio tidy and sweep'
    ],
    recommendedFrequency: 'Monthly'
  },
  {
    id: 'garden-clearance',
    title: 'Garden Clearance & Clean Up',
    category: 'clearance',
    shortDesc: 'Tackling overgrown brambles, wild weeds, and removing garden rubbish.',
    detailedDesc: 'Cutting back runaway weeds, clearing thick brambles and tall grass, and packing green waste so you get your garden back.',
    basePrice: 65,
    priceUnit: 'from',
    estimatedHours: 3.0,
    image: clearanceImg,
    includedTasks: [
      'Cutting back overgrown areas',
      'Removing thick weeds & brambles',
      'Cutting down dead bushes',
      'Bagging green waste for collection'
    ],
    recommendedFrequency: 'As needed'
  },
  {
    id: 'flower-planting',
    title: 'Planting & Flower Beds',
    category: 'planting',
    shortDesc: 'Planting flowers, adding fresh compost, and caring for your flower beds.',
    detailedDesc: 'Planting seasonal flowers, shrubs, spreading fresh compost or mulch, and giving your garden beds a vibrant refresh.',
    basePrice: 40,
    priceUnit: 'from',
    estimatedHours: 2.0,
    image: plantingImg,
    includedTasks: [
      'Planting flowers and shrubs',
      'Turning over and weeding soil',
      'Adding mulch or compost',
      'Watering and care advice'
    ],
    recommendedFrequency: 'Spring & Autumn'
  },
  {
    id: 'tree-pruning',
    title: 'Small Tree & Shrub Pruning',
    category: 'trees',
    shortDesc: 'Pruning small fruit trees and tall bushes to keep them healthy.',
    detailedDesc: 'Pruning fruit trees and garden shrubs under 4 meters. Removes dead wood, opens up sunlight, and keeps plants growing nicely.',
    basePrice: 60,
    priceUnit: 'from',
    estimatedHours: 2.0,
    image: hedgeImg,
    includedTasks: [
      'Pruning dead or crossing branches',
      'Shaping small fruit trees & bushes',
      'Clearing cut branches and twigs',
      'Clean finish and sweep'
    ],
    recommendedFrequency: 'Once a year'
  }
];

export const VETTED_GARDENERS: GardenerProfile[] = [
  {
    id: 'g-arthur',
    name: 'Arthur Pendelton',
    title: 'Friendly Local Gardener',
    location: 'Highbury & Islington',
    distanceMiles: 1.8,
    rating: 4.96,
    reviewsCount: 142,
    experienceYears: 12,
    hourlyRate: 36,
    bio: 'Experienced, reliable gardener. Specializes in lawn care, hedge trimming, and seasonal garden tidy-ups. Always leaves gardens tidy and spotless.',
    specialties: ['Lawn Mowing', 'Hedge Trimming', 'Garden Tidy Up', 'Border Care'],
    certifications: ['Insured', 'Waste Carrier License', 'RHS Trained'],
    equipment: ['Roller Mower', 'Cordless Hedge Trimmers', 'Leaf Blower'],
    availableThisWeek: true,
    insuranceCoverage: '£2M Public Liability',
    completedJobsCount: 486,
    recentReviews: [
      {
        id: 'rev-1',
        author: 'Eleanor Vance',
        date: '3 days ago',
        rating: 5,
        comment: 'Arthur was fantastic. Lawn looks great and he cleared up every single clipping.',
        serviceName: 'Lawn Mowing & Edging'
      }
    ]
  },
  {
    id: 'g-clara',
    name: 'Clara Hughes',
    title: 'Plant & Garden Specialist',
    location: 'Hampstead & Highgate',
    distanceMiles: 2.4,
    rating: 4.98,
    reviewsCount: 118,
    experienceYears: 9,
    hourlyRate: 34,
    bio: 'Friendly gardener with a passion for beautiful flower beds, thorough weeding, and regular maintenance. Loves making outdoor spaces welcoming.',
    specialties: ['Weeding & Tidy Up', 'Flower Planting', 'Hedge Trimming', 'Soil Care'],
    certifications: ['Fully Insured', 'Horticulture Diploma'],
    equipment: ['Strimmer', 'Hand Tools', 'Pruners', 'Lawn Mower'],
    availableThisWeek: true,
    insuranceCoverage: '£2M Public Liability',
    completedJobsCount: 310,
    recentReviews: [
      {
        id: 'rev-3',
        author: 'Sarah Jenkins',
        date: '1 week ago',
        rating: 5,
        comment: 'Clara weeded our overgrown flower beds and planted lovely perennials. Highly recommended!',
        serviceName: 'Garden Weeding & Tidy Up'
      }
    ]
  },
  {
    id: 'g-david',
    name: 'David MacLeod',
    title: 'Hedge & Tree Specialist',
    location: 'Richmond & Kew',
    distanceMiles: 3.1,
    rating: 4.92,
    reviewsCount: 165,
    experienceYears: 15,
    hourlyRate: 38,
    bio: 'Specialist in neat hedge trimming, shrub shaping, and garden clearances. Fast, polite, and very tidy with clippings.',
    specialties: ['Hedge Trimming', 'Small Tree Pruning', 'Garden Clearance', 'Lawn Mowing'],
    certifications: ['Fully Insured', 'Chainsaw & Trimmer Certified'],
    equipment: ['Telescopic Trimmers', 'Heavy Duty Mower', 'Garden Shredder'],
    availableThisWeek: true,
    insuranceCoverage: '£2M Public Liability',
    completedJobsCount: 420,
    recentReviews: [
      {
        id: 'rev-4',
        author: 'Fiona Campbell',
        date: '2 weeks ago',
        rating: 5,
        comment: 'David trimmed our tall boundary hedges perfectly straight. Very polite and tidy.',
        serviceName: 'Hedge & Bush Trimming'
      }
    ]
  },
  {
    id: 'g-samuel',
    name: 'Samuel O’Connor',
    title: 'Eco Lawn & Garden Care',
    location: 'Dulwich & Greenwich',
    distanceMiles: 4.0,
    rating: 4.95,
    reviewsCount: 94,
    experienceYears: 7,
    hourlyRate: 32,
    bio: 'Uses quiet, battery-powered equipment with zero fumes. Great for family homes, quiet streets, and people working from home.',
    specialties: ['Quiet Lawn Mowing', 'Garden Weeding', 'Hedge Trimming', 'Leaf Clearing'],
    certifications: ['Fully Insured', 'Licensed Waste Carrier'],
    equipment: ['Cordless Electric Fleet', 'Quiet Mower', 'Blower & Rakes'],
    availableThisWeek: false,
    insuranceCoverage: '£2M Public Liability',
    completedJobsCount: 265,
    recentReviews: [
      {
        id: 'rev-5',
        author: 'Dr. Aris Thorne',
        date: '3 weeks ago',
        rating: 5,
        comment: 'The quiet electric tools were fantastic as I work from home. Lawn looks great.',
        serviceName: 'Lawn Mowing & Edging'
      }
    ]
  }
];

// All initial bookings and applications are cleared
export const INITIAL_BOOKINGS: GardenJobBooking[] = [];
// Initial custom requests and quote inquiries
export const INITIAL_CUSTOM_REQUESTS: CustomJobRequest[] = [
  {
    id: 'custom-1',
    title: 'Victorian Walled Garden Overhaul & Ivy Removal',
    category: 'Garden Reclamation & Clearance',
    yardSize: 'medium',
    description: 'Rear garden has been left untouched for 18 months. Overgrown English ivy crawling up brickwork and 3 dead apple trees need coppicing and removal.',
    budgetRange: '£300 - £450',
    preferredDate: 'Next 5 Days',
    postcode: 'N1 2TH',
    customerName: 'Claire Watson',
    customerEmail: 'claire.watson@gmail.com',
    customerPhone: '07700 900142',
    status: 'open',
    bids: [],
    createdAt: '2 hours ago'
  },
  {
    id: 'custom-2',
    title: 'Pergola Wisteria Pruning & Beech Hedge Shaping',
    category: 'Hedge & Bush Trimming',
    yardSize: 'large',
    description: '35m mature copper beech hedge needs annual summer trim. Large wisteria on pergola needs expert RHS winter pruning to buds.',
    budgetRange: '£180 - £260',
    preferredDate: 'This Weekend',
    postcode: 'TW9 3AB',
    customerName: 'David Miller',
    customerEmail: 'david.miller@outlook.com',
    customerPhone: '07700 900891',
    status: 'open',
    bids: [],
    createdAt: 'Today'
  }
];

export const INITIAL_QUOTES: CustomerQuote[] = [
  {
    id: 'qte-101',
    quoteRef: 'QTE-4821',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@gmail.com',
    customerPhone: '07700 900381',
    propertyAddress: '28 Church Row, Hampstead',
    postcode: 'NW3 6UP',
    serviceTitle: 'Lawn Restoration, Aeration & Overseeding',
    description: 'Complete scarification of moss-heavy lawn, hollow tine aeration, application of premium shade-tolerant seed and autumn organic top dressing.',
    items: [
      { id: 'item-1', description: 'Mechanical scarification & moss dethatching', amount: 95.00 },
      { id: 'item-2', description: 'Hollow tine aeration & organic top dressing', amount: 85.00 },
      { id: 'item-3', description: 'Overseeding with premium RHS rye-fescue blend', amount: 45.00 }
    ],
    totalAmount: 225.00,
    estimatedHours: 4.5,
    proposedDate: 'This Thursday · 9:00 AM',
    validDays: 14,
    notes: 'Access via rear side alley. Includes 50kg green waste haul-away.',
    status: 'sent',
    createdAt: 'Yesterday',
    sentBy: 'Verdant Admin'
  }
];

export const INITIAL_GARDENER_APPLICATIONS: GardenerApplication[] = [];

export const DEFAULT_PLATFORM_CONFIG = {
  businessName: 'Verdant',
  supportPhone: '+44 20 7946 0912',
  supportEmail: 'support@verdant.co.uk',
  supportHours: 'Mon – Sun · 8:00 AM – 6:00 PM',
  emergencyHotline: '+44 20 7946 0999',
  serviceLocations: [
    'Highbury & Islington (N1, N5)',
    'Hampstead & Highgate (NW3, N6)',
    'Richmond & Kew (TW9, TW10)',
    'Dulwich & Greenwich (SE21, SE10)',
    'Wimbledon & Putney (SW19, SW15)',
    'St Albans & Harpenden (AL1, AL5)',
    'Kensington & Chelsea (W8, SW3)'
  ],
  payoutCard: {
    cardholderName: 'Kairo Wood',
    cardNumber: '4532 8901 2345 7812',
    last4: '7812',
    brand: 'visa' as const,
    expiryDate: '08/29',
    cvv: '891',
    bankName: 'Barclays Business / Visa Direct',
    autoTransferEnabled: true,
    totalReceived: 0,
    lastTransferAt: 'Ready for incoming payments',
    transferMethod: 'instant_card' as const,
    transfersHistory: []
  }
};

export const INITIAL_WORK_GALLERY: WorkGalleryItem[] = [
  {
    id: 'work-1',
    title: 'Manicured Lawn & Razor-Sharp Edges',
    category: 'lawn',
    imageUrl: lawnImg,
    location: 'Highbury & Islington (N5)',
    description: 'Bi-weekly precision mowing with border string-trimming, moss reduction, and pristine path blow-down.',
    completedDate: 'Yesterday',
    gardenerName: 'Arthur Pendelton'
  },
  {
    id: 'work-2',
    title: 'Tall Boundary Laurel Hedge Level & Trim',
    category: 'hedge',
    imageUrl: hedgeImg,
    location: 'Hampstead (NW3)',
    description: 'Level top reduction and side squaring for an overgrown 3.2m laurel hedge with full green waste bagging.',
    completedDate: '3 days ago',
    gardenerName: 'David MacLeod'
  },
  {
    id: 'work-3',
    title: 'Overgrown Back Garden Clearance & Weed Removal',
    category: 'clearance',
    imageUrl: clearanceImg,
    location: 'Richmond & Kew (TW9)',
    description: 'Complete weed dig-out, bramble cutting, dead shrub removal, and raking ahead of new grass seeding.',
    completedDate: 'Last week',
    gardenerName: 'Samuel O’Connor'
  },
  {
    id: 'work-4',
    title: 'Perennial Flower Bed Planting & Organic Mulch',
    category: 'planting',
    imageUrl: plantingImg,
    location: 'Highgate (N6)',
    description: 'Rich soil conditioning, fresh perennial flowers planted with organic bark mulch for moisture retention and weed prevention.',
    completedDate: '5 days ago',
    gardenerName: 'Clara Hughes'
  },
  {
    id: 'work-5',
    title: 'Complete Garden Transformation & Lawn Stripes',
    category: 'transformation',
    imageUrl: heroImg,
    location: 'Dulwich & Greenwich (SE21)',
    description: 'Full seasonal overhaul: deep aerated lawn mowing, shaped decorative shrubs, and pristine patio boundary finish.',
    completedDate: 'This week',
    gardenerName: 'Arthur & Team'
  }
];
