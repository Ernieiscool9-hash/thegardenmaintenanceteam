import React, { useState } from 'react';
import { GardeningService } from '../types/gardening';
import { Check, ArrowRight, Calculator, Plus, Trash2, RotateCcw, AlertCircle, Phone } from 'lucide-react';
import { AddServiceModal } from './AddServiceModal';

interface ServiceGridProps {
  services: GardeningService[];
  isAdmin?: boolean;
  onSelectService: (service: GardeningService) => void;
  onOpenEstimatorWithService: (serviceId: string) => void;
  onAddService?: (newService: GardeningService) => void;
  onDeleteService?: (serviceId: string) => void;
  onResetServices?: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  isAdmin = false,
  onSelectService,
  onOpenEstimatorWithService,
  onAddService,
  onDeleteService,
  onResetServices
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <section className="py-14 sm:py-18 bg-[#F8F9F5]">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        {/* Section Header positioned to the side of the screen */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
          <div className="max-w-md text-left">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Services & Upfront Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold mb-2">
              What do you need help with?
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Choose a service below. Every visit includes equipment, tidy cleanup, and green waste disposal.
            </p>
          </div>

          {/* Admin quick toolbar */}
          {isAdmin && (
            <div className="inline-flex items-center gap-2 p-1.5 bg-emerald-50 border border-emerald-200 rounded-xl shrink-0 self-start md:self-end">
              <span className="text-xs font-bold text-emerald-900 px-2">Admin Tools:</span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
              {onResetServices && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset services to standard defaults?')) {
                      onResetServices();
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Defaults</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category filter tabs aligned to the side */}
        <div className="flex flex-wrap items-center justify-start gap-2 mb-10">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'lawn', label: 'Lawn Mowing' },
            { id: 'hedge', label: 'Hedge Trimming' },
            { id: 'maintenance', label: 'Weeding & Tidy' },
            { id: 'clearance', label: 'Garden Clearance' },
            { id: 'planting', label: 'Planting' },
            { id: 'trees', label: 'Pruning' },
            { id: 'other', label: 'Other Services' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid or Empty State */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">No services found</h3>
              <p className="text-xs text-stone-500 mt-1">
                {activeCategory === 'all'
                  ? 'There are currently no services listed.'
                  : `No services found in this category.`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {activeCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View All Services
                </button>
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              )}
              {isAdmin && onResetServices && (
                <button
                  type="button"
                  onClick={onResetServices}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Restore Defaults
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative group"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-white/95 text-stone-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm font-mono">
                    {service.priceUnit ? `${service.priceUnit} ` : ''}£{service.basePrice}
                  </div>

                  {/* Admin Delete Quick Button */}
                  {isAdmin && onDeleteService && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
                          onDeleteService(service.id);
                        }
                      }}
                      className="absolute top-3 left-3 bg-red-600/90 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-lg font-serif font-bold text-stone-900">
                        {service.title}
                      </h3>
                      <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 shrink-0">
                        {service.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Included Tasks Checklist */}
                    {service.includedTasks && service.includedTasks.length > 0 && (
                      <div className="space-y-1.5 mb-6 text-xs text-stone-600 border-t border-stone-100 pt-3">
                        {service.includedTasks.slice(0, 4).map((task, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectService(service)}
                      className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Call to Book Quote</span>
                    </button>

                    <button
                      onClick={() => onOpenEstimatorWithService(service.id)}
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
                      title="Calculate exact price"
                    >
                      <Calculator className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddService={(newSvc) => {
          if (onAddService) {
            onAddService(newSvc);
          }
        }}
      />
    </section>
  );
};
