import React, { useState, useRef } from 'react';
import { X, Upload, Image, Link, Check, Sparkles, MapPin, Tag } from 'lucide-react';
import { WorkGalleryItem, ServiceCategory } from '../types/gardening';
import heroImg from '../assets/images/hero_garden_landscaping_1790637196480.jpg';
import lawnImg from '../assets/images/service_lawn_mowing_1790637208295.jpg';
import hedgeImg from '../assets/images/service_hedge_trimming_1790637219652.jpg';
import clearanceImg from '../assets/images/service_garden_clearance_1790637230334.jpg';
import plantingImg from '../assets/images/service_flower_planting_1790637238791.jpg';

interface AddPicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPic: (pic: WorkGalleryItem) => void;
}

export const AddPicModal: React.FC<AddPicModalProps> = ({
  isOpen,
  onClose,
  onAddPic
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory | 'transformation' | 'general'>('lawn');
  const [location, setLocation] = useState('Highbury & Islington');
  const [description, setDescription] = useState('');
  const [gardenerName, setGardenerName] = useState('');
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presets = [
    { label: 'Lawn Stripes & Edging', url: lawnImg, cat: 'lawn' },
    { label: 'Hedge Trimming & Pruning', url: hedgeImg, cat: 'hedge' },
    { label: 'Garden Clearance', url: clearanceImg, cat: 'clearance' },
    { label: 'Flower Planting & Mulch', url: plantingImg, cat: 'planting' },
    { label: 'Full Garden Landscaping', url: heroImg, cat: 'transformation' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for this picture.');
      return;
    }
    const finalImage = previewUrl || imageUrl.trim();
    if (!finalImage) {
      setError('Please upload a photo, paste an image link, or choose a preset.');
      return;
    }

    const newItem: WorkGalleryItem = {
      id: `work-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      category,
      imageUrl: finalImage,
      location: location.trim() || 'London & Greater Suburbs',
      description: description.trim() || 'Professional gardening work completed to high standards.',
      completedDate: 'Recently completed',
      gardenerName: gardenerName.trim() || 'Verdant Team'
    };

    onAddPic(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 text-left animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Add Work Picture
              </h3>
              <p className="text-xs text-stone-500">
                Upload or link a photo of completed gardening work to display in "See Our Work".
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Source Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Photo Source
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-xl mb-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setImageSourceMode('upload')}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageSourceMode === 'upload'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode('url')}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageSourceMode === 'url'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Image Link</span>
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode('presets')}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageSourceMode === 'presets'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presets</span>
              </button>
            </div>

            {/* Mode: Upload */}
            {imageSourceMode === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-6 h-6 text-emerald-700" />
                  <span className="text-xs font-bold text-stone-800">
                    Click to choose a photo from your computer or phone
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Supports JPG, PNG, WebP up to 10MB
                  </span>
                </button>
              </div>
            )}

            {/* Mode: Link */}
            {imageSourceMode === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or web image link"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            )}

            {/* Mode: Presets */}
            {imageSourceMode === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(p.url);
                      setImageUrl(p.url);
                      setCategory(p.cat as any);
                      if (!title) setTitle(p.label);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 text-left p-1.5 transition-all cursor-pointer ${
                      previewUrl === p.url
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                    <span className="text-[11px] font-semibold text-stone-800 line-clamp-1 block">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Image Preview */}
            {previewUrl && (
              <div className="mt-3 relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 max-h-48 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageUrl('');
                  }}
                  className="absolute top-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-white p-1 rounded-lg text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Picture Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Work Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Front Garden Box Hedge Shaping & Lawn Stripes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="lawn">Lawn Mowing & Edging</option>
                <option value="hedge">Hedge & Bush Trimming</option>
                <option value="clearance">Garden Clearance</option>
                <option value="planting">Flower Bed Planting</option>
                <option value="trees">Tree & Shrub Pruning</option>
                <option value="maintenance">Weeding & Maintenance</option>
                <option value="transformation">Full Transformation</option>
                <option value="other">Other Service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Location / Borough
              </label>
              <input
                type="text"
                placeholder="e.g. Highbury & Islington (N5)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Gardener Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Gardener / Crew (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Arthur Pendelton or Team Verdant"
              value={gardenerName}
              onChange={(e) => setGardenerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Description / Job Details
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the work done, tasks completed, or condition before and after..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Picture</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
