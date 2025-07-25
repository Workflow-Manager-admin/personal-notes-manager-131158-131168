"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const { signIn, signUp, user } = useAuth();

  if (user) {
    router.replace("/");
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    let resp;
    if (mode === "signin") {
      resp = await signIn(email, password);
    } else {
      resp = await signUp(email, password);
    }
    setLoading(false);
    if (resp.error) {
      setErrorMsg(resp.error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <form
        className="flex flex-col gap-5 rounded-lg shadow-lg bg-white dark:bg-[#161616] p-10 min-w-[320px] border border-gray-200"
        style={{ background: "var(--color-background, #fff)", color: "var(--color-foreground, #171717)" }}
        onSubmit={handleAuth}
      >
        <h1 className="text-xl font-bold mb-2" style={{ color: "#1976d2" }}>
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          placeholder="Email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          placeholder="Password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && (
          <span className="text-red-600 text-sm">{errorMsg}</span>
        )}
        <button
          type="submit"
          className="bg-[#1976d2] text-white rounded-md py-2 font-semibold hover:bg-[#1565c0] transition"
          disabled={loading}
        >
          {mode === "signin" ? "Login" : "Register"}
        </button>
        <div className="flex gap-1 justify-center text-sm mt-2">
          {mode === "signin" ? (
            <>
              <span>Don&apos;t have an account?</span>
              <button type="button" className="text-[#388e3c]" onClick={() => setMode("signup")}>Sign Up</button>
            </>
          ) : (
            <>
              <span>Already a user?</span>
              <button type="button" className="text-[#1976d2]" onClick={() => setMode("signin")}>Sign In</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default AuthPage;
