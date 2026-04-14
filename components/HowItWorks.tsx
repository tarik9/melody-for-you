"use client";

export default function HowItWorks() {
  const scrollToForm = () => {
    const el = document.getElementById("order-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const steps = [
    {
      number: "01",
      title: "Share Your Story",
      description: "Tell us who the song is for and the memories you want to include.",
    },
    {
      number: "02",
      title: "Choose Style",
      description: "Pick a genre and mood that fits your special person perfectly.",
    },
    {
      number: "03",
      title: "We Compose",
      description: "Our artists get to work writing and recording your custom track.",
    },
    {
      number: "04",
      title: "Receive & Amaze",
      description: "Get your song by email within 24 hours and share a moment they'll never forget.",
    },
  ];

  return (
    <section className="py-20 bg-[#F8F7FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-lg">Four simple steps to your masterpiece</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 h-0.5 bg-purple-100 z-0" style={{ left: "calc(100% - 1rem)", width: "2rem" }} />
              )}
              <div className="relative z-10">
                <div className="text-7xl font-black mb-3 leading-none select-none" style={{ color: "#7C3AED15" }}>
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 -mt-6">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={scrollToForm}
            className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
          >
            Start Your Song →
          </button>
        </div>
      </div>
    </section>
  );
}
