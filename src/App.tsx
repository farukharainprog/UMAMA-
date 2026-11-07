/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scene, BIRTHDAY_GIRL, CREATOR_NAME, BIRTHDAY_DATE } from './types';
import { FloatingParticles } from './components/FloatingParticles';
import { AudioControls } from './components/AudioControls';
import { SceneNavigation } from './components/SceneNavigation';
import { DownloadModal } from './components/DownloadModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { WelcomeScene } from './components/scenes/WelcomeScene';
import { CardScene } from './components/scenes/CardScene';
import { WishesScene } from './components/scenes/WishesScene';
import { MemoriesScene } from './components/scenes/MemoriesScene';
import { CakeScene } from './components/scenes/CakeScene';
import { FinaleScene } from './components/scenes/FinaleScene';
import { audioEngine } from './utils/audio';
import { Sparkles, Heart, Share2 } from 'lucide-react';

export default function App() {
  const [currentScene, setCurrentScene] = useState<Scene>('welcome');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [downloadModalInfo, setDownloadModalInfo] = useState<{
    isOpen: boolean;
    filename: string;
    isPdf: boolean;
  }>({
    isOpen: false,
    filename: '',
    isPdf: false,
  });

  const handleSceneChange = (newScene: Scene) => {
    setCurrentScene(newScene);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplay = () => {
    setCurrentScene('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioEngine.startBackgroundMusic();
  };

  const handleDownloadSuccess = (filename: string, isPdf = false) => {
    setDownloadModalInfo({
      isOpen: true,
      filename,
      isPdf,
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Dynamic Ambient Background Canvas */}
      <FloatingParticles />

      {/* Top Header Navigation Bar (Top Bar Contract) */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between gap-4 border-b border-pink-500/15 bg-slate-950/85 px-4 sm:px-8 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleSceneChange('welcome')}
          className="flex items-center gap-2 text-left focus:outline-none whitespace-nowrap shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-slate-950 shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-serif text-sm sm:text-base font-bold tracking-tight text-white">
              {BIRTHDAY_GIRL}’s Birthday
            </span>
            <span className="hidden sm:inline text-[11px] text-pink-300/80 ml-2 font-medium">
              • {BIRTHDAY_DATE}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Scene jump triggers) */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={() => handleSceneChange('welcome')}
            className={`transition-colors whitespace-nowrap hover:text-pink-300 ${
              currentScene === 'welcome' ? 'text-amber-300 border-b-2 border-amber-300 pb-0.5' : ''
            }`}
          >
            Gift Box
          </button>
          <button
            onClick={() => handleSceneChange('card')}
            className={`transition-colors whitespace-nowrap hover:text-pink-300 ${
              currentScene === 'card' ? 'text-amber-300 border-b-2 border-amber-300 pb-0.5' : ''
            }`}
          >
            Special Card
          </button>
          <button
            onClick={() => handleSceneChange('wishes')}
            className={`transition-colors whitespace-nowrap hover:text-pink-300 ${
              currentScene === 'wishes' ? 'text-amber-300 border-b-2 border-amber-300 pb-0.5' : ''
            }`}
          >
            15 Wishes
          </button>
          <button
            onClick={() => handleSceneChange('memories')}
            className={`transition-colors whitespace-nowrap hover:text-pink-300 ${
              currentScene === 'memories' ? 'text-amber-300 border-b-2 border-amber-300 pb-0.5' : ''
            }`}
          >
            Memories
          </button>
          <button
            onClick={() => handleSceneChange('cake')}
            className={`transition-colors whitespace-nowrap hover:text-pink-300 ${
              currentScene === 'cake' ? 'text-amber-300 border-b-2 border-amber-300 pb-0.5' : ''
            }`}
          >
            Cake Cutting
          </button>
          <button
            onClick={() => handleSceneChange('finale')}
            className={`transition-colors whitespace-nowrap hover:text-pink-300 ${
              currentScene === 'finale' ? 'text-amber-300 border-b-2 border-amber-300 pb-0.5' : ''
            }`}
          >
            Grand Finale
          </button>
        </nav>

        {/* Zone 3: Share Link & Audio Controls in header */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-amber-500/20 px-3 sm:px-4 text-xs font-bold text-amber-200 shadow-md backdrop-blur-md hover:bg-amber-500/30 active:scale-95 transition-all"
            title="Get Shareable Link (UMAMA-HAPPY-BIRTHDAY)"
          >
            <Share2 className="h-3.5 w-3.5 text-amber-300" />
            <span>Send Link</span>
          </button>

          <AudioControls
            onReplayVoice={() => {
              audioEngine.playVoiceGreeting();
            }}
          />
        </div>
      </header>

      {/* Main Experience Viewport */}
      <main className="relative z-10 mx-auto max-w-6xl pb-24">
        {currentScene === 'welcome' && (
          <WelcomeScene
            onLetsCelebrate={() => handleSceneChange('wishes')}
          />
        )}

        {currentScene === 'wishes' && (
          <WishesScene
            onProceedToCake={() => handleSceneChange('cake')}
            onDownloadSuccess={(fn, isPdf) => handleDownloadSuccess(fn, isPdf)}
          />
        )}

        {currentScene === 'cake' && (
          <CakeScene
            onProceedToFinale={() => handleSceneChange('finale')}
          />
        )}

        {currentScene === 'finale' && (
          <FinaleScene
            onReplay={handleReplay}
            onDownloadSuccess={(fn) => handleDownloadSuccess(fn, false)}
          />
        )}

        {currentScene === 'card' && (
          <CardScene
            onProceedToWishes={() => handleSceneChange('wishes')}
            onDownloadSuccess={(fn) => handleDownloadSuccess(fn, false)}
          />
        )}

        {currentScene === 'memories' && (
          <MemoriesScene
            onProceedToCake={() => handleSceneChange('cake')}
            onDownloadSuccess={(fn) => handleDownloadSuccess(fn, false)}
          />
        )}
      </main>

      {/* Persistent Cinematic Bottom Scene Navigation */}
      <SceneNavigation
        currentScene={currentScene}
        onSceneChange={handleSceneChange}
        onReplay={handleReplay}
      />

      {/* Download Completion & Mobile Tips Modal */}
      <DownloadModal
        isOpen={downloadModalInfo.isOpen}
        filename={downloadModalInfo.filename}
        isPdf={downloadModalInfo.isPdf}
        onClose={() => setDownloadModalInfo({ ...downloadModalInfo, isOpen: false })}
      />

      {/* Share Link Modal with custom UMAMA-HAPPY-BIRTHDAY link */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
