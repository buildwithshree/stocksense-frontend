"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { BarChart2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type Fields = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: Fields) => {
    setError("");
    try { await login(d.email, d.password); router.push("/dashboard"); }
    catch (e) { setError(getApiErrorMessage(e)); }
  };
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <BarChart2 size={20} className="text-accent" /><span className="font-semibold">StockSense</span>
        </div>
        <div className="card p-6">
          <h1 className="text-sm font-semibold mb-1">Sign in</h1>
          <p className="text-xs text-muted mb-5">Enter your credentials to continue.</p>
          {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError("")} /></div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input {...register("email")} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input {...register("password")} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-muted mt-4">
          No account? <Link href="/auth/register" className="text-accent hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
