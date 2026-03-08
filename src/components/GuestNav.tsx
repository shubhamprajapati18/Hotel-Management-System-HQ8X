import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Rooms & Suites", path: "/rooms" },
  { label: "Amenities", path: "/amenities" },
  { label: "Dining", path: "/dining" },
  { label: "Experiences", path: "/experiences" },
];

export function GuestNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-panel py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold gradient-gold-text">HQ8X</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/my-stay">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary">
              <User className="h-4 w-4 mr-1" />
              My Stay
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="gold-outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/rooms">
            <Button variant="gold" size="sm">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-wide uppercase text-foreground/70 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-border" />
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="gold" className="w-full">Sign In</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
