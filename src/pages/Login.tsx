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
    // Demo: admin@hq8x.com → admin, else guest
    if (email.includes("admin")) {
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      toast.success("Welcome back!");
      navigate("/my-stay");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-heading text-3xl font-bold gradient-gold-text">HQ8X</span>
          </Link>
          <p className="text-muted-foreground mt-2">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-foreground/80 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground/80 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <Button variant="luxury" className="w-full py-6" type="submit">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: use <span className="text-primary">admin@hq8x.com</span> for admin, any other email for guest.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
