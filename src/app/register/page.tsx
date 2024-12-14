"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/\d/.test(value)) {
      return "Le mot de passe doit contenir au moins 1 chiffre";
    }
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  if (!mounted) {
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      router.push("/login?message=verification-email-sent");
    } catch (err: any) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Créer un compte
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
                required
                className={passwordError ? "border-red-500" : ""}
              />
              <div className="text-sm text-gray-500">
                Le mot de passe doit contenir au moins 8 caractères et 1 chiffre
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary"
            disabled={loading || !!passwordError}
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 