import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export interface Ingredient {
  id: number;
  name: string;
  created_at: string;
}

export async function getIngredients() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data;
}

export async function addIngredient(name: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([{ name }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
} 