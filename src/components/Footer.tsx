import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "Rooms & Suites", path: "/rooms" },
  { label: "Amenities", path: "/amenities" },
  { label: "Dining", path: "/dining" },
  { label: "Experiences", path: "/experiences" },
  { label: "Offers", path: "/offers" },
  { label: "Contact", path: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/60 py-14 md:py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          <div>
            <Link to="/">
              <span className="font-heading text-3xl font-semibold tracking-wide gradient-gold-text">HQ8X</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs leading-relaxed">
              Where hospitality meets perfection. A world-class luxury hotel experience.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="h-px bg-border mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50 tracking-wider">
            © 2026 HQ8X Hotel Experience Platform. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground/50 tracking-wider">
            <span className="hover:text-foreground/70 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground/70 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
