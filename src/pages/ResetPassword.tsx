import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"request" | "update">("request");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Check if this is a recovery redirect (user clicked email link)
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setMode("update");
    }

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-heading text-3xl font-semibold tracking-wide gradient-gold-text">HQ8X</span>
          </Link>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            {mode === "request" ? (
              <Mail className="h-6 w-6 text-primary" />
            ) : (
              <KeyRound className="h-6 w-6 text-primary" />
            )}
          </div>
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight text-center">
          {mode === "request"
            ? emailSent ? "Check your email" : "Forgot your password?"
            : "Set new password"}
        </h2>
        <p className="text-muted-foreground text-sm mt-2 text-center max-w-sm mx-auto">
          {mode === "request"
            ? emailSent
              ? "We've sent a password reset link to your email. Click the link to set a new password."
              : "Enter your email and we'll send you a link to reset your password."
            : "Choose a strong password for your account."}
        </p>

        {mode === "request" && !emailSent && (
          <form onSubmit={handleRequestReset} className="mt-8 space-y-5">
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
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {mode === "request" && emailSent && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setEmailSent(false)}
            >
              Didn't receive it? Try again
            </Button>
          </div>
        )}

        {mode === "update" && (
          <form onSubmit={handleUpdatePassword} className="mt-8 space-y-5">
            <div>
              <Label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
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
            <div>
              <Label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Confirm Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 bg-secondary/50 border-border h-11 rounded-xl"
              />
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
                  Update Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
