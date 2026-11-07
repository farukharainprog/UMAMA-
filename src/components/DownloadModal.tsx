import React from 'react';
import { CheckCircle2, Download, X, Smartphone, FolderDown, Heart } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  isPdf?: boolean;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  filename,
  isPdf = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-pink-500/30 bg-slate-900 p-6 shadow-2xl shadow-pink-900/40 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 shadow-lg shadow-pink-500/30">
          <CheckCircle2 className="h-8 w-8 text-slate-950" />
        </div>

        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Downloaded Successfully!
        </h3>

        <div className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-pink-500/20 bg-pink-950/40 px-3 py-1 text-xs text-pink-300">
          <Download className="h-3.5 w-3.5" />
          <span className="font-mono truncate max-w-[260px]">{filename}</span>
        </div>

        <p className="text-sm text-slate-300 mb-5 leading-relaxed">
          {isPdf
            ? 'The high-resolution birthday wishes booklet PDF has been generated and saved to your device.'
            : 'Your high-resolution birthday keepsake image has been saved to your device.'}
        </p>

        {/* Mobile Guidance Callout */}
        <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-left text-xs text-amber-200/90">
          <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1.5">
            <Smartphone className="h-4 w-4" />
            <span>Mobile Device Download Tip</span>
          </div>
          <ul className="space-y-1 text-[11px] text-amber-100/80 leading-normal pl-1">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400">•</span>
              <span><strong>iPhone/iPad Safari:</strong> Tap the blue download arrow or the "AA" icon in the search bar, then tap "Downloads" to view.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400">•</span>
              <span><strong>Android Chrome:</strong> The file is in your device's <strong>Files</strong> or <strong>Downloads</strong> app and notification drawer.</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span>Continue Celebration</span>
        </button>
      </div>
    </div>
  );
};
