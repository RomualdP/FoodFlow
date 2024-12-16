export const PREPARATION_TIME_FILTERS = [
  { value: "quick", label: "Rapide (< 30min)" },
  { value: "medium", label: "Moyen (30-60min)" },
  { value: "long", label: "Long (> 60min)" },
]

export const DIFFICULTY_FILTERS = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Intermédiaire" },
  { value: "hard", label: "Difficile" },
]

export const CUISINE_TYPE_FILTERS = [
  { value: "french", label: "Française" },
  { value: "italian", label: "Italienne" },
  { value: "japanese", label: "Japonaise" },
  { value: "chinese", label: "Chinoise" },
  { value: "indian", label: "Indienne" },
  { value: "mexican", label: "Mexicaine" },
  { value: "mediterranean", label: "Méditerranéenne" },
  { value: "american", label: "Américaine" },
  { value: "thai", label: "Thaïlandaise" },
  { value: "vietnamese", label: "Vietnamienne" },
]

export const DISH_TYPE_FILTERS = [
  { value: "starter", label: "Entrée" },
  { value: "main", label: "Plat principal" },
  { value: "dessert", label: "Dessert" },
  { value: "snack", label: "En-cas" },
  { value: "breakfast", label: "Petit-déjeuner" },
]

export const DIET_FILTERS = [
  { value: "vegetarian", label: "Végétarien" },
  { value: "vegan", label: "Végan" },
  { value: "gluten_free", label: "Sans gluten" },
  { value: "lactose_free", label: "Sans lactose" },
  { value: "low_carb", label: "Pauvre en glucides" },
]

export const COST_FILTERS = [
  { value: "budget", label: "Économique" },
  { value: "moderate", label: "Modéré" },
  { value: "expensive", label: "Coûteux" },
]

export type FilterCategory = {
  id: string
  label: string
  options: Array<{ value: string, label: string }>
}

export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: "preparation_time",
    label: "Temps de préparation",
    options: PREPARATION_TIME_FILTERS,
  },
  {
    id: "difficulty",
    label: "Difficulté",
    options: DIFFICULTY_FILTERS,
  },
  {
    id: "cuisine_type",
    label: "Type de cuisine",
    options: CUISINE_TYPE_FILTERS,
  },
  {
    id: "dish_type",
    label: "Type de plat",
    options: DISH_TYPE_FILTERS,
  },
  {
    id: "diet",
    label: "Régime alimentaire",
    options: DIET_FILTERS,
  },
  {
    id: "cost",
    label: "Coût",
    options: COST_FILTERS,
  },
] 