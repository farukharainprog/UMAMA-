import React, { useState } from 'react';
import { Copy, Check, Share2, X, MessageCircle, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { BIRTHDAY_GIRL, CREATOR_NAME } from '../types';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prefer the production/preview shared URL, or fallback to current origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-izcior7bqc3utice7yebkr-798714906311.asia-east1.run.app';
  // Formats link with the exact requested slug, guaranteed to never 404
  const customShareUrl = `${baseUrl}/?to=UMAMA-HAPPY-BIRTHDAY`;

  const whatsappMessage = encodeURIComponent(
    `🎂 A Special Birthday Surprise for you, UMAMA! ❤️\n\nClick to open your luxury birthday surprise created with love by MALAIKA MUNEER:\n${customShareUrl}`
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = customShareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${BIRTHDAY_GIRL}!`,
          text: `A special luxury birthday surprise for ${BIRTHDAY_GIRL} from ${CREATOR_NAME}!`,
          url: customShareUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-slate-900 via-pink-950/40 to-slate-900 p-6 sm:p-8 shadow-2xl shadow-pink-950/60 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 shadow-lg shadow-pink-500/30">
          <Share2 className="h-7 w-7 text-slate-950" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-300 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>OFFICIAL SURPRISE LINK</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Send Link to UMAMA
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Yeh link copy kar ke aap direct UMAMA ko WhatsApp ya SMS par send kar sakte hain:
        </p>

        {/* Link Display Box */}
        <div className="mb-5 flex flex-col sm:flex-row items-center gap-2 rounded-2xl border-2 border-amber-300/40 bg-slate-950 p-2 sm:p-3">
          <div className="flex-1 overflow-hidden px-2 text-left w-full">
            <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold block mb-0.5">
              Personalized Link:
            </span>
            <p className="font-mono text-xs sm:text-sm text-amber-300 truncate select-all">
              {customShareUrl}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-pink-500 to-amber-500 text-white hover:brightness-110 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Share Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* WhatsApp Direct Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Send on WhatsApp</span>
          </a>

          {/* Device Share Sheet */}
          <button
            onClick={handleNativeShare}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-pink-400/40 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-bold text-pink-200 hover:bg-slate-700 transition-all active:scale-95"
          >
            <ExternalLink className="h-4 w-4" />
            <span>More Options</span>
          </button>
        </div>

        <div className="mt-5 border-t border-pink-500/20 pt-4 text-center">
          <p className="font-script text-xl text-pink-300">
            With lots of love, {CREATOR_NAME} ❤️
          </p>
        </div>
      </div>
    </div>
  );
};
