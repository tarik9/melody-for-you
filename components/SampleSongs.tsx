"use client";

import { useState, useRef, useEffect } from "react";

const SAMPLE_SONGS = [
  { id: 1, title: "Forever Yours",       src: "/songs/Forever Yours.mp3",       genre: "Ballad", occasion: "Gift for Sophie"  },
  { id: 2, title: "Still Us",            src: "/songs/Still Us.mp3",            genre: "Pop",    occasion: "Anniversary"      },
  { id: 3, title: "Stand Your Ground",   src: "/songs/Stand Your Ground.mp3",   genre: "Rock",   occasion: "Graduation"       },
  { id: 4, title: "All in Black",        src: "/songs/All in Black.mp3",        genre: "Pop",    occasion: "Birthday"         },
  { id: 5, title: "Where I Learned Love",src: "/songs/Where I Learned Love.mp3",genre: "Pop",    occasion: "Mother's Day"     },
];

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function SampleSongs() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeSong, setActiveSong] = useState(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // When active song changes, load and play it
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = activeSong.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSong]);

  const togglePlay = (song = activeSong) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (song.id !== activeSong.id) {
      setActiveSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="py-20 bg-white">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Hear the Magic
          </h2>
          <p className="text-gray-500 text-lg">
            Listen to samples of songs we&apos;ve created for others
          </p>
        </div>

        <div className="bg-[#F8F7FF] rounded-3xl overflow-hidden shadow-lg border border-purple-100">
          <div className="flex flex-col md:flex-row">
            {/* Player Left */}
            <div className="md:w-56 bg-gradient-to-br from-purple-100 to-purple-200 p-8 flex flex-col items-center justify-center gap-4">
              {/* Album art */}
              <div className="w-32 h-32 bg-white/60 rounded-2xl flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19V6l12-3v13" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6" cy="19" r="3" stroke="#7C3AED" strokeWidth="1.5" />
                  <circle cx="18" cy="16" r="3" stroke="#7C3AED" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">{activeSong.title}</div>
                <div className="text-gray-500 text-xs">{activeSong.genre} – {activeSong.occasion}</div>
              </div>

              {/* Progress bar (seekable) */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C3AED] rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const idx = SAMPLE_SONGS.findIndex((s) => s.id === activeSong.id);
                    const prev = SAMPLE_SONGS[(idx - 1 + SAMPLE_SONGS.length) % SAMPLE_SONGS.length];
                    setActiveSong(prev);
                    setIsPlaying(true);
                    setCurrentTime(0);
                  }}
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                  </svg>
                </button>
                <button
                  onClick={() => togglePlay()}
                  className="w-12 h-12 bg-[#7C3AED] hover:bg-[#5B21B6] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105"
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    const idx = SAMPLE_SONGS.findIndex((s) => s.id === activeSong.id);
                    const next = SAMPLE_SONGS[(idx + 1) % SAMPLE_SONGS.length];
                    setActiveSong(next);
                    setIsPlaying(true);
                    setCurrentTime(0);
                  }}
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Song List Right */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <span className="font-semibold text-gray-700 text-sm">Sample Songs</span>
                <span className="text-gray-400 text-sm">{SAMPLE_SONGS.length} Songs</span>
              </div>
              <div className="space-y-1">
                {SAMPLE_SONGS.map((song, idx) => (
                  <button
                    key={song.id}
                    onClick={() => togglePlay(song)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                      activeSong.id === song.id
                        ? "bg-[#7C3AED] text-white shadow-md"
                        : "hover:bg-purple-50 text-gray-700"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium w-5 text-center shrink-0 ${
                        activeSong.id === song.id ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {activeSong.id === song.id && isPlaying ? (
                        <span className="flex gap-0.5 items-end h-4">
                          {[3, 5, 4].map((h, i) => (
                            <span
                              key={i}
                              className="w-0.5 bg-white rounded-full animate-pulse"
                              style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm truncate ${activeSong.id === song.id ? "text-white" : "text-gray-800"}`}>
                        {song.title}
                      </div>
                      <div className={`text-xs truncate ${activeSong.id === song.id ? "text-white/70" : "text-gray-400"}`}>
                        {song.genre} – {song.occasion}
                      </div>
                    </div>
                    {activeSong.id === song.id && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/80 shrink-0">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
