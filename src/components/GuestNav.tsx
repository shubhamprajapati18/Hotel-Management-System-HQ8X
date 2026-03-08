import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ChevronDown, Bell } from "lucide-react";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Rooms & Suites", path: "/rooms" },
  { label: "Amenities", path: "/amenities" },
  { label: "Dining", path: "/dining" },
  { label: "Experiences", path: "/experiences" },
  { label: "Offers", path: "/offers" },
  { label: "Contact", path: "/contact" },
];

const darkHeroPages = ["/"];

export function GuestNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const unreadCount = useUnreadNotifications();

  const hasDarkHero = darkHeroPages.includes(location.pathname);
  const solid = scrolled || !hasDarkHero;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase() || "U"
    : "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        solid
          ? "py-3 bg-secondary/95 backdrop-blur-xl border-b border-border shadow-[0_1px_12px_hsla(40,10%,10%,0.08)]"
          : "py-5 md:py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-5 md:px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <span className={cn(
            "font-heading text-xl md:text-2xl font-semibold tracking-wide transition-colors duration-500",
            solid ? "gradient-gold-text" : "text-white"
          )}>
            HQ8X
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link-underline text-[11px] font-medium tracking-[0.18em] uppercase pb-1 transition-colors duration-300",
                solid
                  ? (location.pathname === item.path ? "text-primary active" : "text-foreground/70 hover:text-foreground")
                  : (location.pathname === item.path ? "text-white active" : "text-white/60 hover:text-white")
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/my-stay/notifications"
                className={cn(
                  "relative p-2 rounded-xl transition-colors duration-300",
                  solid ? "hover:bg-secondary text-foreground/60 hover:text-foreground" : "hover:bg-white/10 text-white/60 hover:text-white"
                )}
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors duration-300",
                  solid ? "hover:bg-secondary" : "hover:bg-white/10"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-heading font-semibold">
                  {initials}
                </div>
                <span className={cn(
                  "text-xs font-medium tracking-wider",
                  solid ? "text-foreground/70" : "text-white/70"
                )}>
                  {profile?.first_name || "Account"}
                </span>
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform",
                  profileOpen && "rotate-180",
                  solid ? "text-foreground/40" : "text-white/40"
                )} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{profile?.first_name} {profile?.last_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/my-stay"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <User className="h-3.5 w-3.5" />
                        My Stay
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-primary hover:bg-secondary/60 transition-colors"
                        >
                          <User className="h-3.5 w-3.5" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-destructive hover:bg-secondary/60 transition-colors w-full text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant={solid ? "luxury" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs tracking-wider uppercase px-5 transition-all duration-300",
                    !solid && "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  )}
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={cn("lg:hidden transition-colors", solid ? "text-foreground" : "text-white")}
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
            className="lg:hidden absolute top-full left-0 right-0 bg-secondary/98 backdrop-blur-xl border-b border-border shadow-lg"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-xs font-medium tracking-[0.18em] uppercase transition-colors duration-300",
                    location.pathname === item.path ? "text-primary" : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border my-1" />
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-heading font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{profile?.first_name} {profile?.last_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to="/my-stay" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="gold-outline" className="w-full text-xs tracking-wider uppercase">My Stay</Button>
                    </Link>
                    <Button variant="ghost" onClick={handleSignOut} className="text-xs text-destructive">
                      <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="luxury" className="w-full text-xs tracking-wider uppercase">Sign In</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
