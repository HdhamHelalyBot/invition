/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Music, Volume2, VolumeX, Sparkles, Pause, Play } from 'lucide-react';

export default function BackgroundMusic({ autoStart = false }: { autoStart?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35); // Gentle default volume

  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const notesIndexRef = useRef<number>(0);
  const sequenceActiveRef = useRef<boolean>(false);

  // Canon in D - Bell Music Box Sequencer frequencies
  // Chords: D - A - Bm - F#m - G - D - G - A
  const melody = [
    // Measure 1: D
    { note: "F#5", freq: 739.99, delay: 0 },
    { note: "D5", freq: 587.33, delay: 0.5 },
    { note: "A4", freq: 440.00, delay: 1.0 },
    { note: "D5", freq: 587.33, delay: 1.5 },
    // Measure 2: A
    { note: "E5", freq: 659.25, delay: 2.0 },
    { note: "C#5", freq: 554.37, delay: 2.5 },
    { note: "A4", freq: 440.00, delay: 3.0 },
    { note: "E5", freq: 659.25, delay: 3.5 },
    // Measure 3: Bm
    { note: "D5", freq: 587.33, delay: 4.0 },
    { note: "B4", freq: 493.88, delay: 4.5 },
    { note: "F#4", freq: 369.99, delay: 5.0 },
    { note: "B4", freq: 493.88, delay: 5.5 },
    // Measure 4: F#m
    { note: "C#5", freq: 554.37, delay: 6.0 },
    { note: "A4", freq: 440.00, delay: 6.5 },
    { note: "F#4", freq: 369.99, delay: 7.0 },
    { note: "C#5", freq: 554.37, delay: 7.5 },
    // Measure 5: G
    { note: "B4", freq: 493.88, delay: 8.0 },
    { note: "G4", freq: 392.00, delay: 8.5 },
    { note: "D4", freq: 293.66, delay: 9.0 },
    { note: "G4", freq: 392.00, delay: 9.5 },
    // Measure 6: D
    { note: "A4", freq: 440.00, delay: 10.0 },
    { note: "F#4", freq: 369.99, delay: 10.5 },
    { note: "D4", freq: 293.66, delay: 11.0 },
    { note: "F#4", freq: 369.99, delay: 11.5 },
    // Measure 7: G
    { note: "B4", freq: 493.88, delay: 12.0 },
    { note: "G4", freq: 392.00, delay: 12.5 },
    { note: "D4", freq: 293.66, delay: 13.0 },
    { note: "G4", freq: 392.00, delay: 13.5 },
    // Measure 8: A
    { note: "C#5", freq: 554.37, delay: 14.0 },
    { note: "A4", freq: 440.00, delay: 14.5 },
    { note: "E4", freq: 329.63, delay: 15.0 },
    { note: "A4", freq: 440.00, delay: 15.5 },
  ];

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    mainGainRef.current = masterGain;
  };

  const playBellNote = (freq: number, time: number) => {
    if (!audioCtxRef.current || !mainGainRef.current) return;
    const ctx = audioCtxRef.current;

    // Create a beautiful physical model-like pluck using multiple sine/triangle waves
    // High sine for the sparkling crystal tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    
    const pluckGain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    // Overtone for a bell/glockenspiel sparkle
    osc2.frequency.setValueAtTime(freq * 2.01, time);

    pluckGain.gain.setValueAtTime(0, time);
    // Sharp attack
    pluckGain.gain.linearRampToValueAtTime(0.35, time + 0.02);
    // Delicate exponential decay simulating a real harp/music box pluck
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5);

    // Dynamic bandpass filter for an organic wooden feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.5, time);
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq, time + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(pluckGain);
    pluckGain.connect(mainGainRef.current);

    osc1.start(time);
    osc2.start(time);

    osc1.stop(time + 2.6);
    osc2.stop(time + 2.6);
  };

  const startSequencer = () => {
    if (!audioCtxRef.current) return;
    sequenceActiveRef.current = true;
    
    const lookAhead = 0.5; // schedule notes 500ms in advance
    let lastScheduledTime = audioCtxRef.current.currentTime;

    const runLoop = () => {
      if (!sequenceActiveRef.current || !audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Schedule melody notes that should start in the next lookAhead window
      while (lastScheduledTime < now + lookAhead) {
        const itemIndex = notesIndexRef.current % melody.length;
        const currentNote = melody[itemIndex];
        
        // Find interval relative to where we are
        // Note length is 0.5s
        const noteTime = lastScheduledTime;
        playBellNote(currentNote.freq, noteTime);

        // Advance note pointer
        notesIndexRef.current += 1;
        lastScheduledTime += 0.5; // 120 bpm, quavers are 0.25s, crotchets are 0.5s
      }

      timeoutIdRef.current = window.setTimeout(runLoop, 200);
    };

    runLoop();
  };

  const stopSequencer = () => {
    sequenceActiveRef.current = false;
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const togglePlay = async () => {
    initAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (isPlaying) {
      stopSequencer();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startSequencer();
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.setValueAtTime(nextMute ? 0 : volume, audioCtxRef.current.currentTime);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.setValueAtTime(isMuted ? 0 : val, audioCtxRef.current.currentTime);
    }
  };

  // Autostart effect when permitted by frame / active trigger (prop based)
  useEffect(() => {
    if (autoStart && !isPlaying) {
      // Small timeout to guarantee interaction bypass if possible, typically browsers block this until click
      const timer = setTimeout(() => {
        togglePlay().catch(() => {
          // Soft ignore as browsers block autoplay without click
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  useEffect(() => {
    return () => {
      stopSequencer();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-ivory/95 border border-gold-medium/30 p-2.5 shadow-lg backdrop-blur-md">
      {/* Vinyl record spinning indicator */}
      <button
        onClick={togglePlay}
        id="music-play-btn"
        className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-white transition-all duration-500 hover:scale-105 active:scale-95 ${
          isPlaying ? 'animate-[spin_4s_linear_infinite] shadow-gold-medium/40 shadow-md' : ''
        }`}
        title={isPlaying ? "Pause Wedding Harmony" : "Play Wedding Harmony"}
      >
        {isPlaying ? (
          <Pause className="h-4.5 w-4.5 text-gold-light" />
        ) : (
          <Play className="ml-0.5 h-4.5 w-4.5 text-gold-light" />
        )}
        
        {/* Ambient music sparkles indicator */}
        {isPlaying && (
          <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 animate-bounce text-gold-medium" />
        )}
      </button>

      {/* Detail bar */}
      <div className="flex flex-col pr-3 pl-1 max-w-[120px]">
        <span className="font-serif text-[10px] tracking-widest text-gold-dark font-medium leading-none uppercase">
          {isPlaying ? 'Now Playing' : 'Ambient Music'}
        </span>
        <span className="truncate font-sans text-xs font-semibold text-charcoal/80 leading-tight">
          Canon in D Pluck
        </span>
      </div>

      {/* Volume slider control */}
      <div className="flex items-center gap-2 border-l border-gold-medium/20 pl-2">
        <button
          onClick={toggleMute}
          className="text-olive-medium hover:text-gold-dark transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="0.8"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="h-1.5 w-14 cursor-pointer rounded-lg bg-gold-light/45 accent-gold-medium focus:outline-none"
          title="Adjust Volume"
        />
      </div>
    </div>
  );
}
