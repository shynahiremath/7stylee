import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import { errorMessage } from "../../lib/utils";
import { Field } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { Notice } from "../../components/ui/States";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const from = (location.state as { from?: string } | null)?.from || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-[46%] relative overflow-hidden bg-ink text-bone flex-col justify-between p-14">
        <span className="absolute -left-16 -bottom-24 font-display text-[420px] leading-none text-bone/5" aria-hidden>7</span>
        <p className="relative font-display text-2xl">7STYLE</p>
        <div className="relative">
          <div className="w-10 h-px bg-champagne mb-6" />
          <p className="font-display text-3xl leading-snug max-w-md">We don’t make women fit our clothes. We make clothes fit every woman.</p>
        </div>
        <p className="relative font-sans text-xs tracking-[0.2em] uppercase text-bone/40">Define Your Style</p>
      </div>
      <div className="flex-1 flex items-center justify-center bg-bone px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm animate-fade-up">
          <h1 className="font-display text-3xl mb-1">Welcome back</h1>
          <p className="font-sans text-sm text-charcoal/50 mb-10">Return to your atelier.</p>
          {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
          <div className="space-y-6 mb-9">
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="font-sans text-sm text-charcoal/60 mt-8 text-center">
            New to 7Style? <Link to="/register" className="underline hover:text-champagne">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
