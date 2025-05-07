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
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center tracking-tight">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-white border border-blue-100 rounded-xl shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)] p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 fade-in-up">
                <div className="relative mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-16 h-16 rounded-full border-4 border-blue-100 shadow object-cover"
                  />
                  <span className="absolute -top-3 -right-3 bg-blue-400 text-white rounded-full px-2 py-1 text-xs font-bold shadow">
                    {review.role}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-blue-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
                <div className="mb-4">
                  <svg
                    className="w-7 h-7 text-blue-300 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 13h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2zm0 0v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium italic">{review.text}</p>
                </div>
                <div className="font-semibold text-gray-800 text-lg">{review.name}</div>
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
