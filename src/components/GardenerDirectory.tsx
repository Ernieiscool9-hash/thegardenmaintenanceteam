import React, { useState } from 'react';
import { VETTED_GARDENERS } from '../data/mockData';
import { GardenerProfile } from '../types/gardening';
import { Star, MapPin, Search, Calendar, ShieldCheck, ArrowRight, Phone } from 'lucide-react';

interface GardenerDirectoryProps {
  gardeners?: GardenerProfile[];
  onBookGardener: (gardener: GardenerProfile) => void;
}

export const GardenerDirectory: React.FC<GardenerDirectoryProps> = ({
  gardeners = VETTED_GARDENERS,
  onBookGardener
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGardeners = gardeners.filter(g => {
    return (
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
          Our Team
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold mb-2">
          Meet our local gardeners
        </h2>
        <p className="text-stone-600 text-sm sm:text-base">
          All gardeners are background checked, insured, and verified for quality work.
        </p>
      </div>

      {/* Simple Search bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by gardener name or neighborhood..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 text-stone-900 shadow-xs"
          />
        </div>
      </div>

      {/* Gardeners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGardeners.map((gardener) => (
          <div
            key={gardener.id}
            className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white font-serif font-bold text-lg flex items-center justify-center shrink-0">
                  {gardener.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
                    {gardener.name}
                  </h3>
                  <div className="flex items-center text-xs text-amber-500 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    <span>{gardener.rating}</span>
                    <span className="text-stone-400 font-normal ml-1">({gardener.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Location & Rate */}
              <div className="flex items-center justify-between text-xs text-stone-600 mb-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-1 text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{gardener.location}</span>
                </div>
                <div className="font-mono font-bold text-stone-900">
                  £{gardener.hourlyRate}/hr
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {gardener.bio}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {gardener.specialties.slice(0, 3).map((spec, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[11px]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => onBookGardener(gardener)}
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Call to Request {gardener.name.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
