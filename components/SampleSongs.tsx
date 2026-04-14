"use client";

import { useState, useRef } from "react";

const SAMPLE_SONGS = [
  { id: 1, title: "Forever Yours", genre: "Ballad", occasion: "Gift for Sophie", duration: "3:58" },
  { id: 2, title: "Still Us", genre: "Pop", occasion: "Anniversary", duration: "3:24" },
  { id: 3, title: "Stand Your Ground", genre: "Rock", occasion: "Graduation", duration: "4:12" },
  { id: 4, title: "My Little Forever", genre: "Pop", occasion: "For a Daughter", duration: "3:45" },
  { id: 5, title: "Where I Learned Love", genre: "Pop", occasion: "Mother's Day", duration: "3:31" },
];

export default function SampleSongs() {
  const [activeSong, setActiveSong] = useState(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = (song = activeSong) => {
    if (song.id !== activeSong.id) {
      setActiveSong(song);
      setIsPlaying(true);
      setProgress(0);
      startProgress();
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      startProgress();
    }
  };

  const startProgress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIsPlaying(false);
          clearInterval(intervalRef.current!);
          return 0;
        }
        return p + 0.5;
      });
    }, 150);
  };

  return (
    <section className="py-20 bg-white">
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
              {/* Progress */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>0:00</span>
                  <span>{activeSong.duration}</span>
                </div>
                <div className="h-1 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C3AED] rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {/* Controls */}
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-purple-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
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
                <button className="text-gray-400 hover:text-purple-600 transition-colors">
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
