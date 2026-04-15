"use client";

import { useRef, useState } from "react";

interface VideoItem {
  src: string;
  label: string;
}

const videos: VideoItem[] = [
  {
    src: "/Videos/video4.mp4",
    label: "I made her fall in love with me all over again ❤️",
  },
  {
    src: "/Videos/video3.mp4",
    label: "She cried the whole time 😭",
  },
];

function VideoCard({ src, label }: VideoItem) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Seek to first frame so the video shows a thumbnail instead of black
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0.1;
    }
  };

  const handleSeeked = () => {
    setLoaded(true);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden aspect-[9/16] max-h-80 sm:max-h-96 bg-gray-900 cursor-pointer group"
      onClick={toggle}
    >
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        loop
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}
        onEnded={() => setPlaying(false)}
      />

      {/* Loading spinner — shown until first frame is ready */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <svg className="animate-spin w-8 h-8 text-white/50" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
          </svg>
        </div>
      )}

      {/* Play / pause overlay */}
      {loaded && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
          style={{ background: playing ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.25)" }}
        >
          <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
            {playing ? (
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
        <p className="text-white text-sm font-medium leading-snug">{label}</p>
      </div>
    </div>
  );
}

export default function WatchReactions() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Watch Reactions
          </h2>
          <p className="text-gray-500 text-lg">Real people, real emotions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {videos.map((v) => (
            <VideoCard key={v.src} src={v.src} label={v.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
