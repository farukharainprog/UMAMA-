import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Mic, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface AudioControlsProps {
  onReplayVoice?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ onReplayVoice }) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const checkState = () => {
      setIsPlayingMusic(audioEngine.isMusicActive());
      setIsSpeaking(audioEngine.isVoiceSpeaking());
      setIsMuted(audioEngine.getIsMuted());
    };

    const interval = setInterval(checkState, 350);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMusic = () => {
    audioEngine.initUserInteraction();
    const active = audioEngine.toggleBackgroundMusic();
    setIsPlayingMusic(active);
  };

  const handleToggleMute = () => {
    audioEngine.initUserInteraction();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
      audioEngine.toggleMute();
    }
  };

  const handleReplayGreeting = () => {
    audioEngine.initUserInteraction();
    setIsSpeaking(true);
    if (onReplayVoice) {
      onReplayVoice();
    } else {
      audioEngine.playVoiceGreeting(() => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Audio Panel Container */}
      <div className="flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-slate-950/80 p-1.5 shadow-lg shadow-pink-950/30 backdrop-blur-md">
        {/* Background Music Toggle */}
        <button
          onClick={handleToggleMusic}
          title={isPlayingMusic ? 'Pause Birthday Music' : 'Play Birthday Music'}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
            isPlayingMusic
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40 ring-2 ring-pink-400/50'
              : 'text-pink-300 hover:bg-pink-950/50 hover:text-pink-200'
          }`}
          aria-label="Toggle background music"
        >
          <Music className={`h-4 w-4 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
        </button>

        {/* Replay Voice Greeting */}
        <button
          onClick={handleReplayGreeting}
          title="Replay Birthday Voice Greeting"
          className={`flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-all duration-300 ${
            isSpeaking
              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50 animate-pulse'
              : 'text-amber-200/90 hover:bg-amber-950/40 hover:text-amber-100'
          }`}
          aria-label="Replay voice greeting"
        >
          <Mic className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">Voice</span>
          <RotateCcw className="h-3 w-3 opacity-70" />
        </button>

        {/* Volume & Mute control with expand on hover/click */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-pink-300 transition-colors hover:bg-pink-950/50 hover:text-pink-100"
            aria-label="Toggle mute"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-slate-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-pink-300" />
            )}
          </button>

          {/* Volume Slider Popout */}
          {showVolumeSlider && (
            <div className="absolute right-0 top-11 flex w-32 items-center rounded-xl border border-pink-500/30 bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1.5 w-full cursor-pointer accent-pink-500"
                aria-label="Volume slider"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
