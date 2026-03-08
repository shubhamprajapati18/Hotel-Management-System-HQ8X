import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isSignUp && (!firstName || !lastName)) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check if admin
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: data.user.id,
          _role: "admin",
        });

        toast.success("Welcome back!");
        navigate(isAdmin ? "/admin" : "/my-stay");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Seamless booking & check-in experience",
    "Access exclusive member-only rates",
    "Manage your stays in one place",
    "Cancel or modify anytime",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/60 flex-col justify-between p-12 xl:p-16 relative">
        <div>
          <Link to="/">
            <span className="font-heading text-2xl font-semibold tracking-wide gradient-gold-text">HQ8X</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-md"
        >
          <h1 className="font-heading text-4xl xl:text-5xl font-medium text-foreground leading-tight tracking-tight">
            {isSignUp ? "Your luxury" : "Welcome back to"}
            <br />
            <span className="text-primary">{isSignUp ? "experience awaits" : "HQ8X"}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-5 leading-relaxed max-w-sm">
            {isSignUp
              ? "Create your account and unlock a world of curated luxury stays and exclusive privileges."
              : "Sign in to manage your reservations, access exclusive offers, and enjoy a seamless luxury experience."}
          </p>

          <div className="mt-8 space-y-3.5">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="h-5 w-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-accent" />
                </div>
                <span className="text-sm text-foreground/70">{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground/40 tracking-wider">
          © 2026 HQ8X Hotel Experience Platform
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <span className="font-heading text-3xl font-semibold tracking-wide gradient-gold-text">HQ8X</span>
            </Link>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            {isSignUp ? "Start your luxury journey" : "Enter your credentials below"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">First Name</Label>
                  <Input
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 bg-secondary/50 border-border h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Last Name</Label>
                  <Input
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 bg-secondary/50 border-border h-11 rounded-xl"
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Email</Label>
              <Input
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-secondary/50 border-border h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Min. 8 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-secondary/50 border-border h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              variant="luxury"
              className="w-full py-6 rounded-xl text-sm tracking-wider uppercase"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Free Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {isSignUp && (
            <p className="text-[11px] text-muted-foreground/60 text-center mt-4 leading-relaxed">
              By signing up, you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms</span> and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          )}

          <div className="mt-6 text-center">
            <button
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span className="text-primary font-medium">{isSignUp ? "Sign in" : "Sign Up"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
