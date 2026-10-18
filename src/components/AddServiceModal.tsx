import React, { useState } from 'react';
import { GardeningService, ServiceCategory } from '../types/gardening';
import { X, Plus, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import lawnImg from '../assets/images/service_lawn_mowing_1790637208295.jpg';
import hedgeImg from '../assets/images/service_hedge_trimming_1790637219652.jpg';
import clearanceImg from '../assets/images/service_garden_clearance_1790637230334.jpg';
import plantingImg from '../assets/images/service_flower_planting_1790637238791.jpg';
import heroImg from '../assets/images/hero_garden_landscaping_1790637196480.jpg';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (newService: GardeningService) => void;
}

const PRESET_IMAGES = [
  { label: 'Lawn & Grass', url: lawnImg },
  { label: 'Hedges & Shrubs', url: hedgeImg },
  { label: 'Clearance & Brambles', url: clearanceImg },
  { label: 'Planting & Flowers', url: plantingImg },
  { label: 'Garden Landscaping', url: heroImg }
];

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onAddService
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('maintenance');
  const [shortDesc, setShortDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>(45);
  const [priceUnit, setPriceUnit] = useState('from');
  const [estimatedHours, setEstimatedHours] = useState<number | ''>(2);
  const [recommendedFrequency, setRecommendedFrequency] = useState('As needed');
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [tasks, setTasks] = useState<string[]>([
    'Site inspection and preparation',
    'Specialist gardening treatment',
    'Complete green waste collection and sweep'
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskInput.trim()) {
      setTasks([...tasks, newTaskInput.trim()]);
      setNewTaskInput('');
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a service title.');
      return;
    }

    if (basePrice === '' || Number(basePrice) <= 0) {
      setError('Please provide a valid base rate greater than £0.');
      return;
    }

    const finalImage = isCustomImage && customImageUrl.trim() ? customImageUrl.trim() : selectedImage;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const serviceId = `${slug}-${Date.now().toString().slice(-4)}`;

    const newService: GardeningService = {
      id: serviceId,
      title: title.trim(),
      category,
      shortDesc: shortDesc.trim() || 'Professional gardening service delivered by vetted local professionals.',
      detailedDesc: detailedDesc.trim() || shortDesc.trim() || 'Full service including tools, tidy cleanup, and waste collection.',
      basePrice: Number(basePrice),
      priceUnit: priceUnit.trim() || 'from',
      estimatedHours: estimatedHours !== '' ? Number(estimatedHours) : 2.0,
      image: finalImage,
      includedTasks: tasks.length > 0 ? tasks : ['Complete task execution', 'Green waste collection and clean sweep'],
      recommendedFrequency: recommendedFrequency.trim() || 'As needed'
    };

    onAddService(newService);
    // Reset form
    setTitle('');
    setShortDesc('');
    setDetailedDesc('');
    setBasePrice(45);
    setTasks([
      'Site inspection and preparation',
      'Specialist gardening treatment',
      'Complete green waste collection and sweep'
    ]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">Add New Gardening Service</h2>
              <p className="text-xs text-stone-300">
                Create a new service offering that appears across the website catalog and estimator.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Title and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Service Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Patio Jet Washing & De-weeding"
                required
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
              >
                <option value="lawn">Lawn Care & Mowing</option>
                <option value="hedge">Hedge & Bush Trimming</option>
                <option value="maintenance">Weeding & Garden Tidy</option>
                <option value="clearance">Garden Clearance & Waste</option>
                <option value="planting">Planting & Flower Beds</option>
                <option value="trees">Small Tree & Shrub Pruning</option>
                <option value="other">Other Gardening Service</option>
              </select>
            </div>
          </div>

          {/* Pricing & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Base Rate (£) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-stone-500 font-bold">£</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="45"
                  required
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Price Label
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
              >
                <option value="from">from (fixed base)</option>
                <option value="per visit">per visit</option>
                <option value="per hour">per hour</option>
                <option value="fixed rate">fixed rate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2"
                className="w-full px-3 py-1.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* Short & Detailed Descriptions */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Short Summary (Shown on service card)
              </label>
              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="e.g. Deep jet washing for patios, paths, and decking to clear slippery moss."
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Detailed Scope Description
              </label>
              <textarea
                value={detailedDesc}
                onChange={(e) => setDetailedDesc(e.target.value)}
                rows={2}
                placeholder="Full description of what the gardener does, safety measures, and equipment provided..."
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Card Image</span>
              <button
                type="button"
                onClick={() => setIsCustomImage(!isCustomImage)}
                className="text-[11px] text-emerald-800 hover:underline normal-case font-semibold cursor-pointer"
              >
                {isCustomImage ? '← Use image preset' : 'Or enter custom image URL'}
              </button>
            </label>

            {!isCustomImage ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 text-left cursor-pointer transition-all aspect-video ${
                      selectedImage === preset.url
                        ? 'border-emerald-700 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 text-[10px] text-white px-1.5 py-0.5 font-medium truncate text-center">
                      {preset.label}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Included Checklist Tasks */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Included Tasks Checklist ({tasks.length})
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              Bullet points shown to the customer explaining what is guaranteed in this visit.
            </p>

            <div className="space-y-1.5 mb-2.5">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <div className="flex items-center gap-2 text-stone-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{task}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(index)}
                    className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newTaskInput.trim()) {
                      setTasks([...tasks, newTaskInput.trim()]);
                      setNewTaskInput('');
                    }
                  }
                }}
                placeholder="Add another included task..."
                className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Recommended Frequency */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Recommended Frequency
            </label>
            <input
              type="text"
              value={recommendedFrequency}
              onChange={(e) => setRecommendedFrequency(e.target.value)}
              placeholder="e.g. Every 2 weeks, Monthly, or Seasonal"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Service</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
