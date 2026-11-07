import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Upload,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  Camera,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  FileImage,
} from 'lucide-react';
import { MemoryPhoto, BIRTHDAY_GIRL, CREATOR_NAME } from '../../types';
import { downloadMemoryImage } from '../../utils/download';

interface MemoriesSceneProps {
  onProceedToCake: () => void;
  onDownloadSuccess: (filename: string) => void;
}

const STORAGE_KEY = 'umama_birthday_photos_v2';

// Elegant initial tribute frames celebrating Umama and Malika's friendship
const INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: 'default-1',
    title: 'A Bond of Sincere Friendship',
    description: `From heartfelt conversations to shared laughter, celebrating every milestone of your life. Happy Birthday ${BIRTHDAY_GIRL}!`,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><radialGradient id="bg" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="%23831843"/><stop offset="60%" stop-color="%234c0519"/><stop offset="100%" stop-color="%23020617"/></radialGradient></defs><rect width="800" height="600" fill="url(%23bg)"/><rect x="30" y="30" width="740" height="540" fill="none" stroke="%23f59e0b" stroke-width="2" opacity="0.6"/><rect x="40" y="40" width="720" height="520" fill="none" stroke="%23fb7185" stroke-width="1" opacity="0.4"/><circle cx="400" cy="270" r="120" fill="%23fda4af" opacity="0.15"/><path d="M400,320 C360,260 290,260 290,310 C290,360 400,430 400,430 C400,430 510,360 510,310 C510,260 440,260 400,320 Z" fill="%23f43f5e" opacity="0.9"/><text x="400" y="480" font-family="Georgia" font-size="28" fill="%23fef08a" text-anchor="middle" font-weight="bold">Cherished Friendship</text><text x="400" y="520" font-family="sans-serif" font-size="16" fill="%23ffffff" text-anchor="middle" letter-spacing="2">UMAMA &amp; MALIKA MUNEER</text></svg>',
    date: '8 November',
    isCustom: false,
  },
  {
    id: 'default-2',
    title: 'Warm Smiles & Eternal Duas',
    description: 'May Allah always keep your smile shining and protect your peaceful, kind heart.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><radialGradient id="bg2" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="%233b0764"/><stop offset="60%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%23020617"/></radialGradient></defs><rect width="800" height="600" fill="url(%23bg2)"/><rect x="30" y="30" width="740" height="540" fill="none" stroke="%23fbbf24" stroke-width="2" opacity="0.6"/><circle cx="400" cy="270" r="140" fill="%23f59e0b" opacity="0.15"/><polygon points="400,210 425,275 495,280 440,325 460,390 400,350 340,390 360,325 305,280 375,275" fill="%23facc15" opacity="0.9"/><text x="400" y="480" font-family="Georgia" font-size="28" fill="%23fda4af" text-anchor="middle" font-weight="bold">Sister at Heart</text><text x="400" y="520" font-family="sans-serif" font-size="16" fill="%23e2e8f0" text-anchor="middle" letter-spacing="2">FOREVER BLESSED BY YOUR PRESENCE</text></svg>',
    date: '8 November',
    isCustom: false,
  },
  {
    id: 'default-3',
    title: 'A Golden Journey Together',
    description: 'Praying for endless happiness in your home, marriage, and wonderful life ahead.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><radialGradient id="bg3" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="%23701a75"/><stop offset="60%" stop-color="%234c0519"/><stop offset="100%" stop-color="%23020617"/></radialGradient></defs><rect width="800" height="600" fill="url(%23bg3)"/><rect x="30" y="30" width="740" height="540" fill="none" stroke="%23fb7185" stroke-width="2" opacity="0.6"/><circle cx="340" cy="280" r="90" fill="%23fb7185" opacity="0.4"/><circle cx="460" cy="280" r="90" fill="%23fbbf24" opacity="0.4"/><text x="400" y="480" font-family="Georgia" font-size="28" fill="%23ffffff" text-anchor="middle" font-weight="bold">Beautiful Memories</text><text x="400" y="520" font-family="sans-serif" font-size="16" fill="%23fbcfe8" text-anchor="middle" letter-spacing="2">WITH LOVE, MALIKA MUNEER</text></svg>',
    date: '8 November',
    isCustom: false,
  },
];

