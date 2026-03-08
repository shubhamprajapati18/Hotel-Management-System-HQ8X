import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Rooms & Suites", path: "/rooms" },
  { label: "Amenities", path: "/amenities" },
  { label: "Dining", path: "/dining" },
  { label: "Experiences", path: "/experiences" },
  { label: "Offers", path: "/offers" },
  { label: "Contact", path: "/contact" },
];

export function GuestNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "py-5 md:py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-5 md:px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={cn(
            "font-heading text-xl md:text-2xl font-semibold tracking-wide transition-colors duration-500",
            scrolled ? "gradient-gold-text" : "text-white"
          )}>
            HQ8X
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link-underline text-[11px] font-medium tracking-[0.18em] uppercase pb-1 transition-colors duration-300",
                scrolled
                  ? (location.pathname === item.path ? "text-primary active" : "text-foreground/50 hover:text-foreground")
                  : (location.pathname === item.path ? "text-white active" : "text-white/60 hover:text-white")
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/my-stay">
            <Button variant="ghost" size="sm" className={cn(
              "text-xs tracking-wider uppercase transition-colors duration-300",
              scrolled ? "text-foreground/50 hover:text-primary" : "text-white/60 hover:text-white hover:bg-white/10"
            )}>
              <User className="h-3.5 w-3.5 mr-1.5" />
              My Stay
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant={scrolled ? "gold-outline" : "outline"}
              size="sm"
              className={cn(
                "text-xs tracking-wider uppercase px-5 transition-all duration-300",
                !scrolled && "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              )}
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn("lg:hidden transition-colors", scrolled ? "text-foreground" : "text-white")}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border shadow-lg"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-xs font-medium tracking-[0.18em] uppercase transition-colors duration-300",
                    location.pathname === item.path ? "text-primary" : "text-foreground/50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border my-1" />
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="gold-outline" className="w-full text-xs tracking-wider uppercase">Sign In</Button>
                </Link>
                <Link to="/my-stay" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="ghost" className="w-full text-xs tracking-wider uppercase text-foreground/50">My Stay</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
