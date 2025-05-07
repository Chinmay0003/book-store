import Link from "next/link";

const quickLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d1421] text-white pt-14 pb-6 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h4 className="font-bold text-base mb-4 tracking-tight">📖 About Us</h4>
            <p className="leading-relaxed text-gray-300 font-medium">
              Mybestkid makes reading fun and safe for every child. Discover, enjoy, and
              share the best books—curated for curious young minds and caring families.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-4 tracking-tight">🔗 Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-4 tracking-tight">
              📬 Stay Connected
            </h4>
            <p className="text-gray-300 mb-4 font-medium">
              Follow us for updates, new book drops, and more fun!
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors font-medium">
                Twitter
              </a>
              <a
                href="#"
                className="text-white hover:text-pink-400 transition-colors font-medium">
                Instagram
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-200 transition-colors font-medium">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <hr className="border-t border-[#232b3b] my-6" />
        <div className="text-xs text-gray-400 text-center font-medium">
          © Mybestkid. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
