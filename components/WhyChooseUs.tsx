export default function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#7C3AED" />
          <circle cx="12" cy="7" r="1" fill="#7C3AED" />
          <path d="M9 12c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
          <path d="M17 8c.55.55 1 1.3 1 2s-.45 1.45-1 2" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: "Professional Composers",
      description:
        "Experienced songwriters and musicians who specialize in custom, story-based songs.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="#7C3AED"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      ),
      title: "Heart-Driven Approach",
      description: "Each song is written from real details you provide.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19V6l12-3v13" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="19" r="3" stroke="#7C3AED" strokeWidth="1.5" />
          <circle cx="18" cy="16" r="3" stroke="#7C3AED" strokeWidth="1.5" />
        </svg>
      ),
      title: "Studio Quality",
      description:
        "Recorded, mixed, and mastered using professional studio standards.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Real artists compose, perform, and record your song based on the details you provide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-100 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
