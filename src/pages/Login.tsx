import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (email.includes("admin")) {
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      toast.success("Welcome back!");
      navigate("/my-stay");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8 md:mb-10">
          <Link to="/">
            <span className="font-heading text-3xl font-medium tracking-wide gradient-gold-text">HQ8X</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-3">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div>
              <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-secondary/50 border-border h-11 md:h-12 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-secondary/50 border-border h-11 md:h-12 rounded-xl"
              />
            </div>
            <Button variant="luxury" className="w-full py-6 rounded-xl text-sm tracking-wider uppercase" type="submit">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-5 md:mt-6 text-center">
            <button
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground/50 text-center mt-4 md:mt-5 tracking-wide">
            Demo: use <span className="text-primary/70">admin@hq8x.com</span> for admin, any other for guest
          </p>
        </div>
      </motion.div>
    </div>
  );
}
