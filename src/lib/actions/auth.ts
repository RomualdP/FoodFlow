import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createClientComponentClient();

export async function signInWithEmail(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: "Erreur de connexion. Vérifiez vos identifiants." };
  }
}

export async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la connexion avec Google" };
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de l'inscription. Veuillez réessayer." };
  }
} 