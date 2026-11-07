import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Download, ArrowRight, BookOpen } from 'lucide-react';
import { BIRTHDAY_GIRL, CREATOR_NAME, BIRTHDAY_DATE } from '../../types';
import { downloadElementAsPng } from '../../utils/download';

interface CardSceneProps {
  onProceedToWishes: () => void;
  onDownloadSuccess: (filename: string) => void;
}

export const CardScene: React.FC<CardSceneProps> = ({
  onProceedToWishes,
  onDownloadSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    const filename = `Special_Birthday_Card_for_${BIRTHDAY_GIRL}_from_${CREATOR_NAME.replace(/\s+/g, '_')}.png`;
    const res = await downloadElementAsPng(cardRef.current, filename, 2.5);
    setIsExporting(false);
    if (res.success) {
      onDownloadSuccess(filename);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-16 text-center select-none">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-10 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 mb-6 max-w-xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/30 bg-pink-950/40 px-3.5 py-1 text-xs font-semibold tracking-wider text-pink-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>A HEARTFELT SURPRISE FROM {CREATOR_NAME.toUpperCase()}</span>
        </div>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          A Special Birthday Card
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Click the card to open or close it • Download as a keepsake
        </p>
      </div>

      {/* Interactive 3D Greeting Card Container */}
      <div className="relative z-10 w-full max-w-xl perspective-1000 my-2">
        <div
          ref={cardRef}
          onClick={() => setIsOpen(!isOpen)}
          className="group relative mx-auto w-full max-w-lg cursor-pointer rounded-3xl border-2 border-amber-300/40 bg-gradient-to-br from-slate-900 via-pink-950/40 to-slate-900 p-6 sm:p-9 shadow-2xl shadow-pink-950/50 backdrop-blur-xl transition-all duration-500 hover:border-amber-300/70 text-left"
        >
          {/* Ornate Golden Filigree Frame */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-amber-400/30" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-pink-500/20" />

          {/* Corner Floral Ornaments */}
          <div className="absolute top-5 left-5 text-amber-300/60 text-xs">❦</div>
          <div className="absolute top-5 right-5 text-amber-300/60 text-xs">❧</div>
          <div className="absolute bottom-5 left-5 text-amber-300/60 text-xs">❧</div>
          <div className="absolute bottom-5 right-5 text-amber-300/60 text-xs">❦</div>

          {/* Card Header */}
          <div className="relative mb-5 flex items-center justify-between border-b border-pink-500/20 pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                Birthday Greeting
              </span>
              <p className="text-xs text-slate-400">Date: {BIRTHDAY_DATE}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 shadow-md shadow-pink-500/20">
              <Heart className="h-6 w-6 text-white fill-white animate-pulse" />
            </div>
          </div>

          {/* Card Body - Exact user requested text */}
          <div className="relative space-y-4 font-sans text-sm sm:text-base leading-relaxed text-slate-100">
            <p className="font-serif text-xl sm:text-2xl font-bold text-amber-300">
              Dear {BIRTHDAY_GIRL},
            </p>

            <p className="text-slate-200">
              Today is your special day, and I want to make it a little more beautiful with this small surprise.
            </p>

            <p className="text-slate-200">
              You are a wonderful friend, and you deserve all the happiness in the world.
            </p>

            <p className="rounded-xl border border-amber-400/25 bg-amber-950/20 p-3.5 text-amber-100 italic leading-relaxed">
              May Allah always protect you, bless your life, and fill your heart with peace, love and endless happiness.
            </p>

            <div className="pt-3 text-right">
              <p className="text-xs tracking-wider text-pink-300">With lots of love,</p>
              <p className="font-script text-3xl sm:text-4xl text-amber-300 mt-1">
                {CREATOR_NAME} ❤️
              </p>
            </div>
          </div>

          {/* Wax Seal / Stamp Accent */}
          <div className="absolute -bottom-4 left-8 flex items-center gap-2 rounded-full border border-amber-300/40 bg-slate-900 px-3 py-1 shadow-md">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-bold tracking-widest text-amber-300">
              FOREVER FRIENDS
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
        {/* Download Card as PNG */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-full border border-pink-400/30 bg-slate-900/80 px-5 py-3 text-xs font-semibold text-pink-200 shadow-lg backdrop-blur-md transition-all hover:bg-pink-950/40 hover:text-white active:scale-95"
        >
          <Download className="h-4 w-4 text-pink-400" />
          <span>{isExporting ? 'Generating Image...' : 'Download Card (PNG)'}</span>
        </button>

        {/* Toggle open/fold info */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <BookOpen className="h-4 w-4 text-slate-400" />
          <span>{isOpen ? 'Tap to Re-fold' : 'Tap to Unfold'}</span>
        </button>

        {/* Proceed to 15 Wishes */}
        <button
          onClick={onProceedToWishes}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-7 py-3 text-xs font-bold text-white shadow-xl shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <span>VIEW 15 SPECIAL WISHES</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
