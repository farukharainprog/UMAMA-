import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { Scene } from '../types';

interface SceneNavigationProps {
  currentScene: Scene;
  onSceneChange: (scene: Scene) => void;
  onReplay: () => void;
}

const SCENE_ORDER: { id: Scene; label: string; number: number }[] = [
  { id: 'welcome', label: 'Welcome', number: 1 },
  { id: 'wishes', label: '15 Wishes', number: 2 },
  { id: 'cake', label: 'Cake Cutting', number: 3 },
  { id: 'finale', label: 'Grand Finale', number: 4 },
];

export const SceneNavigation: React.FC<SceneNavigationProps> = ({
  currentScene,
  onSceneChange,
  onReplay,
}) => {
  const currentIndex = SCENE_ORDER.findIndex((s) => s.id === currentScene);
  const currentStep = SCENE_ORDER[currentIndex] || SCENE_ORDER[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSceneChange(SCENE_ORDER[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < SCENE_ORDER.length - 1) {
      onSceneChange(SCENE_ORDER[currentIndex + 1].id);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pb-3 pt-6 px-4">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        {/* Back Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold tracking-wide transition-all ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed text-slate-500'
              : 'border border-pink-500/20 bg-slate-900/80 text-pink-200 hover:border-pink-500/40 hover:bg-slate-800 active:scale-95'
          }`}
          aria-label="Previous scene"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Scene Progress Indicators / Stepper */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            {SCENE_ORDER.map((item, idx) => {
              const isActive = idx === currentIndex;
              const isPast = idx < currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => onSceneChange(item.id)}
                  title={`Go to ${item.label}`}
                  className="group relative flex h-7 items-center justify-center px-1 focus:outline-none"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-7 bg-gradient-to-r from-pink-500 to-amber-400 shadow-sm shadow-pink-500/50'
                        : isPast
                        ? 'w-2 bg-pink-400/60'
                        : 'w-2 bg-slate-700/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Current Scene Badge */}
          <div className="flex items-center gap-1 text-[11px] font-medium tracking-wider text-pink-300/90">
            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
            <span>
              Scene {currentStep.number} of {SCENE_ORDER.length}: {currentStep.label}
            </span>
          </div>
        </div>

        {/* Next / Replay Action Button */}
        {currentIndex < SCENE_ORDER.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex h-11 items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-5 text-xs font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:brightness-110 active:scale-95"
            aria-label="Next scene"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onReplay}
            className="flex h-11 items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/20 px-4 text-xs font-bold text-amber-300 shadow-lg shadow-amber-500/20 backdrop-blur-md transition-all hover:bg-amber-500/30 active:scale-95"
            aria-label="Replay experience"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Replay</span>
          </button>
        )}
      </div>
    </footer>
  );
};
