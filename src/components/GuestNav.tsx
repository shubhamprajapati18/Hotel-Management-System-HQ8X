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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled
          ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-heading text-2xl font-semibold tracking-wide gradient-gold-text">
            HQ8X
          </span>
        </Link>

        {/* Desktop Nav — Centered */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link-underline text-[11px] font-medium tracking-[0.2em] uppercase pb-1 transition-colors duration-300",
                location.pathname === item.path
                  ? "text-primary active"
                  : "text-foreground/50 hover:text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/my-stay">
            <Button variant="ghost" size="sm" className="text-foreground/50 hover:text-primary text-xs tracking-wider uppercase">
              <User className="h-3.5 w-3.5 mr-1.5" />
              My Stay
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="gold-outline" size="sm" className="text-xs tracking-wider uppercase px-5">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground/70"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50"
          >
            <div className="flex flex-col px-8 py-8 gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-300",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-foreground/50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border/50 my-2" />
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="gold-outline" className="w-full text-xs tracking-wider uppercase">Sign In</Button>
                </Link>
                <Link to="/my-stay" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="ghost" className="w-full text-xs tracking-wider uppercase text-foreground/60">My Stay</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