export const MemoriesScene: React.FC<MemoriesSceneProps> = ({
  onProceedToCake,
  onDownloadSuccess,
}) => {
  const [photos, setPhotos] = useState<MemoryPhoto[]>(INITIAL_MEMORIES);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotos(parsed);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isSlideshowPlaying || lightboxIndex === null) return;
    const timer = setInterval(() => {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
    }, 3800);
    return () => clearInterval(timer);
  }, [isSlideshowPlaying, lightboxIndex, photos.length]);

  const savePhotos = (updated: MemoryPhoto[]) => {
    setPhotos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage limit reached, saving in memory', e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    if (!previewDataUrl) return;

    const newPhoto: MemoryPhoto = {
      id: `photo-${Date.now()}`,
      title: newTitle.trim() || `Cherished Memory with ${BIRTHDAY_GIRL}`,
      description: newDescription.trim() || `Uploaded with love by ${CREATOR_NAME}`,
      imageUrl: previewDataUrl,
      date: '8 November',
      isCustom: true,
    };

    savePhotos([newPhoto, ...photos]);
    setShowUploadModal(false);
    setPreviewDataUrl(null);
    setNewTitle('');
    setNewDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photos.filter((p) => p.id !== id);
    savePhotos(updated.length ? updated : INITIAL_MEMORIES);
  };

  const handleDownload = (photo: MemoryPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const filename = `${photo.title.replace(/[^a-zA-Z0-9]/g, '_')}_Umama_Birthday.png`;
    downloadMemoryImage(photo.imageUrl, filename);
    onDownloadSuccess(filename);
  };

  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-12 text-center select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-10 h-[500px] w-[500px] rounded-full bg-pink-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/40 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-pink-950/40 px-5 py-2 text-xs font-bold tracking-[0.2em] text-pink-300 shadow-xl backdrop-blur-md">
          <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
          <span>TIMELESS MOMENTS OF FRIENDSHIP</span>
          <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
        </div>

        <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          BEAUTIFUL MEMORIES ❤️
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Celebrating the precious friendship between <span className="text-amber-300 font-bold">{BIRTHDAY_GIRL}</span> and{' '}
          <span className="text-pink-300 font-bold">{CREATOR_NAME}</span>.
        </p>

        {/* Gallery Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-amber-500/20 px-6 py-2.5 text-xs sm:text-sm font-bold text-amber-200 shadow-lg backdrop-blur-md hover:bg-amber-500/30 active:scale-95 transition-all"
          >
            <Camera className="h-4 w-4 text-amber-300" />
            <span>+ Upload Photo of {BIRTHDAY_GIRL}</span>
          </button>

          {photos.length > 0 && (
            <button
              onClick={() => {
                setLightboxIndex(0);
                setIsSlideshowPlaying(true);
              }}
              className="flex items-center gap-2 rounded-full border border-pink-400/30 bg-slate-900/80 px-5 py-2.5 text-xs sm:text-sm font-semibold text-pink-200 shadow-md backdrop-blur-md hover:bg-pink-950/40 transition-all"
            >
              <Play className="h-3.5 w-3.5 text-pink-400" />
              <span>Start Fullscreen Slideshow</span>
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid of Frames */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-amber-300/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:border-amber-300/80 hover:scale-[1.02] cursor-pointer"
            >
              {/* Ornate Inner Gold Bevel Border */}
              <div className="pointer-events-none absolute inset-2 rounded-2xl border border-amber-400/20 z-10" />

              {/* Photo Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Date Tag */}
                <div className="absolute top-3 left-3 rounded-full border border-pink-400/40 bg-slate-950/80 px-3 py-1 text-[10px] font-bold tracking-wider text-pink-300 backdrop-blur-md">
                  {photo.date || '8 November'}
                </div>

                {/* View Fullscreen overlay icon */}
                <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-4 w-4" />
                </div>

                {/* Delete button if uploaded photo */}
                {photo.isCustom && (
                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    title="Remove Photo"
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-950/80 text-red-300 hover:bg-red-900 hover:text-white transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Caption and Action Details */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-amber-200">
                    {photo.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    {photo.description}
                  </p>
                </div>

                {/* Card Footer with Individual Download */}
                <div className="mt-4 flex items-center justify-between border-t border-pink-500/15 pt-3">
                  <span className="font-script text-xl text-pink-400">
                    Forever Friends ❤️
                  </span>
                  <button
                    onClick={(e) => handleDownload(photo, e)}
                    className="flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-950/40 px-3.5 py-1.5 text-xs font-semibold text-pink-200 transition-colors hover:bg-pink-900 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox / Slideshow Viewer */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative flex flex-col items-center max-w-4xl w-full">
            {/* Top Lightbox Bar */}
            <div className="flex w-full items-center justify-between mb-3 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span>{lightboxIndex + 1} of {photos.length}</span>
                <span>•</span>
                <span className="truncate max-w-[200px] sm:max-w-md">{photos[lightboxIndex].title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                  className="flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-slate-900 px-3 py-1.5 text-xs text-pink-300 hover:bg-slate-800"
                >
                  {isSlideshowPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isSlideshowPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => handleDownload(photos[lightboxIndex])}
                  className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-slate-900 px-3 py-1.5 text-xs text-amber-300 hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    setLightboxIndex(null);
                    setIsSlideshowPlaying(false);
                  }}
                  className="rounded-full bg-slate-800 p-2 text-slate-300 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image View */}
            <div className="relative aspect-[4/3] w-full max-h-[70vh] overflow-hidden rounded-2xl border-2 border-amber-300/40 bg-slate-950 shadow-2xl">
              <img
                src={photos[lightboxIndex].imageUrl}
                alt={photos[lightboxIndex].title}
                className="h-full w-full object-contain"
              />

              {/* Prev / Next Chevrons */}
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Caption in Lightbox */}
            <div className="mt-3 text-center max-w-xl">
              <p className="font-serif text-lg font-bold text-amber-200">
                {photos[lightboxIndex].title}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {photos[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal for Malika Muneer */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-pink-500/40 bg-slate-900 p-6 shadow-2xl text-left">
            <h3 className="font-serif text-2xl font-bold text-white mb-1">
              Add Genuine Photo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Upload a photograph of {BIRTHDAY_GIRL} or a memory with {CREATOR_NAME}. Saved locally to your session.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="master-memory-upload"
            />

            <label
              htmlFor="master-memory-upload"
              className="mb-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-500/40 bg-slate-950/70 p-6 cursor-pointer hover:border-pink-400 transition-all text-center"
            >
              {previewDataUrl ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <img
                    src={previewDataUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white">
                    Tap to change image
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20 text-pink-300 mb-2">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-pink-200">
                    Select photo from device
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    JPEG, PNG, WEBP supported
                  </span>
                </div>
              )}
            </label>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder={`e.g. Unforgettable day with ${BIRTHDAY_GIRL}`}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Personal Note or Caption
                </label>
                <textarea
                  placeholder="e.g. You bring so much joy into our lives..."
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreviewDataUrl(null);
                }}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPhoto}
                disabled={!previewDataUrl}
                className="rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                Add Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proceed to Cake Cutting */}
      <div className="relative z-10 mt-10">
        <button
          onClick={onProceedToCake}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-9 py-4 text-sm sm:text-base font-extrabold text-white shadow-[0_10px_35px_rgba(244,63,94,0.45)] transition-all hover:scale-105 active:scale-95"
        >
          <span>CUT THE BIRTHDAY CAKE 🎂</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
