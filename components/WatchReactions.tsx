export default function WatchReactions() {
  const videos = [
    {
      id: 1,
      label: "I made her fall in love with me all over again ❤️",
      thumbnail: "bg-gradient-to-br from-gray-800 to-gray-900",
      icon: "🎵",
    },
    {
      id: 2,
      label: "She cried the whole time 😭",
      thumbnail: "bg-gradient-to-br from-purple-800 to-indigo-900",
      icon: "🎤",
    },
  ];

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
            <div
              key={v.id}
              className={`relative rounded-3xl overflow-hidden aspect-[9/16] max-h-80 sm:max-h-96 ${v.thumbnail} cursor-pointer group`}
            >
              {/* Play button overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">{v.icon}</div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-sm font-medium leading-snug">{v.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
