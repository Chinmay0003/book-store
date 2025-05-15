interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "📚",
    title: "Curated for Kids",
    description:
      "Every book is handpicked with age-appropriate themes that keep kids curious and inspired.",
  },
  {
    icon: "🔒",
    title: "Safe & Secure",
    description:
      "Enjoy worry-free shopping on a platform built with safety and privacy for your family.",
  },
  {
    icon: "🧠",
    title: "Learn & Grow",
    description:
      "Spark imagination and strengthen early literacy through fun, educational reading.",
  },
];

export default function Features() {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Parent",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      text: "My kids love the books! The selection is perfect for their age and interests. Highly recommended for every parent.",
    },
    {
      name: "Amit Verma",
      role: "Teacher",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      text: "Great platform for finding quality children's books. The safe shopping experience is a big plus for families.",
    },
    {
      name: "Neha Patel",
      role: "Parent",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "The books have really helped my child develop a love for reading. The curation is spot on!",
    },
  ];

  return (
    <>
      <section className="relative text-center py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-48 bg-blue-50/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
            Why Kids & Parents Love Us!
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-14 font-medium">
            Trusted by families and educators for joyful, safe, and inspiring reading
            journeys.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white border border-blue-100 rounded-xl shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)] transition-transform duration-300 p-10 hover:scale-105 flex flex-col items-center fade-in-up"
                style={{ animationDelay: `${index * 120}ms` }}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 shadow-md mb-6">
                  <span className="text-4xl md:text-5xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[70vw] h-40 bg-blue-50/30 rounded-full blur-2xl" />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-[#23395d] mb-12 text-center tracking-tight">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-blue-50/30 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-[1.03] flex flex-col justify-between text-left"
              >
                <div className="text-blue-400 text-4xl mb-4">“</div>
                <p className="text-gray-700 text-base md:text-lg font-medium italic mb-6">
                  {review.text}
                </p>
                <div className="border-t pt-4 mt-auto">
                  <div className="text-[#23395d] font-semibold text-lg">{review.name}</div>
                  <div className="text-sm text-blue-500 font-medium">{review.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style jsx>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.7s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
