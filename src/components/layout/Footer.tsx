import Link from "next/link";

const quickLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0d1421] to-[#1a2234] text-white pt-14 pb-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h4 className="font-bold text-lg mb-4 tracking-tight">📖 About Us</h4>
            <p className="leading-relaxed text-gray-300 font-medium">
              Mybestkid aims to make reading a joyful habit for kids, reducing screen time and nurturing young minds through the magic of books.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 tracking-tight">🔗 Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 tracking-tight">📬 Stay Connected</h4>
            <p className="text-gray-300 mb-4 font-medium">
              Follow us for updates, new book drops, and more fun!
            </p>
            <div className="flex gap-4 text-lg">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors font-medium">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-blue-200 transition-colors font-medium">Facebook</a>
            </div>
          </div>
        </div>
        <hr className="border-t border-[#232b3b] my-6" />
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-medium">
          <span>© 2025 Mybestkid. All rights reserved.</span>
          <span>Empowering young minds, one book at a time.</span>
        </div>
      </div>
    </footer>
  );
}
