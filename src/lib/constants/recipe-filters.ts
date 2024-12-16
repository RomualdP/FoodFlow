export const PREPARATION_TIME_FILTERS = [
  { value: "under_20", label: "Moins de 20 min" },
  { value: "20_30", label: "20-30 min" },
  { value: "30_45", label: "30-45 min" },
  { value: "45_60", label: "45-60 min" },
  { value: "60_90", label: "1h-1h30" },
  { value: "over_90", label: "Plus de 1h30" },
]

export const DIFFICULTY_FILTERS = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Intermédiaire" },
  { value: "hard", label: "Difficile" },
]

export const CUISINE_TYPE_FILTERS = [
  // Europe
  { value: "french", label: "Française" },
  { value: "italian", label: "Italienne" },
  { value: "mediterranean", label: "Méditerranéenne" },
  { value: "spanish", label: "Espagnole" },
  { value: "greek", label: "Grecque" },

  // Asie
  { value: "east_asian", label: "Asie de l'Est" },
  { value: "southeast_asian", label: "Asie du Sud-Est" },
  { value: "south_asian", label: "Asie du Sud" },
  { value: "middle_eastern", label: "Moyen-Orient" },

  // Amériques
  { value: "north_american", label: "Amérique du Nord" },
  { value: "latin_american", label: "Amérique Latine" },
  { value: "caribbean", label: "Caraïbes" },

  // Afrique
  { value: "north_african", label: "Afrique du Nord" },
  { value: "west_african", label: "Afrique de l'Ouest" },
  { value: "east_african", label: "Afrique de l'Est" },
  
  // Autres
  { value: "fusion", label: "Fusion" },
  { value: "other", label: "Autre" },
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