import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e4edfb] to-[#dcdff9] text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
          <span className="text-xl">📖</span> StoryTime Adventures
        </div>
        <div className="space-x-4">
          <button className="text-gray-600">Sign In</button>
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover the Magic of Reading
        </h1>
        <p className="text-lg text-gray-600">
          Interactive stories for young minds aged 0–12
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="bg-pink-100 p-6 rounded-lg w-72 shadow">
            <h2 className="text-lg font-bold">Little Explorers</h2>
            <p className="text-blue-600 font-medium">Ages 0–3</p>
            <p className="text-sm text-gray-700 mt-2">
              Simple, engaging stories with bright pictures
            </p>
            <Link href="/books?category=toddler">
              <button className="mt-4 bg-black text-white px-4 py-2 rounded">
                Explore Books
              </button>
            </Link>
          </div>

          <div className="bg-yellow-100 p-6 rounded-lg w-72 shadow">
            <h2 className="text-lg font-bold">Growing Readers</h2>
            <p className="text-blue-600 font-medium">Ages 4–7</p>
            <p className="text-sm text-gray-700 mt-2">
              Interactive tales with read-along features
            </p>
            <Link href="/books?category=playful">
              <button className="mt-4 bg-black text-white px-4 py-2 rounded">
                Explore Books
              </button>
            </Link>
          </div>

          <div className="bg-green-100 p-6 rounded-lg w-72 shadow">
            <h2 className="text-lg font-bold">Young Adventures</h2>
            <p className="text-blue-600 font-medium">Ages 8–12</p>
            <p className="text-sm text-gray-700 mt-2">
              Chapter books with exciting storylines
            </p>
            <Link href="/books?category=school">
              <button className="mt-4 bg-black text-white px-4 py-2 rounded">
                Explore Books
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center py-16 bg-[#eaeafc]">
        <div className="flex flex-col md:flex-row justify-center gap-12 px-8">
          <div>
            <div className="text-3xl">📘</div>
            <h3 className="font-semibold mt-2">Interactive Reading</h3>
            <p className="text-sm text-gray-600">
              Engaging animations and sound effects that bring stories to life
            </p>
          </div>
          <div>
            <div className="text-3xl">👨‍👩‍👧</div>
            <h3 className="font-semibold mt-2">Parent Dashboard</h3>
            <p className="text-sm text-gray-600">
              Track reading progress and set reading goals
            </p>
          </div>
          <div>
            <div className="text-3xl">🎖️</div>
            <h3 className="font-semibold mt-2">Reading Rewards</h3>
            <p className="text-sm text-gray-600">
              Earn badges and rewards for reading achievements
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 px-8 text-sm text-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul>
              <li>Our Story</li>
              <li>Team</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul>
              <li>Help Center</li>
              <li>Parent Guide</li>
              <li>Teachers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <ul>
              <li>Contact Us</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
